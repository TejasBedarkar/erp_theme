# -*- coding: utf-8 -*-
"""
Production-ready Frappe v16 API for Custom Authentication and Session Context.
Provides deep user session profiles including roles, active employee profiles,
and dynamic Allowed Modules matching security constraints for downstream AI routing.

Location: apps/custom_ui/custom_ui/api/auth.py
"""

import frappe
from frappe import _
from frappe.auth import LoginManager
from typing import Dict, Any, List, Optional
import traceback


def get_user_allowed_modules(user_id: str) -> List[str]:
    """
    Dynamically calculates modules accessible to the user based on their active roles,
    Frappe Module Def visibility rules, and Workspace availability.
    """
    if user_id == "Administrator":
        # Administrator gets global unhindered visibility across all active modules
        all_modules = frappe.get_all("Module Def", fields=["name"])
        return [m["name"] for m in all_modules]

    # 1. Fetch all Roles assigned to the current user context
    user_roles = frappe.get_roles(user_id)
    if not user_roles:
        return []

    # 2. Extract modules linked via permissions matrix definitions (DocPerm / Custom DocPerm)
    permitted_doctypes = frappe.get_all(
        "Custom DocPerm",
        filters={"role": ["in", user_roles], "read": 1},
        fields=["parent"]
    )
    
    doctype_names = [d["parent"] for d in permitted_doctypes]
    
    core_permitted = frappe.get_all(
        "DocPerm",
        filters={"role": ["in", user_roles], "read": 1},
        fields=["parent"]
    )
    doctype_names.extend([d["parent"] for d in core_permitted])
    
    if not doctype_names:
        return []

    # 3. Match those permitted Doctypes back to their respective distinct Module Definitions
    allowed_modules_query = frappe.get_all(
        "DocType",
        filters={"name": ["in", list(set(doctype_names))], "custom": 0},
        fields=["module"],
        distinct=True
    )
    
    modules = {m["module"] for m in allowed_modules_query if m.get("module")}

    # 4. Complement with module items exposed inside Workspace definitions matching their roles
    try:
        visible_workspaces = frappe.get_all(
            "Workspace",
            filters={"public": 1},
            fields=["module"]
        )
        for ws in visible_workspaces:
            if ws.get("module"):
                modules.add(ws["module"])
    except Exception:
        pass

    # Fetch active system modules cleanly without using the non-existent 'disabled' column
    active_system_modules = frappe.get_all(
        "Module Def",
        filters={"name": ["in", list(modules)]},
        fields=["name"]
    )
    
    return [m["name"] for m in active_system_modules]


@frappe.whitelist(allow_guest=True)
def custom_login(usr: str, pwd: str) -> Dict[str, Any]:
    """
    Authenticates user credentials against the secure internal Frappe LoginManager core.
    Infects active response cookies state and outputs structured user layout mappings.
    """
    try:
        # 1. Initialize and execute core authentication routines
        login_manager = LoginManager()
        login_manager.authenticate(user=usr, pwd=pwd)
        login_manager.post_login()

        # 2. Extract context structures from the fully resolved post-login target state
        session_user = frappe.session.user
        user_doc = frappe.get_doc("User", session_user)
        roles = frappe.get_roles(session_user)
        
        # 3. Dynamic Calculation of Allowed Modules block
        allowed_modules = get_user_allowed_modules(session_user)

        # 4. Safely check for accompanying integrated Employee record profiles
        employee_info = None
        try:
            employee_info = frappe.get_value(
                "Employee",
                {"user_id": session_user},
                [
                    "name", "first_name", "last_name", "department", 
                    "designation", "status", "company_email"
                ],
                as_dict=True
            )
        except Exception:
            pass  # Fail gracefully if HRMS/Employee context structure is absent

        # 5. Package cleanly into the output response payload structure
        frappe.response["message"] = {
            "status": "Success",
            "user": {
                "id": user_doc.name,
                "full_name": user_doc.full_name,
                "email": user_doc.email,
                "roles": roles,
                "allowed_modules": allowed_modules,
                "employee_profile": employee_info
            }
        }

    except frappe.AuthenticationError:
        frappe.clear_messages()
        frappe.local.response["http_status_code"] = 401
        frappe.response["message"] = {
            "status": "Failed",
            "reason": "Invalid Username or Password"
        }
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Login API Operational Error")
        frappe.local.response["http_status_code"] = 500
        frappe.response["message"] = {
            "status": "Error",
            "reason": str(e),
            "traceback": traceback.format_exc()
        }


@frappe.whitelist(allow_guest=False)
def me() -> Dict[str, Any]:
    """
    Restores, validates and parses active running session token contexts.
    Injects contextual module graphs without re-authenticating credentials.
    """
    if frappe.session.user == "Guest":
        frappe.local.response["http_status_code"] = 401
        return {"status": "Failed", "reason": "Unauthorized session verification call."}

    session_user = frappe.session.user
    user_doc = frappe.get_doc("User", session_user)
    roles = frappe.get_roles(session_user)
    allowed_modules = get_user_allowed_modules(session_user)

    employee_info = None
    try:
        employee_info = frappe.get_value(
            "Employee",
            {"user_id": session_user},
            [
                "name", "first_name", "last_name", "department", 
                "designation", "status", "company_email"
            ],
            as_dict=True
        )
    except Exception:
        pass

    return {
        "status": "Success",
        "user": {
            "id": user_doc.name,
            "full_name": user_doc.full_name,
            "email": user_doc.email,
            "roles": roles,
            "allowed_modules": allowed_modules,
            "employee_profile": employee_info
        }
    }


@frappe.whitelist(allow_guest=False)
def create_user(email: str, first_name: str) -> Dict[str, Any]:
    """Creates a basic standard core structural User account profile blueprint safely."""
    try:
        if not frappe.has_permission("User", "create"):
            frappe.local.response["http_status_code"] = 403
            return {"success": False, "message": "Lacks User creation authorization rules."}
            
        doc = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "first_name": first_name,
            "enabled": 1,
            "send_welcome_email": 0
        })
        doc.insert(ignore_permissions=False)
        return {"success": True, "user_id": doc.name}
    except Exception as e:
        frappe.local.response["http_status_code"] = 400
        return {"success": False, "reason": str(e)}


@frappe.whitelist(allow_guest=False)
def get_session_user_roles() -> Dict[str, Any]:
    """Simple rapid mapping returning roles structural lists exclusively."""
    session_user = frappe.session.user
    return {
        "user": session_user,
        "full_name": frappe.get_value("User", session_user, "full_name"),
        "roles": frappe.get_roles(session_user),
        "allowed_modules": get_user_allowed_modules(session_user)
    }


@frappe.whitelist(allow_guest=False)
def get_current_employee() -> Dict[str, Any]:
    """Resolves structural properties of the directly bound Employee asset mapping."""
    session_user = frappe.session.user
    
    employee = frappe.get_value(
        "Employee",
        {"user_id": session_user},
        [
            "name", "first_name", "last_name", "department",
            "designation", "status", "date_of_joining",
            "image", "company_email", "cell_number"
        ],
        as_dict=True
    )

    if not employee:
        frappe.local.response["http_status_code"] = 404
        frappe.throw(_("Employee record linked to this account context was not found."))

    return employee







# # ROHAN
# import frappe
# from frappe import _


# @frappe.whitelist(allow_guest=True)
# def custom_login(usr: str, pwd: str):
#     """Explicit username/password login, for non-browser clients only.
#     A browser session with an existing valid ERPNext cookie should just
#     call me() below directly instead of hitting this endpoint."""
#     try:
#         frappe.local.login_manager.authenticate(usr, pwd)
#         frappe.local.login_manager.post_login()
#     except frappe.exceptions.AuthenticationError:
#         frappe.local.response["http_status_code"] = 401
#         return {"success": False, "message": _("Invalid credentials")}

#     frappe.local.response["http_status_code"] = 200
#     return {
#         "success": True,
#         "user": frappe.session.user,
#         "full_name": frappe.utils.get_fullname(frappe.session.user),
#         "roles": frappe.get_roles(frappe.session.user),
#     }


# @frappe.whitelist()
# def me():
#     """The CURRENTLY logged-in user, resolved automatically from the
#     request's session cookie/API key -- no credentials passed in the
#     call. Call this on app load instead of prompting for a login; only
#     prompt if authenticated comes back False."""
#     user = frappe.session.user
#     if user == "Guest":
#         frappe.local.response["http_status_code"] = 401
#         return {"authenticated": False}

#     return {
#         "authenticated": True,
#         "user": user,
#         "full_name": frappe.utils.get_fullname(user),
#         "roles": frappe.get_roles(user),
#     }


# @frappe.whitelist()
# def get_session_user_roles():
#     """Every role assigned to the current session user. The frontend can
#     use this to decide which buttons/menus to show; the server-side
#     access_control.enforce_permission() is still the actual gate for the
#     actions themselves, so hiding a button here is a UX nicety, not the
#     security boundary."""
#     return frappe.get_roles(frappe.session.user)


# @frappe.whitelist()
# def get_current_employee():
#     """The Employee record linked to the current session user's login,
#     if one exists -- for HR-facing views that need the logged-in
#     person's own employee_id/department/etc."""
#     user = frappe.session.user
#     employee = frappe.db.get_value(
#         "Employee",
#         {"user_id": user},
#         ["name", "employee_name", "department", "designation", "company"],
#         as_dict=True,
#     )
#     if not employee:
#         frappe.local.response["http_status_code"] = 404
#         return {"found": False, "message": _("No Employee record linked to this user.")}
#     return {"found": True, **employee}


# @frappe.whitelist()
# def logout():
#     """Ends the current session -- included for completeness since
#     custom_login above can start one explicitly for non-browser clients."""
#     frappe.local.login_manager.logout()
#     frappe.db.commit()
#     return {"success": True}
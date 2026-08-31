import frappe
from frappe import _
import json
from typing import Dict, Any, Optional, Union, List
import traceback

@frappe.whitelist(allow_guest=False, methods=["POST", "GET"])
def execute_doc_action(
    action: Optional[str] = None,
    doctype: Optional[str] = None,
    name: Optional[str] = None,
    data: Optional[Union[Dict[str, Any], str]] = None,
    filters: Optional[Union[Dict[str, Any], List[Any], str]] = None,
    fields: Optional[Union[List[str], str]] = None,
    limit: int = 20
) -> Dict[str, Any]:
    """
    Universal Dynamic CRUD API for Frappe.
    Supported Actions: 'create', 'get_list', 'get_doc', 'update', 'submit', 'cancel', 'delete'
    """
    try:
        # 1. Postman JSON body fallback parsing
        if frappe.request and frappe.request.data:
            try:
                raw_body = json.loads(frappe.request.data.decode("utf-8"))
                action = action or raw_body.get("action")
                doctype = doctype or raw_body.get("doctype")
                name = name or raw_body.get("name")
                data = data or raw_body.get("data")
                filters = filters or raw_body.get("filters")
                fields = fields or raw_body.get("fields")
                limit = raw_body.get("limit", limit)
            except Exception:
                pass  # Fallback to function argument parameters

        # Validation: Mandatory Fields Check
        if not action or not doctype:
            frappe.throw(_("Parameters 'action' and 'doctype' are required."))

        # Stringified JSON String handling (if parameters are sent as stringified JSON)
        if isinstance(data, str):
            data = json.loads(data)
        if isinstance(filters, str):
            filters = json.loads(filters)
        if isinstance(fields, str):
            fields = json.loads(fields)

        # -------------------------------------------------------------
        # ACTION 1: CREATE (Record banana)
        # -------------------------------------------------------------
        if action == "create":
            if not data:
                frappe.throw(_("Parameter 'data' (dictionary) is required for 'create' action."))
            
            doc = frappe.get_doc({"doctype": doctype, **data})
            doc.insert(ignore_permissions=False)
            return {
                "status": "success",
                "message": _(f"{doctype} record created successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 2: GET_LIST (Multiple Records fetch karna)
        # -------------------------------------------------------------
        elif action == "get_list":
            kwargs = {
                "doctype": doctype,
                "limit_page_length": limit,
                "ignore_permissions": False
            }
            if filters:
                kwargs["filters"] = filters
            if fields:
                kwargs["fields"] = fields
            else:
                kwargs["fields"] = ["*"]

            records = frappe.get_list(**kwargs)
            return {
                "status": "success",
                "count": len(records),
                "data": records
            }

        # -------------------------------------------------------------
        # ACTION 3: GET_DOC (Single Record Full Details)
        # -------------------------------------------------------------
        elif action == "get_doc":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'get_doc' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("read")
            return {
                "status": "success",
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 4: UPDATE (Field Values Edit Karna)
        # -------------------------------------------------------------
        elif action == "update":
            if not name or not data:
                frappe.throw(_("Both 'name' and 'data' are required for 'update' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("write")
            doc.update(data)
            doc.save(ignore_permissions=False)
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' updated successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 5: SUBMIT (DocType Submit Karna - docstatus: 1)
        # -------------------------------------------------------------
        elif action == "submit":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'submit' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("submit")
            doc.submit()
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' submitted successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 6: CANCEL (Submitted Doc Cancel Karna - docstatus: 2)
        # -------------------------------------------------------------
        elif action == "cancel":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'cancel' action."))
            
            doc = frappe.get_doc(doctype, name)
            doc.check_permission("cancel")
            doc.cancel()
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' cancelled successfully."),
                "data": doc.as_dict()
            }

        # -------------------------------------------------------------
        # ACTION 7: DELETE (Record Permanently Delete Karna)
        # -------------------------------------------------------------
        elif action == "delete":
            if not name:
                frappe.throw(_("Parameter 'name' is required for 'delete' action."))
            
            frappe.delete_doc(doctype, name, ignore_permissions=False)
            return {
                "status": "success",
                "message": _(f"{doctype} '{name}' deleted successfully.")
            }

        else:
            frappe.throw(_(f"Invalid action '{action}'. Valid actions are: create, get_list, get_doc, update, submit, cancel, delete."))

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f"CRUD API Error [{action or 'Unknown'}]")
        frappe.response["http_status_code"] = 400
        return {
            "status": "error",
            "message": str(e),
            "traceback": traceback.format_exc() if frappe.conf.developer_mode else None
        }



























# #ROHAN
# """
# custom_ui/api/crud.py

# Generic doc CRUD over a single endpoint (execute_doc_action), matching
# ERP_AI.postman_collection.json's "crud" folder. Every action is gated by
# access_control.enforce_permission() against the CURRENT SESSION USER's
# roles before anything runs -- no doctype/action combination bypasses it,
# including get_list, so a user without Read on a doctype can't even
# enumerate its records.
# """

# import json

# import frappe
# from frappe import _

# from custom_ui.api.access_control import enforce_permission

# _VALID_ACTIONS = {"get_list", "get", "create", "update", "delete"}


# @frappe.whitelist()
# def execute_doc_action(action: str, doctype: str, **kwargs):
#     if action not in _VALID_ACTIONS:
#         frappe.throw(_("Unknown action: {0}").format(action), frappe.ValidationError)

#     # Role-based gate -- raises frappe.PermissionError (HTTP 403) and
#     # handles the 3-strikes admin alert internally if this user's roles
#     # don't grant `action` on `doctype` per Role Permissions Manager.
#     enforce_permission(doctype, action)

#     if action == "get_list":
#         return _get_list(doctype, kwargs)
#     if action == "get":
#         return _get(doctype, kwargs)
#     if action == "create":
#         return _create(doctype, kwargs)
#     if action == "update":
#         return _update(doctype, kwargs)
#     if action == "delete":
#         return _delete(doctype, kwargs)


# def _parse_json_arg(value):
#     """Callers may send filters/fields/data either as an already-parsed
#     dict/list or as a JSON string depending on the client -- accept
#     both instead of erroring on one of them."""
#     if isinstance(value, str):
#         try:
#             return json.loads(value)
#         except (TypeError, ValueError):
#             return value
#     return value


# def _get_list(doctype, kwargs):
#     filters = _parse_json_arg(kwargs.get("filters")) or {}
#     fields = _parse_json_arg(kwargs.get("fields")) or ["name"]
#     limit = int(kwargs.get("limit") or 20)
#     order_by = kwargs.get("order_by")

#     # frappe.get_list (not get_all) additionally applies this user's
#     # row-level permission rules (e.g. territory/user-permission
#     # restrictions configured on the DocType), on top of the doctype-
#     # level Read check enforce_permission() already did above.
#     return frappe.get_list(
#         doctype,
#         filters=filters,
#         fields=fields,
#         limit_page_length=limit,
#         order_by=order_by,
#     )


# def _get(doctype, kwargs):
#     name = kwargs.get("name")
#     if not name:
#         frappe.throw(_("'name' is required for action 'get'."), frappe.ValidationError)
#     doc = frappe.get_doc(doctype, name)
#     doc.check_permission("read")
#     return doc.as_dict()


# def _create(doctype, kwargs):
#     data = _parse_json_arg(kwargs.get("data")) or {}
#     doc = frappe.new_doc(doctype)
#     doc.update(data)
#     doc.insert()
#     frappe.db.commit()
#     return doc.as_dict()


# def _update(doctype, kwargs):
#     name = kwargs.get("name")
#     data = _parse_json_arg(kwargs.get("data")) or {}
#     if not name:
#         frappe.throw(_("'name' is required for action 'update'."), frappe.ValidationError)
#     doc = frappe.get_doc(doctype, name)
#     doc.update(data)
#     doc.save()
#     frappe.db.commit()
#     return doc.as_dict()


# def _delete(doctype, kwargs):
#     name = kwargs.get("name")
#     if not name:
#         frappe.throw(_("'name' is required for action 'delete'."), frappe.ValidationError)
#     frappe.delete_doc(doctype, name, ignore_permissions=False)
#     frappe.db.commit()
#     return {"success": True, "deleted": name}
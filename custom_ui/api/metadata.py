# -*- coding: utf-8 -*-
"""
Production-ready Frappe v16 API for comprehensive DocType metadata extraction.
Enforces strict dynamic user-permission tracking down to the individual FIELD level,
explicitly telling the downstream LangGraph AI exactly what it can read or write.

Location: apps/custom_ui/custom_ui/api/metadata.py
Route: /api/method/custom_ui.api.metadata.get_complete_doctype_metadata
"""

import frappe
from frappe import _
from frappe.model.meta import Meta
from typing import Dict, Any, List, Optional, Set
import traceback
from custom_ui.api.access_control import enforce_permission   #ROHAN


def get_all_properties(obj: Any) -> Dict[str, Any]:
    """Extracts all non-private attributes dynamically from a Frappe object."""
    if not obj:
        return {}
    
    properties = {}
    attrs = dir(obj) if not hasattr(obj, "as_dict") else obj.as_dict().keys()
    
    for attr in attrs:
        if attr.startswith("_") or attr in ["parent", "parentfield", "parenttype", "doctype"]:
            continue
        try:
            val = obj.get(attr) if hasattr(obj, "get") else getattr(obj, attr, None)
            if not callable(val):
                properties[attr] = val
        except Exception:
            continue
    return properties


def serialize_meta_doc(meta_obj: Any) -> Dict[str, Any]:
    """Dict conversion ensuring objects convert cleanly to JSON structures."""
    if hasattr(meta_obj, "as_dict"):
        return meta_obj.as_dict()
    return get_all_properties(meta_obj)


def extract_doctype_base_info(meta: Meta) -> Dict[str, Any]:
    """Extracts standard fields from the base DocType schema definition."""
    fields_to_extract = [
        "name", "module", "description", "owner", "creation", "modified", 
        "is_single", "is_tree", "is_submittable", "is_virtual", "is_child_table", 
        "autoname", "title_field", "image_field", "search_fields", "sort_field", 
        "sort_order", "editable_grid", "allow_copy", "allow_import", "allow_rename", 
        "allow_events", "track_changes", "track_seen", "engine", "naming_rule"
    ]
    
    info = {}
    for field in fields_to_extract:
        info[field] = getattr(meta, field, None)
    return info


def extract_workflow(doctype: str) -> Dict[str, Any]:
    """Resolves Active Workflow schema definitions, states, and transitions."""
    workflow_info = {"has_workflow": False, "workflow_name": None, "states": [], "transitions": []}
    
    workflow_name = frappe.db.get_value("Workflow", {"document_type": doctype, "is_active": 1}, "name")
    if not workflow_name:
        return workflow_info
        
    try:
        workflow = frappe.get_doc("Workflow", workflow_name)
        workflow_info["has_workflow"] = True
        workflow_info["workflow_name"] = workflow_name
        workflow_info["states"] = [serialize_meta_doc(s) for s in workflow.states]
        workflow_info["transitions"] = [serialize_meta_doc(t) for t in workflow.transitions]
    except Exception as e:
        frappe.log_error(f"Error parsing workflow for {doctype}: {str(e)}", "Metadata API Error")
        
    return workflow_info


def process_fields(doctype: str, meta: Meta, visited_child_tables: Set[str]) -> Dict[str, Any]:
    """
    Parses fields, maps layout grids, and dynamically evaluates field-level 
    permissions ('user_can_read', 'user_can_write') safely based on Frappe's permlevels.
    """
    fields_metadata = {}
    
    required_fields = []
    optional_fields = []
    read_only_fields = []
    hidden_fields = []
    unique_fields = []
    link_fields = []
    dynamic_links = []
    table_fields = []
    child_tables_tree = {}
    
    tab_breaks = []
    section_breaks = []
    column_breaks = []
    
    dependency_graph = {"depends_on": {}, "mandatory_depends_on": {}, "read_only_depends_on": {}}
    layout_hierarchy = []
    
    current_tab = {"tab": "Main", "sections": []}
    current_section = {"section": "Default", "columns": []}
    current_column = {"fields": []}
    
    # Native way to fetch permitted permlevels for the current logged-in session user
    import frappe.permissions
    user_perms = frappe.permissions.get_doc_permissions(meta)
    
    # Extract allowed read/write permlevels arrays
    read_permitted_levels = user_perms.get("read_permlevels", [0])
    write_permitted_levels = user_perms.get("write_permlevels", [0])
    
    fields_list = meta.fields if hasattr(meta, "fields") else []
    
    for df in fields_list:
        field_props = get_all_properties(df)
        fname = field_props.get("fieldname") or f"__no_fieldname_{field_props.get('fieldtype')}"
        ftype = field_props.get("fieldtype")
        permlevel = field_props.get("permlevel") or 0
        
        # --- AI AUKAT CHECK (NATIVE FIELD-LEVEL PERMISSIONS) ---
        user_can_read = 1 if permlevel in read_permitted_levels else 0
        user_can_write = 1 if permlevel in write_permitted_levels else 0

        field_props["user_can_read"] = user_can_read
        field_props["user_can_write"] = user_can_write
        # --------------------------------------------------------
        
        fields_metadata[fname] = field_props
        
        if ftype == "Tab Break":
            tab_breaks.append(fname)
            if current_column["fields"]: current_section["columns"].append(current_column)
            if current_section["columns"] or current_section["section"] != "Default": current_tab["sections"].append(current_section)
            layout_hierarchy.append(current_tab)
            current_tab = {"tab": fname, "label": field_props.get("label"), "sections": []}
            current_section = {"section": "Default", "columns": []}
            current_column = {"fields": []}
            continue
            
        elif ftype == "Section Break":
            section_breaks.append(fname)
            if current_column["fields"]: current_section["columns"].append(current_column)
            if current_section["columns"] or current_section["section"] != "Default": current_tab["sections"].append(current_section)
            current_section = {"section": fname, "label": field_props.get("label"), "columns": []}
            current_column = {"fields": []}
            continue
            
        elif ftype == "Column Break":
            column_breaks.append(fname)
            if current_column["fields"]: current_section["columns"].append(current_column)
            current_column = {"fields": []}
            continue

        current_column["fields"].append(fname)
        
        for dep_type in ["depends_on", "mandatory_depends_on", "read_only_depends_on"]:
            if field_props.get(dep_type):
                dependency_graph[dep_type][fname] = field_props.get(dep_type)

        if field_props.get("reqd") or field_props.get("mandatory_depends_on"): required_fields.append(fname)
        else: optional_fields.append(fname)
        if field_props.get("read_only"): read_only_fields.append(fname)
        if field_props.get("hidden"): hidden_fields.append(fname)
        if field_props.get("unique"): unique_fields.append(fname)
            
        if ftype == "Link":
            link_fields.append({"field": fname, "target_doctype": field_props.get("options")})
        elif ftype == "Dynamic Link":
            dynamic_links.append({"field": fname, "options_field": field_props.get("options")})
        elif ftype == "Table":
            table_fields.append(fname)
            child_dt = field_props.get("options")
            if child_dt and child_dt not in visited_child_tables:
                visited_child_tables.add(child_dt)
                child_tables_tree[child_dt] = get_complete_metadata_internal(child_dt, visited_child_tables)

    if current_column["fields"]: current_section["columns"].append(current_column)
    if current_section["columns"] or current_section["section"] != "Default": current_tab["sections"].append(current_section)
    layout_hierarchy.append(current_tab)

    return {
        "all_fields": fields_metadata, "required_fields": required_fields, "optional_fields": optional_fields,
        "read_only_fields": read_only_fields, "hidden_fields": hidden_fields, "unique_fields": unique_fields,
        "link_fields": link_fields, "dynamic_links": dynamic_links, "table_fields": table_fields,
        "child_tables": child_tables_tree, "tab_breaks": tab_breaks, "section_breaks": section_breaks,
        "column_breaks": column_breaks, "dependency_graph": dependency_graph, "layout": layout_hierarchy
    }


def get_complete_metadata_internal(doctype: str, visited_child_tables: Set[str]) -> Dict[str, Any]:
    """Generates an explicit system map blueprint structure of a given DocType."""
    if not frappe.db.exists("DocType", doctype):
        raise frappe.DoesNotExistError(f"DocType target structure '{doctype}' does not exist.")
        
    meta = frappe.get_meta(doctype)
    base_info = extract_doctype_base_info(meta)
    field_analytics = process_fields(doctype, meta, visited_child_tables)
    workflow = extract_workflow(doctype)
    
    # Global level permissions summary for the user
    user_global_permissions = {
        "read": 1 if frappe.has_permission(doctype, "read") else 0,
        "write": 1 if frappe.has_permission(doctype, "write") else 0,
        "create": 1 if frappe.has_permission(doctype, "create") else 0,
        "delete": 1 if frappe.has_permission(doctype, "delete") else 0,
        "submit": 1 if frappe.has_permission(doctype, "submit") else 0,
        "cancel": 1 if frappe.has_permission(doctype, "cancel") else 0,
        "amend": 1 if frappe.has_permission(doctype, "amend") else 0,
    }

    return {
        "basic_info": base_info,
        "user_global_permissions": user_global_permissions,
        "fields": field_analytics["all_fields"],
        "required_fields": field_analytics["required_fields"],
        "optional_fields": field_analytics["optional_fields"],
        "read_only_fields": field_analytics["read_only_fields"],
        "hidden_fields": field_analytics["hidden_fields"],
        "unique_fields": field_analytics["unique_fields"],
        "link_fields": field_analytics["link_fields"],
        "dynamic_links": field_analytics["dynamic_links"],
        "table_fields": field_analytics["table_fields"],
        "child_tables": field_analytics["child_tables"],
        "tab_breaks": field_analytics["tab_breaks"],
        "section_breaks": field_analytics["section_breaks"],
        "column_breaks": field_analytics["column_breaks"],
        "workflow": workflow,
        "dependency_graph": field_analytics["dependency_graph"],
        "layout": field_analytics["layout"],
        "field_order": list(field_analytics["all_fields"].keys())
    }


@frappe.whitelist(allow_guest=False, methods=["GET", "POST"])
def get_complete_doctype_metadata(doctype: Optional[str] = None) -> Dict[str, Any]:
    """Exposed API endpoint resolving full recursive structural schemas with exact user rights mapping."""
    if frappe.session.user == "Guest":
        frappe.local.response["http_status_code"] = 401
        return {"success": False, "error_type": "Unauthorized", "message": "Please login first."}

    params = frappe.local.form_dict
    target_doctype = doctype or params.get("doctype")
    
    if not target_doctype:
        frappe.local.response["http_status_code"] = 400
        return {"success": False, "error_type": "MissingParameter", "message": "Missing 'doctype'."}
        
    try:
        # Check overall DocType Doc-level permission
        if not frappe.has_permission(target_doctype, "read"):
            frappe.local.response["http_status_code"] = 403
            return {
                "success": False,
                "error_type": "PermissionDenied",
                "message": f"User '{frappe.session.user}' has NO access to view metadata for: {target_doctype}"
            }
            
        visited_nodes: Set[str] = {target_doctype}
        payload = get_complete_metadata_internal(target_doctype, visited_nodes)
        
        return {
            "success": True,
            "doctype": target_doctype,
            "current_user": frappe.session.user,
            "data": payload
        }
        
    except Exception as e:
        frappe.local.response["http_status_code"] = 500
        return {"success": False, "error_type": "ServerException", "message": str(e), "traceback": traceback.format_exc()}



# # ROHAN
# @frappe.whitelist()
# def get_complete_doctype_metadata(doctype: str):
#     enforce_permission(doctype, "get_list")  # "read"-equivalent gate

#     meta = frappe.get_meta(doctype)
#     return {
#         "doctype": doctype,
#         "fields": [
#             {
#                 "fieldname": f.fieldname,
#                 "label": f.label,
#                 "fieldtype": f.fieldtype,
#                 "reqd": f.reqd,
#                 "options": f.options,
#                 "read_only": f.read_only,
#             }
#             for f in meta.fields
#         ],
#         "permissions": meta.permissions,
#         "roles": frappe.get_roles(frappe.session.user),
#     }

@frappe.whitelist()
def get_modules_summary():
    """Returns a list of all active modules in ERPNext/Frappe."""
    modules = frappe.get_all("Module Def", fields=["name", "module_name", "app_name"])
    return modules

@frappe.whitelist()
def get_module_doctypes(module: str):
    """Returns all accessible Doctypes within a given module."""
    doctypes = frappe.get_all(
        "DocType",
        filters={"module": module, "istable": 0, "custom": 0},
        fields=["name", "description"]
    )
    # Also fetch custom doctypes in this module
    custom_doctypes = frappe.get_all(
        "DocType",
        filters={"module": module, "istable": 0, "custom": 1},
        fields=["name", "description"]
    )
    
    return doctypes + custom_doctypes

@frappe.whitelist()
def get_link_options(doctype: str, search_text: str = ""):
    """Dynamically search and return valid options for a Link field."""
    import frappe.desk.search
    try:
        results = frappe.desk.search.search_link(doctype, search_text)
        return [{"value": r[0], "description": r[1] if len(r) > 1 else ""} for r in results]
    except Exception:
        filters = {}
        if search_text:
            filters["name"] = ["like", f"%{search_text}%"]
        results = frappe.get_all(doctype, filters=filters, limit=20, pluck="name")
        return [{"value": r} for r in results]

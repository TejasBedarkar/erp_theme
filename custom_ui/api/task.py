import frappe

@frappe.whitelist()
def get_list_of_task_order():
    session_user = frappe.session.user
    
    if session_user == "Guest":
        frappe.local.response["http_status_code"] = 401
        return {"status": "Failed", "reason": "Unauthorized access"}

    tasks = frappe.get_all(
        "task_work",
        fields=["name", "task_name", "location_id", "status", "assigned_to"],
        order_by="creation desc"
    )

    return {
        "status": "Success",
        "requested_by": session_user,
        "total_count": len(tasks),
        "data": tasks
    }
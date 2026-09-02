import frappe

@frappe.whitelist(allow_guest=True)
def get_all_tasks():
    # Database ke saare tasks fetch karein
    tasks = frappe.get_all(
        "task_work",
        fields=["name", "task_name", "location_id", "status", "assigned_to"],
        order_by="creation desc"
    )
    return tasks
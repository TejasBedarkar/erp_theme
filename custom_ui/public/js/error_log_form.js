// Only the title is rebranded. `error` holds the traceback, which points at
// files that really do live under `apps/frappe` and `apps/erpnext`.

frappe.ui.form.on("Error Log", {
	refresh(frm) {
		magnaerp.method_path.rebrand_field(frm.doctype, "method");
		magnaerp.method_path.rebrand_page_title(frm);
	},
});

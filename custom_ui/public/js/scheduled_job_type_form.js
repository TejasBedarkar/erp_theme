// `method` is the path the scheduler resolves, and this document is saveable,
// so only its rendering is rebranded - the stored value stays untouched.

frappe.ui.form.on("Scheduled Job Type", {
	refresh(frm) {
		magnaerp.method_path.rebrand_field(frm.doctype, "method");
		magnaerp.method_path.rebrand_page_title(frm);
	},
});

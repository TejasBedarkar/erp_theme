// The RQ Job document is virtual - `db_insert` and `db_update` are no-ops and
// the form is disabled - so rebranding the loaded copy only changes what is
// rendered. `onload` runs before the header, which keeps the page title in sync.
//
// `Exception` is left untouched: a traceback points at files on disk, which
// still live under `apps/frappe` and `apps/erpnext`.

(() => {
	function rebrand(frm) {
		frm.doc.job_name = magnaerp.method_path.to_brand(frm.doc.job_name);
		frm.doc.arguments = magnaerp.method_path.to_brand_paths(frm.doc.arguments);
	}

	frappe.ui.form.on("RQ Job", {
		onload: rebrand,
		refresh: rebrand,
	});
})();

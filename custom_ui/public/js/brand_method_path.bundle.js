// Shows framework method paths under the MagnaERP brand in Desk list views.
//
// Only the rendered text is rebranded. The stored value keeps its real
// `frappe.` / `erpnext.` prefix because the scheduler and the background
// workers resolve it through `frappe.get_attr()`, which rejects any prefix
// that is not an installed app.

frappe.provide("magnaerp.method_path");

(() => {
	const BRAND = "magnaerp";
	const SOURCE_PREFIX = /^(?:frappe|erpnext)\./;
	const QUOTED_SOURCE_PREFIX = /"(?:frappe|erpnext)\./g;
	const BRAND_PREFIX = /magnaerp\.?/gi;

	function to_brand(value) {
		return typeof value === "string" ? value.replace(SOURCE_PREFIX, `${BRAND}.`) : value;
	}

	// Rebrands every quoted method path inside a blob of text, such as the JSON
	// payload of a job. The opening quote keeps unrelated words out of the match.
	function to_brand_paths(text) {
		return typeof text === "string" ? text.replace(QUOTED_SOURCE_PREFIX, `"${BRAND}.`) : text;
	}

	function to_source(value) {
		return typeof value === "string" ? value.replace(BRAND_PREFIX, "") : value;
	}

	function is_searchable(value) {
		return typeof value !== "string" || value.replace(/%/g, "") !== "";
	}

	function to_source_filters(filters, fieldname) {
		const translated = [];

		for (const filter of filters) {
			if (filter[1] !== fieldname) {
				translated.push(filter);
				continue;
			}

			const value = to_source(filter[3]);
			if (is_searchable(value)) {
				translated.push([filter[0], filter[1], filter[2], value]);
			}
		}

		return translated;
	}

	// `get_filters_for_args` feeds both the list query and the count query, so
	// rebranded search terms are translated back to the stored value here.
	function bridge_search(listview, fieldname) {
		// If a future release drops this method, skip the bridge instead of
		// throwing: the search term stays unbranded but the list still renders.
		if (listview.__magnaerp_search_bridged || typeof listview.get_filters_for_args !== "function") {
			return;
		}

		listview.__magnaerp_search_bridged = true;

		const get_filters_for_args = listview.get_filters_for_args.bind(listview);
		listview.get_filters_for_args = () => to_source_filters(get_filters_for_args(), fieldname);
	}

	function chain_onload(settings, fieldname) {
		const previous_onload = settings.onload;

		settings.onload = function (listview) {
			previous_onload?.call(this, listview);
			bridge_search(listview, fieldname);
		};
	}

	// Doctypes whose title field holds a method path. The document itself is
	// never touched, so a saveable doctype keeps its real value.
	const BRANDED_TITLES = new Set(["Scheduled Job Type", "Error Log"]);

	// Feeds `frm.get_title()` and the form sidebar.
	function rebrand_doc_titles() {
		const model = frappe.model;
		if (typeof model?.get_doc_title !== "function") return;

		const get_doc_title = model.get_doc_title;
		model.get_doc_title = function (doc) {
			const title = get_doc_title.call(this, doc);
			return BRANDED_TITLES.has(doc?.doctype) ? to_brand(title) : title;
		};
	}

	// A Link field renders the target's title. Rebranding on read keeps
	// `frappe._link_titles` holding the stored name, which is what gets saved.
	function rebrand_link_titles(doctype) {
		const utils = frappe.utils;
		if (typeof utils?.get_link_title !== "function") return;

		const get_link_title = utils.get_link_title;
		utils.get_link_title = function (linked_doctype, name) {
			const title = get_link_title.call(this, linked_doctype, name);
			return linked_doctype === doctype ? to_brand(title) : title;
		};

		const fetch_link_title = utils.fetch_link_title;
		utils.fetch_link_title = function (linked_doctype, name) {
			const title = fetch_link_title.call(this, linked_doctype, name);
			return linked_doctype === doctype && title instanceof Promise
				? title.then(to_brand)
				: title;
		};
	}

	magnaerp.method_path.to_brand = to_brand;
	magnaerp.method_path.to_brand_paths = to_brand_paths;

	// Read-only fields render through `frappe.format`, which honours a formatter
	// set on the standard docfield. The document itself is left untouched, so a
	// saved doctype keeps its real method path.
	magnaerp.method_path.rebrand_field = (doctype, fieldname) => {
		const df = frappe.meta.get_docfield(doctype, fieldname);
		if (df) {
			df.formatter = to_brand;
		}
	};

	// The page heading reads the document directly, so it is re-set once the
	// toolbar has rendered - that is, from the form's `refresh` handler.
	magnaerp.method_path.rebrand_page_title = (frm) => {
		const title_field = frm.meta?.title_field;
		if (!title_field) return;

		const title = to_brand((frm.doc[title_field] || "").toString().trim());
		if (title) {
			frm.page.set_title(title);
		}
	};

	magnaerp.method_path.rebrand_listview = (doctype, fieldname, { searchable = false } = {}) => {
		const settings = frappe.listview_settings[doctype] || (frappe.listview_settings[doctype] = {});

		settings.formatters = { ...settings.formatters, [fieldname]: to_brand };

		if (searchable) {
			chain_onload(settings, fieldname);
		}
	};

	rebrand_link_titles("Scheduled Job Type");
	rebrand_doc_titles();
})();

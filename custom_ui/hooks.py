app_name = "custom_ui"
app_title = "MagnaERP"
app_publisher = "sd"
app_description = "sd"
app_email = "asd@ansd.com"
app_license = "mit"

app_include_css = [
	"custom_ui.bundle.css"
]

app_include_js = [
	"custom_ui.bundle.js",
	"desk_custom.bundle.js",
	"sidebar_custom.bundle.js",
	"chatbot_widget.bundle.jsx",
	"iot_dashboard.bundle.js",
	# "manufacturing_dashboard_injector.bundle.js",
	# "desktop_theme_modifier.bundle.js"
	"desk_icon.bundle.js",
	# "branding.js", 
	# "magna_login.js",
	"/assets/custom_ui/js/list_view.js",
	# Bundled so the hashed filename busts the browser cache on every change.
	"brand_method_path.bundle.js",
]

doctype_js = {
	"RQ Job": "public/js/rq_job_form.js",
	"Scheduled Job Type": "public/js/scheduled_job_type_form.js",
	"Error Log": "public/js/error_log_form.js",
}

doctype_list_js = {
	"RQ Job": "public/js/rq_job_list.js",
	"Scheduled Job Type": "public/js/scheduled_job_type_list.js",
	"Scheduled Job Log": "public/js/scheduled_job_log_list.js",
	"Error Log": "public/js/error_log_list.js",
}

web_include_css = [
    "/assets/custom_ui/css/magna_login.css",
]

web_include_js = [
    "/assets/custom_ui/js/magna_login.js",
]

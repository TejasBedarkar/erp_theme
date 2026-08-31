$(document).on('app_ready', function() {
    // MutationObserver setup jo HTML me badlao par nazar rakhega
    const observer = new MutationObserver((mutations) => {
        // Jab bhi naye elements screen par aayenge
        $('.frappe-menu.context-menu .dropdown-menu-item').each(function() {
            let itemText = $(this).find('.menu-item-title').text().trim();
            
            if (itemText === "About" || itemText === "Frappe Support") {
                $(this).remove();
            }
        });
    });

    // Poore HTML body ko observe karna shuru karega
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// frappe.router.on("change", () => {
//     setTimeout(() => {
//         document.querySelectorAll(".grid-description").forEach(el => {
//             if (
//                 el.innerText.includes("ERPNext") ||
//                 el.innerText.includes("Frappe")
//             ) {
//                 el.remove();   // किंवा el.style.display = "none";
//             }
//         });
//     }, 500);
// });

// Branding of the framework's own wording now lives in translations/en.csv.
// Rewriting every text node on the page also rewrote what users typed into
// fields, which made the stored value impossible to read back.

frappe.ui.form.on("System Settings", {
    refresh(frm) {
        setTimeout(() => {
            frm.fields_dict.default_app.$input
                .find('option[value="erpnext"]')
                .text("MagnaERP");
        }, 300);
    }
});
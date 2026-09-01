function replaceBranding(root) {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
        const parentTag = root.parentElement?.tagName;
        if (!root.nodeValue || ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(parentTag)) return;
        root.nodeValue = root.nodeValue.replace(/ERPNext/g, 'MagnaERP').replace(/Frappe/g, 'Magna');
        return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE || root.matches('script, style, textarea')) return;

    const menuItems = root.matches('.frappe-menu.context-menu .dropdown-menu-item')
        ? [root]
        : root.querySelectorAll('.frappe-menu.context-menu .dropdown-menu-item');
    menuItems.forEach((item) => {
        const title = item.querySelector('.menu-item-title')?.textContent.trim();
        if (title === 'About' || title === 'Frappe Support') item.remove();
    });

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            return ['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.parentElement?.tagName)
                ? NodeFilter.FILTER_REJECT
                : NodeFilter.FILTER_ACCEPT;
        }
    });
    let node;
    while ((node = walker.nextNode())) {
        if (!node.nodeValue || (!node.nodeValue.includes('ERPNext') && !node.nodeValue.includes('Frappe'))) continue;
        node.nodeValue = node.nodeValue.replace(/ERPNext/g, 'MagnaERP').replace(/Frappe/g, 'Magna');
    }
}

$(document).on('app_ready', function() {
    replaceBranding(document.body);
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(({ addedNodes }) => addedNodes.forEach(replaceBranding));
    });
    observer.observe(document.body, { childList: true, subtree: true });
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

frappe.ui.form.on("System Settings", {
    refresh(frm) {
        setTimeout(() => {
            frm.fields_dict.default_app.$input
                .find('option[value="erpnext"]')
                .text("MagnaERP");
        }, 300);
    }
});

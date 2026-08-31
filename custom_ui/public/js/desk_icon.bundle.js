/**
 * Custom UI - Dynamic Theme Adaptive Premium Grid Icon Mapper for Frappe v16
 * Fix: Exact Dynamic SPA Route Checking for Consistent Smooth Scrolling Across All Pages
 */

(function () {
    // 1. Precise Frappe Route Checker
    function isOnlyDeskHome() {
        // Never block scrolling while a dialog, search result, dropdown or input
        // is active on top of the Desk home page.
        if (document.querySelector('.modal.show, .modal-open, .search-dialog, .dropdown-menu.show, .awesomplete > ul:not([hidden])') ||
            document.activeElement?.matches('input, textarea, select, [contenteditable="true"]')) {
            return false;
        }
        if (window.frappe && frappe.get_route) {
            const currentRoute = frappe.get_route();
            // Checking if current active view is strictly the main Desk Home/Workspaces grid
            return Array.isArray(currentRoute) && (currentRoute.length === 0 || currentRoute[0] === 'desk' || currentRoute[0] === 'workspaces');
        }
        // Fallback DOM Inspection
        return Boolean(document.querySelector('.desktop-wrapper, .workspace-desktop') && !document.querySelector('.page-container .form-page, .list-page, .report-page, .modal-open'));
    }

    // 2. Event Listeners with Active Route Validation
    window.addEventListener('wheel', function (e) {
        if (isOnlyDeskHome()) {
            e.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('touchmove', function (e) {
        if (isOnlyDeskHome()) {
            e.preventDefault();
        }
    }, { passive: false });

    // Lucide Icon Mapping
    const ICON_MAPPING = {
        // Main Workspace & Common Desk Icons
        "Home": "home",
        "Support": "headset",
        "MagnaERP": "cpu",
        "CRM": "briefcase-business",
        "Framework": "box",
        "Organization": "building-2",
        "Accounting": "layout-grid",
        "Assets": "package",
        "Buying": "shopping-cart",
        "Manufacturing": "factory",
        "Projects": "landmark",
        "Quality": "shield-check",
        "Selling": "shopping-bag",
        "Stock": "package-check",
        "Subcontracting": "refresh-cw",
        "ERPNext Settings": "settings",
        "MagnaERP Settings": "settings",
        "Frappe HR": "user-check",
        "MagnaHR": "user",

        // Framework Sub-Items
        "Automation": "cpu",
        "Build": "hammer",
        "Data": "database",
        "Email": "mail",
        "Integrations": "blocks",
        "Printing": "printer",
        "System": "terminal",
        "Users": "users-round",
        "Website": "globe",

        // Accounting Sub-Items
        "Invoicing": "file-spreadsheet",
        "Payments": "receipt-text",
        "Financial Reports": "trending-up",
        "Accounts Setup": "sliders",
        "Taxes": "book-open-text",
        "Banking": "dollar-sign",
        "Budget": "wallet",
        "Share Management": "users",
        "Subscription": "monitor-check",

        // MagnaHR Sub-Items
        "Expenses": "credit-card",
        "HR Setup": "sliders-horizontal",
        "Leaves": "calendar-off",
        "Payroll": "coins",
        "Performance": "award",
        "Recruitment": "user-plus",
        "Shift & Attendance": "clock",
        "Tax & Benefits": "percent",
        "Tenure": "hourglass"
    };

    // Color Gradients
    const COLOR_MAPPING = {
        "Home": "linear-gradient(135deg, #64748b 0%, #334155 100%)",
        "Support": "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
        "MagnaERP": "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
        "CRM": "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
        "Framework": "linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)",
        "Organization": "linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)",
        "Accounting": "linear-gradient(135deg, #34d399 0%, #059669 100%)",
        "Assets": "linear-gradient(135deg, #fb923c 0%, #ea580c 100%)",
        "Buying": "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
        "Manufacturing": "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)",
        "Projects": "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
        "Quality": "linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%)",
        "Selling": "linear-gradient(135deg, #c084fc 0%, #9333ea 100%)",
        "Stock": "linear-gradient(135deg, #60a5fa 0%, #1d4ed8 100%)",
        "Subcontracting": "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
        "ERPNext Settings": "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
        "MagnaERP Settings": "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
        "Frappe HR": "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
        "MagnaHR": "linear-gradient(135deg, #34d399 0%, #059669 100%)"
    };

    // Glow Shadows
    const SHADOW_MAPPING = {
        "Home": "rgba(51, 65, 85, 0.65)",
        "Support": "rgba(234, 88, 12, 0.65)",
        "MagnaERP": "rgba(79, 70, 229, 0.65)",
        "CRM": "rgba(219, 39, 119, 0.65)",
        "Framework": "rgba(124, 58, 237, 0.65)",
        "Organization": "rgba(37, 99, 235, 0.65)",
        "Accounting": "rgba(5, 150, 105, 0.65)",
        "Assets": "rgba(234, 88, 12, 0.65)",
        "Buying": "rgba(2, 132, 199, 0.65)",
        "Manufacturing": "rgba(79, 70, 229, 0.65)",
        "Projects": "rgba(13, 148, 136, 0.65)",
        "Quality": "rgba(29, 78, 216, 0.65)",
        "Selling": "rgba(147, 51, 234, 0.65)",
        "Stock": "rgba(29, 78, 216, 0.65)",
        "Subcontracting": "rgba(217, 119, 6, 0.65)",
        "ERPNext Settings": "rgba(2, 132, 199, 0.65)",
        "MagnaERP Settings": "rgba(2, 132, 199, 0.65)",
        "Frappe HR": "rgba(220, 38, 38, 0.65)",
        "MagnaHR": "rgba(5, 150, 105, 0.65)"
    };

    function injectLucideIcon(element, iconName, label) {
        if (!window.lucide) return;

        try {
            if (element.querySelector('svg.custom-adaptive-icon')) return;
            element.innerHTML = "";

            const iconNode = document.createElement('i');
            iconNode.setAttribute('data-lucide', iconName);
            iconNode.classList.add("custom-adaptive-icon");

            element.appendChild(iconNode);

            const bgGradient = COLOR_MAPPING[label] || "linear-gradient(135deg, #818cf8, #4f46e5)";
            const glowColor = SHADOW_MAPPING[label] || "rgba(79, 70, 229, 0.65)";

            element.style.background = bgGradient;
            element.style.setProperty('--glow-color', glowColor);

            window.lucide.createIcons({
                attrs: {
                    'stroke-width': 2.2,
                    'width': '26',
                    'height': '26'
                }
            });

            const generatedSvg = element.querySelector('svg');
            if (generatedSvg) {
                generatedSvg.classList.add('custom-adaptive-icon');
            }

            element.style.display = "flex";
            element.style.opacity = "1";
            element.style.visibility = "visible";

        } catch (error) {
            console.error(`[MagnaERP UI] Render error:`, error);
        }
    }

    function executeGlobalIconScan() {
        const targetCards = document.querySelectorAll('.desktop-icon, .workspace-link-item, [data-link-type="workspace"], .removed-icon-item, .extra-icon-item');
        if (!targetCards.length) return;

        targetCards.forEach(card => {
            let label = card.getAttribute('data-id') || card.getAttribute('data-label') || card.getAttribute('title');
            if (!label) {
                const textEl = card.querySelector('.link-text, .desktop-icon-label, h3, span, .label');
                if (textEl) label = textEl.textContent.trim();
            }

            if (!label) return;

            const matchedIcon = ICON_MAPPING[label] || "app-window";

            card.classList.add('custom-premium-card');

            const targetIconContainer = card.querySelector('.icon-container, .link-icon, .icon-wrapper, .avatar-frame, .icon-box');
            if (targetIconContainer) {
                const nativeImg = targetIconContainer.querySelector('img');
                if (nativeImg) nativeImg.style.display = 'none';

                const nativeSvg = targetIconContainer.querySelector('svg:not(.custom-adaptive-icon)');
                if (nativeSvg) nativeSvg.style.display = 'none';

                injectLucideIcon(targetIconContainer, matchedIcon, label);
            }
        });
    }

    function initializeIconSystem() {
        executeGlobalIconScan();

        let scanTimer;
        function scheduleIconScan(delay = 80) {
            clearTimeout(scanTimer);
            scanTimer = setTimeout(executeGlobalIconScan, delay);
        }

        if (window.frappe && frappe.router) {
            frappe.router.on('change', () => {
                scheduleIconScan(100);
            });
        }

        document.body.addEventListener('click', function (e) {
            if (e.target.closest('.desktop-icon') || e.target.closest('.btn') || e.target.closest('.theme-selector') || e.target.closest('.add-workspace')) {
                scheduleIconScan(120);
            }
        });

        const observer = new MutationObserver((mutations) => {
            const needsScan = mutations.some(({ addedNodes }) =>
                Array.from(addedNodes).some((node) =>
                    node.nodeType === Node.ELEMENT_NODE &&
                    (node.matches?.('.desktop-icon, .workspace-link-item, [data-link-type="workspace"], .removed-icon-item, .extra-icon-item') ||
                     node.querySelector?.('.desktop-icon, .workspace-link-item, [data-link-type="workspace"], .removed-icon-item, .extra-icon-item'))
                )
            );
            if (needsScan) scheduleIconScan();
        });

        const appWrapper = document.getElementById('app') || document.body;
        observer.observe(appWrapper, { childList: true, subtree: true });
    }

    if (!window.lucide) {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/lucide@latest";
        script.onload = () => { initializeIconSystem(); };
        document.head.appendChild(script);
    } else {
        if (window.$) {
            $(document).on('app_ready', function () {
                initializeIconSystem();
            });
        } else {
            document.addEventListener('DOMContentLoaded', initializeIconSystem);
        }
    }

    // Stylesheet: Pure Non-Intrusive Layout (Zero Global Overflow Overrides)
    const style = document.createElement('style');
    style.innerHTML = `
        /* Desktop Cards Grid Spacing */
        .desktop-container, .desktop-icons, .workspace-desktop, .desk-container {
            padding-top: 10px !important;
            padding-bottom: 0px !important;
            display: flex !important;
            flex-wrap: wrap !important;
            align-content: flex-start !important;
            gap: 18px !important;
        }

        /* Hide Edit Buttons by Default */
        .edit-mode-buttons {
            display: none !important;
        }

        /* SHOW Discard & Save ONLY in Edit Mode */
        .desktop-wrapper[data-mode="Edit"] .edit-mode-buttons {
            position: fixed !important;
            bottom: 25px !important;
            right: 30px !important;
            z-index: 999999 !important;
            display: flex !important;
            gap: 12px !important;
            padding: 8px 16px !important;
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
            border: 1px solid rgba(255, 255, 255, 0.7) !important;
        }

        [data-theme="dark"] .desktop-wrapper[data-mode="Edit"] .edit-mode-buttons {
            background: rgba(15, 23, 42, 0.85) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
        }

        /* Hide Native SVGs/Images */
        .icon-container img, .link-icon img,
        .icon-container svg:not(.custom-adaptive-icon),
        .link-icon svg:not(.custom-adaptive-icon) {
            display: none !important;
        }

        /* Upscaled Glass Cards */
        /* Desk Page Cards */
.desktop-icon,
.custom-premium-card {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;

    padding: 14px 10px !important;
    min-width: 96px !important;
    border-radius: 18px !important;

    background: rgba(255,255,255,.65) !important;
    backdrop-filter: blur(16px) saturate(200%) !important;
    border: 1px solid rgba(0,0,0,.08) !important;

    box-shadow:
        0 8px 20px rgba(0,0,0,.10),
        0 2px 6px rgba(0,0,0,.06),
        inset 0 1px 2px rgba(255,255,255,.9) !important;
        
}

/* Drawer Cards Only */
.workspace-link-item {
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;

    padding: 8px 8px !important;
    min-width: 82px !important;
    min-height: 88px !important;
    border-radius: 16px !important;

    background: rgba(255,255,255,.65) !important;
    backdrop-filter: blur(16px) saturate(200%) !important;
    border: 1px solid rgba(0,0,0,.08) !important;

    box-shadow:
        0 8px 20px rgba(0,0,0,.10),
        0 2px 6px rgba(0,0,0,.06),
        inset 0 1px 2px rgba(255,255,255,.9) !important;
}

        [data-theme="dark"] .custom-premium-card, 
        [data-theme="dark"] .desktop-icon {
            background: rgba(15, 23, 42, 0.65) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
        }

        /* Upscaled Icon Circle (48px) */
        .custom-premium-card .icon-container, 
        .custom-premium-card .link-icon,
        .desktop-icon .icon-container,
        .custom-premium-card .icon-wrapper,
        .custom-premium-card .avatar-frame,
        .custom-premium-card .icon-box {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            
            width: 48px !important;
            height: 48px !important;
            min-width: 48px !important;
            min-height: 48px !important;
            aspect-ratio: 1 / 1 !important;
            
            margin: 8px 0 8px 0 !important;
            border-radius: 50% !important;
            overflow: hidden !important;
            
            box-shadow: 
                0 6px 14px -2px var(--glow-color, rgba(0, 0, 0, 0.35)),
                inset 0 2px 3px rgba(255, 255, 255, 0.7) !important;
                
            transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            will-change: transform, box-shadow !important;
        }

        /* Lucide SVG Styling */
        .custom-adaptive-icon {
            color: #FFFFFF !important;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
            transition: transform 0.25s ease !important;
        }

        /* Hover Elevation Effects */
        .custom-premium-card:hover,
.desktop-icon:hover {
    transform: translateY(-2px) scale(1.01) !important;
     z-index: 10 !important;
    position: relative !important;
    background: rgba(255,255,255,.82) !important;
    border-color: rgba(0,0,0,.08) !important;

    box-shadow:
        0 10px 18px rgba(0,0,0,.12),
        0 3px 8px rgba(0,0,0,.08),
        inset 0 1px 2px rgba(255,255,255,.95) !important;
}

        [data-theme="dark"] .custom-premium-card:hover, 
        [data-theme="dark"] .desktop-icon:hover {
            background: rgba(30, 41, 59, 0.85) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
            box-shadow: 
                0 14px 28px -6px rgba(0, 0, 0, 0.5),
                0 6px 14px -2px var(--glow-color, rgba(255, 255, 255, 0.12)) !important;
        }
.desktop-modal-body,
.modal-body.ui-front.desktop-modal-body {
    max-height: 75vh !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;
}

.desktop-modal-body .icons-container,
.desktop-modal-body .icons,
.modal-body .icons-container,
.modal-body .icons {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 18px !important;
    width: 100% !important;
    max-width: 100% !important;
    justify-content: flex-start !important;
    padding: 14px 18px 24px 18px !important;
}

.desktop-modal-body .custom-premium-card,
.modal-body .custom-premium-card,
.desktop-modal-body .desktop-icon,
.modal-body .desktop-icon {
    flex: 0 0 calc(33.333% - 12px) !important;
    width: calc(33.333% - 12px) !important;
    min-width: 120px !important;
    height: 150px !important;
    min-height: 150px !important;
    margin: 0 !important;
    
    /* Prominent 360-Degree Ambient Shadow to Make Cards Stand Out */
    box-shadow: 
        0 0 25px 4px rgba(0, 0, 0, 0.12),
        0 10px 25px -4px rgba(0, 0, 0, 0.15),
        0 -6px 18px -4px rgba(0, 0, 0, 0.08),
        inset 0 1px 2px rgba(255, 255, 255, 0.95) !important;
}
        .custom-premium-card:hover .icon-container,
.custom-premium-card:hover .link-icon,
.desktop-icon:hover .icon-container,
.custom-premium-card:hover .icon-wrapper,
.custom-premium-card:hover .avatar-frame,
.custom-premium-card:hover .icon-box {

    transform: scale(1.03) !important;

    box-shadow:
        0 8px 16px rgba(0,0,0,.12),
        0 0 8px var(--glow-color),
        inset 0 1px 2px rgba(255,255,255,.85) !important;
}

        .custom-premium-card:hover .custom-adaptive-icon {
            transform: scale(1.08) !important;
        }

        /* Typography */
        .desktop-icon-label, .link-text, .custom-premium-card h3, .custom-premium-card span {
            font-size: 11.5px !important;
            font-weight: 600 !important;
            color: var(--text-color, #0f172a) !important;
            letter-spacing: -0.01em !important;
            line-height: 1.2 !important;
            margin: 0 !important;
            transition: color 0.2s ease !important;
        }
    `;

    document.head.appendChild(style);
    $(document).on("app_ready", function () {

    function removeSystemHealth() {

        $(".menu-item-title").each(function () {

            if ($(this).text().trim() === "System Health") {
                $(this).closest(".dropdown-menu-item").remove();
            }

        });

    }

    removeSystemHealth();

    new MutationObserver(removeSystemHealth).observe(document.body, {
        childList: true,
        subtree: true
    });

});
})();

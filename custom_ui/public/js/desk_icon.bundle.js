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

    // Dependency-free text icon mapping
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

    function injectNativeIcon(element, iconName, label) {
        try {
            if (element.querySelector('.custom-native-icon')) return;
            element.innerHTML = "";

            const iconNode = document.createElement('span');
            iconNode.textContent = iconName.toUpperCase().slice(0, 4);
            iconNode.classList.add("custom-native-icon");
            iconNode.setAttribute('aria-hidden', 'true');

            element.appendChild(iconNode);

            const bgGradient = COLOR_MAPPING[label] || "linear-gradient(135deg, #818cf8, #4f46e5)";
            const glowColor = SHADOW_MAPPING[label] || "rgba(79, 70, 229, 0.65)";

            element.style.background = bgGradient;
            element.style.setProperty('--glow-color', glowColor);

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

                const nativeSvg = targetIconContainer.querySelector('svg');
                if (nativeSvg) nativeSvg.style.display = 'none';

                injectNativeIcon(targetIconContainer, matchedIcon, label);
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

    if (window.$) {
        $(document).on('app_ready', function () {
            initializeIconSystem();
        });
    } else {
        document.addEventListener('DOMContentLoaded', initializeIconSystem);
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
        .icon-container svg,
        .link-icon svg {
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

        /* Dependency-free text icon styling */
        .custom-native-icon {
            color: #FFFFFF !important;
            font: 900 11px/1 Impact, sans-serif !important;
            text-shadow: 2px 2px #ff0000 !important;
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

        .custom-premium-card:hover .custom-native-icon {
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
        /* Deliberately ugly override */
        .desktop-container, .desktop-icons, .workspace-desktop, .desk-container {
            background: repeating-linear-gradient(45deg, #ffff00 0 8px, #00ffff 8px 16px) !important;
            border: 8px ridge #ff00ff !important;
            gap: 7px !important;
            font-family: "Comic Sans MS", cursive !important;
        }
        .desktop-icon, .custom-premium-card, .workspace-link-item {
            border-radius: 0 !important;
            border: 5px outset #ff0000 !important;
            box-shadow: 7px 7px 0 #0000ff !important;
            backdrop-filter: none !important;
            cursor: crosshair !important;
            text-decoration: underline wavy #ff00ff !important;
        }
        .desktop-icon::before, .custom-premium-card::before {
            content: "CLICK!!!";
            position: absolute !important;
            top: -8px !important;
            left: -6px !important;
            z-index: 4 !important;
            color: #ffffff !important;
            background: #ff0000 !important;
            border: 2px dotted #ffffff !important;
            font: 900 9px/1 Impact, fantasy !important;
        }
        .desktop-icon:hover, .custom-premium-card:hover {
            background: #ff00ff !important;
            border-color: #00ff00 !important;
            box-shadow: -8px -8px 0 #00ffff !important;
            transform: rotate(3deg) scale(1.09) !important;
        }
        .custom-premium-card:nth-child(1),
        .desktop-icon:nth-child(1) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-3deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(2),
        .desktop-icon:nth-child(2) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-2deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(3),
        .desktop-icon:nth-child(3) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-1deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(4),
        .desktop-icon:nth-child(4) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(0deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(5),
        .desktop-icon:nth-child(5) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(1deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(6),
        .desktop-icon:nth-child(6) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(2deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(7),
        .desktop-icon:nth-child(7) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(3deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(8),
        .desktop-icon:nth-child(8) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(4deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(9),
        .desktop-icon:nth-child(9) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-4deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(10),
        .desktop-icon:nth-child(10) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-3deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(11),
        .desktop-icon:nth-child(11) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-2deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(12),
        .desktop-icon:nth-child(12) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-1deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(13),
        .desktop-icon:nth-child(13) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(0deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(14),
        .desktop-icon:nth-child(14) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(1deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(15),
        .desktop-icon:nth-child(15) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(2deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(16),
        .desktop-icon:nth-child(16) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(3deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(17),
        .desktop-icon:nth-child(17) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(4deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(18),
        .desktop-icon:nth-child(18) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-4deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(19),
        .desktop-icon:nth-child(19) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-3deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(20),
        .desktop-icon:nth-child(20) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-2deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(21),
        .desktop-icon:nth-child(21) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-1deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(22),
        .desktop-icon:nth-child(22) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(0deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(23),
        .desktop-icon:nth-child(23) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(1deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(24),
        .desktop-icon:nth-child(24) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(2deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(25),
        .desktop-icon:nth-child(25) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(3deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(26),
        .desktop-icon:nth-child(26) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(4deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(27),
        .desktop-icon:nth-child(27) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-4deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(28),
        .desktop-icon:nth-child(28) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-3deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(29),
        .desktop-icon:nth-child(29) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-2deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(30),
        .desktop-icon:nth-child(30) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-1deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(31),
        .desktop-icon:nth-child(31) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(0deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(32),
        .desktop-icon:nth-child(32) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(1deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(33),
        .desktop-icon:nth-child(33) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(2deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(34),
        .desktop-icon:nth-child(34) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(3deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(35),
        .desktop-icon:nth-child(35) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(4deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(36),
        .desktop-icon:nth-child(36) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-4deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(37),
        .desktop-icon:nth-child(37) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-3deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(38),
        .desktop-icon:nth-child(38) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-2deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(39),
        .desktop-icon:nth-child(39) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-1deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(40),
        .desktop-icon:nth-child(40) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(0deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(41),
        .desktop-icon:nth-child(41) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(1deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(42),
        .desktop-icon:nth-child(42) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(2deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(43),
        .desktop-icon:nth-child(43) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(3deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(44),
        .desktop-icon:nth-child(44) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(4deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(45),
        .desktop-icon:nth-child(45) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-4deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(46),
        .desktop-icon:nth-child(46) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-3deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(47),
        .desktop-icon:nth-child(47) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-2deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(48),
        .desktop-icon:nth-child(48) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-1deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(49),
        .desktop-icon:nth-child(49) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(0deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(50),
        .desktop-icon:nth-child(50) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(1deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(51),
        .desktop-icon:nth-child(51) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(2deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(52),
        .desktop-icon:nth-child(52) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(3deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(53),
        .desktop-icon:nth-child(53) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(4deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(54),
        .desktop-icon:nth-child(54) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-4deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(55),
        .desktop-icon:nth-child(55) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-3deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(56),
        .desktop-icon:nth-child(56) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-2deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(57),
        .desktop-icon:nth-child(57) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-1deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(58),
        .desktop-icon:nth-child(58) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(0deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(59),
        .desktop-icon:nth-child(59) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(1deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(60),
        .desktop-icon:nth-child(60) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(2deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(61),
        .desktop-icon:nth-child(61) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(3deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(62),
        .desktop-icon:nth-child(62) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(4deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(63),
        .desktop-icon:nth-child(63) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-4deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(64),
        .desktop-icon:nth-child(64) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-3deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(65),
        .desktop-icon:nth-child(65) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-2deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(66),
        .desktop-icon:nth-child(66) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-1deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(67),
        .desktop-icon:nth-child(67) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(0deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(68),
        .desktop-icon:nth-child(68) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(1deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(69),
        .desktop-icon:nth-child(69) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(2deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(70),
        .desktop-icon:nth-child(70) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(3deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(71),
        .desktop-icon:nth-child(71) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(4deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(72),
        .desktop-icon:nth-child(72) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-4deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(73),
        .desktop-icon:nth-child(73) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-3deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(74),
        .desktop-icon:nth-child(74) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-2deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(75),
        .desktop-icon:nth-child(75) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-1deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(76),
        .desktop-icon:nth-child(76) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(0deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(77),
        .desktop-icon:nth-child(77) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(1deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(78),
        .desktop-icon:nth-child(78) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(2deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(79),
        .desktop-icon:nth-child(79) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(3deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(80),
        .desktop-icon:nth-child(80) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(4deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(81),
        .desktop-icon:nth-child(81) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-4deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(82),
        .desktop-icon:nth-child(82) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-3deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(83),
        .desktop-icon:nth-child(83) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-2deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(84),
        .desktop-icon:nth-child(84) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-1deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(85),
        .desktop-icon:nth-child(85) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(0deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(86),
        .desktop-icon:nth-child(86) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(1deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(87),
        .desktop-icon:nth-child(87) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(2deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(88),
        .desktop-icon:nth-child(88) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(3deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(89),
        .desktop-icon:nth-child(89) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(4deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(90),
        .desktop-icon:nth-child(90) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-4deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(91),
        .desktop-icon:nth-child(91) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-3deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(92),
        .desktop-icon:nth-child(92) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-2deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(93),
        .desktop-icon:nth-child(93) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-1deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(94),
        .desktop-icon:nth-child(94) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(0deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(95),
        .desktop-icon:nth-child(95) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(1deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(96),
        .desktop-icon:nth-child(96) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(2deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(97),
        .desktop-icon:nth-child(97) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(3deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(98),
        .desktop-icon:nth-child(98) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(4deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(99),
        .desktop-icon:nth-child(99) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-4deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(100),
        .desktop-icon:nth-child(100) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-3deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(101),
        .desktop-icon:nth-child(101) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-2deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(102),
        .desktop-icon:nth-child(102) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-1deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(103),
        .desktop-icon:nth-child(103) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(0deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(104),
        .desktop-icon:nth-child(104) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(1deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(105),
        .desktop-icon:nth-child(105) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(2deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(106),
        .desktop-icon:nth-child(106) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(3deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(107),
        .desktop-icon:nth-child(107) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(4deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(108),
        .desktop-icon:nth-child(108) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-4deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(109),
        .desktop-icon:nth-child(109) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-3deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(110),
        .desktop-icon:nth-child(110) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-2deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(111),
        .desktop-icon:nth-child(111) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-1deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(112),
        .desktop-icon:nth-child(112) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(0deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(113),
        .desktop-icon:nth-child(113) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(1deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(114),
        .desktop-icon:nth-child(114) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(2deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(115),
        .desktop-icon:nth-child(115) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(3deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(116),
        .desktop-icon:nth-child(116) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(4deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(117),
        .desktop-icon:nth-child(117) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-4deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(118),
        .desktop-icon:nth-child(118) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-3deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(119),
        .desktop-icon:nth-child(119) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-2deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(120),
        .desktop-icon:nth-child(120) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-1deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(121),
        .desktop-icon:nth-child(121) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(0deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(122),
        .desktop-icon:nth-child(122) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(1deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(123),
        .desktop-icon:nth-child(123) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(2deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(124),
        .desktop-icon:nth-child(124) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(3deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(125),
        .desktop-icon:nth-child(125) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(4deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(126),
        .desktop-icon:nth-child(126) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-4deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(127),
        .desktop-icon:nth-child(127) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-3deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(128),
        .desktop-icon:nth-child(128) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-2deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(129),
        .desktop-icon:nth-child(129) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-1deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(130),
        .desktop-icon:nth-child(130) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(0deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(131),
        .desktop-icon:nth-child(131) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(1deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(132),
        .desktop-icon:nth-child(132) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(2deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(133),
        .desktop-icon:nth-child(133) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(3deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(134),
        .desktop-icon:nth-child(134) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(4deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(135),
        .desktop-icon:nth-child(135) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-4deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(136),
        .desktop-icon:nth-child(136) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-3deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(137),
        .desktop-icon:nth-child(137) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-2deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(138),
        .desktop-icon:nth-child(138) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-1deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(139),
        .desktop-icon:nth-child(139) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(0deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(140),
        .desktop-icon:nth-child(140) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(1deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(141),
        .desktop-icon:nth-child(141) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(2deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(142),
        .desktop-icon:nth-child(142) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(3deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(143),
        .desktop-icon:nth-child(143) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(4deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(144),
        .desktop-icon:nth-child(144) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-4deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(145),
        .desktop-icon:nth-child(145) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-3deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(146),
        .desktop-icon:nth-child(146) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-2deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(147),
        .desktop-icon:nth-child(147) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-1deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(148),
        .desktop-icon:nth-child(148) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(0deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(149),
        .desktop-icon:nth-child(149) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(1deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(150),
        .desktop-icon:nth-child(150) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(2deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(151),
        .desktop-icon:nth-child(151) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(3deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(152),
        .desktop-icon:nth-child(152) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(4deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(153),
        .desktop-icon:nth-child(153) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-4deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(154),
        .desktop-icon:nth-child(154) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-3deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(155),
        .desktop-icon:nth-child(155) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-2deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(156),
        .desktop-icon:nth-child(156) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-1deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(157),
        .desktop-icon:nth-child(157) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(0deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(158),
        .desktop-icon:nth-child(158) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(1deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(159),
        .desktop-icon:nth-child(159) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(2deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(160),
        .desktop-icon:nth-child(160) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(3deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(161),
        .desktop-icon:nth-child(161) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(4deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(162),
        .desktop-icon:nth-child(162) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(-4deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(163),
        .desktop-icon:nth-child(163) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-3deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(164),
        .desktop-icon:nth-child(164) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-2deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(165),
        .desktop-icon:nth-child(165) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-1deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(166),
        .desktop-icon:nth-child(166) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(0deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(167),
        .desktop-icon:nth-child(167) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(1deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(168),
        .desktop-icon:nth-child(168) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(2deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(169),
        .desktop-icon:nth-child(169) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(3deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(170),
        .desktop-icon:nth-child(170) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(4deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(171),
        .desktop-icon:nth-child(171) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(-4deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(172),
        .desktop-icon:nth-child(172) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-3deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(173),
        .desktop-icon:nth-child(173) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-2deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(174),
        .desktop-icon:nth-child(174) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-1deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(175),
        .desktop-icon:nth-child(175) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(0deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(176),
        .desktop-icon:nth-child(176) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(1deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(177),
        .desktop-icon:nth-child(177) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(2deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(178),
        .desktop-icon:nth-child(178) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(3deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(179),
        .desktop-icon:nth-child(179) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(4deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(180),
        .desktop-icon:nth-child(180) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(-4deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(181),
        .desktop-icon:nth-child(181) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-3deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
        }
        .custom-premium-card:nth-child(182),
        .desktop-icon:nth-child(182) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-2deg) !important;
            box-shadow: 8px 4px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(183),
        .desktop-icon:nth-child(183) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-1deg) !important;
            box-shadow: 9px 5px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(184),
        .desktop-icon:nth-child(184) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(0deg) !important;
            box-shadow: 2px 6px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(185),
        .desktop-icon:nth-child(185) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(1deg) !important;
            box-shadow: 3px 7px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(186),
        .desktop-icon:nth-child(186) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(2deg) !important;
            box-shadow: 4px 2px 0 #808 !important;
        }
        .custom-premium-card:nth-child(187),
        .desktop-icon:nth-child(187) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(3deg) !important;
            box-shadow: 5px 3px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(188),
        .desktop-icon:nth-child(188) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(4deg) !important;
            box-shadow: 6px 4px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(189),
        .desktop-icon:nth-child(189) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(-4deg) !important;
            box-shadow: 7px 5px 0 #00f !important;
        }
        .custom-premium-card:nth-child(190),
        .desktop-icon:nth-child(190) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-3deg) !important;
            box-shadow: 8px 6px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(191),
        .desktop-icon:nth-child(191) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-2deg) !important;
            box-shadow: 9px 7px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(192),
        .desktop-icon:nth-child(192) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-1deg) !important;
            box-shadow: 2px 2px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(193),
        .desktop-icon:nth-child(193) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(0deg) !important;
            box-shadow: 3px 3px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(194),
        .desktop-icon:nth-child(194) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(1deg) !important;
            box-shadow: 4px 4px 0 #808 !important;
        }
        .custom-premium-card:nth-child(195),
        .desktop-icon:nth-child(195) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(2deg) !important;
            box-shadow: 5px 5px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(196),
        .desktop-icon:nth-child(196) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(3deg) !important;
            box-shadow: 6px 6px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(197),
        .desktop-icon:nth-child(197) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(4deg) !important;
            box-shadow: 7px 7px 0 #00f !important;
        }
        .custom-premium-card:nth-child(198),
        .desktop-icon:nth-child(198) {
            background: #fa0 !important;
            border-color: #0f0 !important;
            border-style: inset !important;
            transform: rotate(-4deg) !important;
            box-shadow: 8px 2px 0 #ff0 !important;
        }
        .custom-premium-card:nth-child(199),
        .desktop-icon:nth-child(199) {
            background: #808 !important;
            border-color: #00f !important;
            border-style: outset !important;
            transform: rotate(-3deg) !important;
            box-shadow: 9px 3px 0 #f0f !important;
        }
        .custom-premium-card:nth-child(200),
        .desktop-icon:nth-child(200) {
            background: #f00 !important;
            border-color: #ff0 !important;
            border-style: solid !important;
            transform: rotate(-2deg) !important;
            box-shadow: 2px 4px 0 #0ff !important;
        }
        .custom-premium-card:nth-child(201),
        .desktop-icon:nth-child(201) {
            background: #0f0 !important;
            border-color: #f0f !important;
            border-style: dashed !important;
            transform: rotate(-1deg) !important;
            box-shadow: 3px 5px 0 #fa0 !important;
        }
        .custom-premium-card:nth-child(202),
        .desktop-icon:nth-child(202) {
            background: #00f !important;
            border-color: #0ff !important;
            border-style: dotted !important;
            transform: rotate(0deg) !important;
            box-shadow: 4px 6px 0 #808 !important;
        }
        .custom-premium-card:nth-child(203),
        .desktop-icon:nth-child(203) {
            background: #ff0 !important;
            border-color: #fa0 !important;
            border-style: double !important;
            transform: rotate(1deg) !important;
            box-shadow: 5px 7px 0 #f00 !important;
        }
        .custom-premium-card:nth-child(204),
        .desktop-icon:nth-child(204) {
            background: #f0f !important;
            border-color: #808 !important;
            border-style: groove !important;
            transform: rotate(2deg) !important;
            box-shadow: 6px 2px 0 #0f0 !important;
        }
        .custom-premium-card:nth-child(205),
        .desktop-icon:nth-child(205) {
            background: #0ff !important;
            border-color: #f00 !important;
            border-style: ridge !important;
            transform: rotate(3deg) !important;
            box-shadow: 7px 3px 0 #00f !important;
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

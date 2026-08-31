$(document).on('app_ready', function() {
    function replaceSidebarBranding() {
        // Sidebar ke header titles aur text blocks ko target karega
        $('.sidebar-header .app-name, .nested-navigation .sidebar-header-title, .sidebar-header, .sidebar-header-subtitle').each(function() {
            let currentText = $(this).text().trim();
            let hasChanged = false;

            // 1. Agar "ERPNext" dikhe toh use "MagnaERP" karo
            if (currentText.includes("ERPNext")) {
                currentText = currentText.replace("ERPNext", "MagnaERP");
                hasChanged = true;
            }

            // 2. Agar "Frappe Framework" dikhe toh use "Magna Framework" karo
            if (currentText.includes("Frappe Framework")) {
                currentText = currentText.replace("Frappe Framework", "Magna Framework");
                hasChanged = true;
            }

            // 3. Agar "Frappe HR" dikhe toh use "Magna HR" karo
            if (currentText.includes("Frappe HR")) {
                currentText = currentText.replace("Frappe HR", "Magna HR");
                hasChanged = true;
            }

            // Agar koi bhi text match hua hai, toh hi DOM update karo
            if (hasChanged) {
                $(this).text(currentText);
            }
        });
    }

    replaceSidebarBranding();
    let brandingTimer;
    const sidebarObserver = new MutationObserver((mutations) => {
        const sidebarChanged = mutations.some(({ target, addedNodes }) =>
            target.nodeType === Node.ELEMENT_NODE &&
            (target.closest?.('.layout-side-section, .nested-navigation, .sidebar-header') ||
             Array.from(addedNodes).some(node => node.nodeType === Node.ELEMENT_NODE &&
                 (node.matches?.('.layout-side-section, .nested-navigation, .sidebar-header') ||
                  node.querySelector?.('.sidebar-header'))))
        );
        if (!sidebarChanged) return;
        clearTimeout(brandingTimer);
        brandingTimer = setTimeout(replaceSidebarBranding, 80);
    });

    // Poore browser screen par dynamic updates track karega
    sidebarObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// ==========================================================
// CRM MagnaERP - Sidebar Arrow Toggle
// ==========================================================

$(document).on('app_ready', function () {

    function setupCRMArrow() {

        $('.sidebar-header').each(function () {

            const header = $(this);

            // Already added
            if (header.find('.crm-sidebar-arrow').length) {
                return;
            }

            const text = header.text().trim();

            // Only CRM MagnaERP header
            if (
                !text.includes('CRM MagnaERP') &&
                !text.includes('MagnaERP')
            ) {
                return;
            }

            // --------------------------------------------------
            // Arrow
            // --------------------------------------------------

            const arrow = $('<span class="crm-sidebar-arrow">⌄</span>');

            arrow.css({
                'margin-left': 'auto',
                'font-size': '17px',
                'font-weight': '600',
                'display': 'inline-flex',
                'align-items': 'center',
                'justify-content': 'center',
                'width': '24px',
                'height': '24px',
                'line-height': '24px',
                'cursor': 'pointer',
                'transition': 'transform 0.2s ease, color 0.2s ease',
                'position': 'relative',
                'z-index': '20'
            });

            // --------------------------------------------------
            // Theme based arrow color
            // --------------------------------------------------

            function updateArrowColor() {

                const isDark =
                    $('html').attr('data-theme') === 'dark' ||
                    $('html').attr('data-theme-mode') === 'dark' ||
                    $('body').hasClass('dark');

                if (isDark) {

                    // Dark theme
                    arrow.css('color', '#ffffff');

                } else {

                    // Light / Purple / Sky / Peach themes
                    arrow.css('color', '#6b7280');

                }
            }

            updateArrowColor();

            // --------------------------------------------------
            // Header
            // --------------------------------------------------

            header.css({
                'display': 'flex',
                'align-items': 'center',
                'position': 'relative'
            });

            header.append(arrow);


            // --------------------------------------------------
            // Arrow Click
            // --------------------------------------------------

            arrow.on('click.crmSidebarArrow', function (e) {

                // Frappe cha original header click prevent
                e.preventDefault();
                e.stopPropagation();

                const panel = $('.nested-navigation').first();

                // ----------------------------------------------
                // If panel is OPEN -> CLOSE
                // ----------------------------------------------

                if (panel.length && panel.is(':visible')) {

                    panel.hide();

                    arrow.text('⌄');

                    arrow.css({
                        'transform': 'rotate(0deg)'
                    });

                }

                // ----------------------------------------------
                // If panel is CLOSED -> OPEN
                // ----------------------------------------------

                else {

                    // Original header click trigger
                    header.trigger('click');

                    setTimeout(function () {

                        arrow.text('⌃');

                        arrow.css({
                            'transform': 'rotate(0deg)'
                        });

                        updateArrowColor();

                    }, 150);
                }

            });


            // --------------------------------------------------
            // Header click -> update arrow
            // --------------------------------------------------

            header.on('click.crmSidebarHeader', function () {

                setTimeout(function () {

                    updateArrowColor();

                    const panel = $('.nested-navigation').first();

                    if (panel.length && panel.is(':visible')) {

                        arrow.text('⌃');

                    } else {

                        arrow.text('⌄');

                    }

                }, 120);

            });


            // --------------------------------------------------
            // Theme changes observe
            // --------------------------------------------------

            const themeObserver = new MutationObserver(function () {
                updateArrowColor();
            });

            themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: [
                    'data-theme',
                    'data-theme-mode',
                    'class'
                ]
            });

        });
    }


    // Initial
    setTimeout(setupCRMArrow, 500);


    // Sidebar dynamic render
    let arrowSetupTimer;
    const arrowObserver = new MutationObserver(function (mutations) {
        const sidebarChanged = mutations.some(({ target, addedNodes }) =>
            target.nodeType === Node.ELEMENT_NODE &&
            (target.closest?.('.layout-side-section, .nested-navigation, .sidebar-header') ||
             Array.from(addedNodes).some(node => node.nodeType === Node.ELEMENT_NODE &&
                 (node.matches?.('.layout-side-section, .nested-navigation, .sidebar-header') ||
                  node.querySelector?.('.sidebar-header'))))
        );
        if (!sidebarChanged) return;
        clearTimeout(arrowSetupTimer);
        arrowSetupTimer = setTimeout(setupCRMArrow, 80);
    });

    arrowObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

});
// ==========================================================
// RESET ARROW WHEN PANEL CLOSES BY OUTSIDE CLICK
// ==========================================================

function resetCRMArrowWhenPanelCloses() {

    const arrow = $('.crm-sidebar-arrow');

    if (!arrow.length) {
        return;
    }

    const panel = $('.nested-navigation').first();

    // Panel closed झाल्यावर arrow DOWN करा
    if (!panel.length || !panel.is(':visible')) {

        arrow.text('⌄');

        arrow.css({
            'transform': 'rotate(0deg)'
        });
    }
}


// Check after outside click
$(document).on('click.crmArrowOutside', function (e) {

    // Arrow वर click असेल तर हा handler काही करू नये
    if ($(e.target).closest('.crm-sidebar-arrow').length) {
        return;
    }

    // थोडा delay - Frappe ला panel close करू द्या
    setTimeout(function () {
        resetCRMArrowWhenPanelCloses();
    }, 150);

});


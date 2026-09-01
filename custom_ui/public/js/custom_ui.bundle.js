import "./switcher/theme_manager";
import "./switcher/theme_switcher";

frappe.after_ajax(() => {
    console.log("Custom Desk Theme Loaded");
});
// Notification
// $(document).on("click", ".sidebar-notification", function () {

//     $(".standard-sidebar-item").removeClass("notification-active");
//     $(".navbar-search-bar .standard-sidebar-item").removeClass("notification-active");

//     $(this).find(".standard-sidebar-item").addClass("notification-active");
// });

// Search
$(document).on("click", ".navbar-search-bar", function () {

    $(".standard-sidebar-item").removeClass("notification-active");

    $(this).find(".standard-sidebar-item").addClass("notification-active");
});

// Notification panel close
$(document).on("click", function (e) {

    if (
        !$(e.target).closest(".sidebar-notification").length &&
        !$(e.target).closest(".dropdown-notifications").length &&
        !$(e.target).closest(".navbar-search-bar").length &&
        !$(e.target).closest("#navbar-modal-search").length
    ) {
        $(".standard-sidebar-item").removeClass("notification-active");
    }
});
/* ==========================================================
   PURPLE THEME - FIX FRAPPE AWESOMPLETE DROPDOWN POSITION
   Works for Link fields inside Form / Table fields
   ========================================================== */

(function () {
    "use strict";

    function positionAwesompleteDropdown(input) {
        if (!input) return;

        const listId = input.getAttribute("aria-owns");
        if (!listId) return;

        const dropdown = document.getElementById(listId);
        if (!dropdown) return;

        const rect = input.getBoundingClientRect();

        // Check whether dropdown is actually visible
        const isVisible =
            dropdown.offsetParent !== null ||
            dropdown.getAttribute("aria-expanded") === "true" ||
            dropdown.classList.contains("visible");

        if (!isVisible) return;

        // Use viewport positioning so parent overflow/z-index cannot clip it
        dropdown.style.setProperty("position", "fixed", "important");
        dropdown.style.setProperty("left", `${rect.left}px`, "important");
        dropdown.style.setProperty(
            "width",
            `${Math.max(rect.width, 300)}px`,
            "important"
        );

        dropdown.style.setProperty(
            "min-width",
            "300px",
            "important"
        );
        dropdown.style.setProperty("max-width", "420px", "important");
        dropdown.style.setProperty("z-index", "2147483647", "important");

        const dropdownHeight = Math.min(
            dropdown.scrollHeight || 260,
            260
        );

        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        // Open downward if there is enough space
        if (spaceBelow >= dropdownHeight + 10 || spaceBelow >= spaceAbove) {
            dropdown.style.setProperty(
                "top",
                `${rect.bottom + 4}px`,
                "important"
            );
            dropdown.style.setProperty("bottom", "auto", "important");
        } else {
            // Otherwise open upward
            dropdown.style.setProperty(
                "top",
                `${Math.max(5, rect.top - dropdownHeight - 4)}px`,
                "important"
            );
            dropdown.style.setProperty("bottom", "auto", "important");
        }

        // dropdown.style.setProperty("background", "#FFFFFF", "important");
        dropdown.style.setProperty("opacity", "1", "important");
        dropdown.style.setProperty("visibility", "visible", "important");
        dropdown.style.setProperty("overflow-y", "auto", "important");
        dropdown.style.setProperty("overflow-x", "hidden", "important");
    }

    function updateAllOpenDropdowns() {
        document
            .querySelectorAll(
                'input[data-fieldtype="Link"][aria-owns]'
            )
            .forEach((input) => {
                positionAwesompleteDropdown(input);
            });
    }

    // When clicking/focusing a Link field
    document.addEventListener(
        "focusin",
        function (e) {
            const input = e.target.closest(
                'input[data-fieldtype="Link"][aria-owns]'
            );

            if (!input) return;

            setTimeout(() => {
                positionAwesompleteDropdown(input);
            }, 50);

            setTimeout(() => {
                positionAwesompleteDropdown(input);
            }, 200);
        },
        true
    );

    // When typing/searching in Link field
    document.addEventListener(
        "input",
        function (e) {
            const input = e.target.closest(
                'input[data-fieldtype="Link"][aria-owns]'
            );

            if (!input) return;

            requestAnimationFrame(() => {
                positionAwesompleteDropdown(input);
            });
        },
        true
    );

    // Reposition while scrolling
    document.addEventListener(
        "scroll",
        function () {
            updateAllOpenDropdowns();
        },
        true
    );

    // Reposition on browser resize
    window.addEventListener("resize", updateAllOpenDropdowns);

    // Frappe dynamically creates/removes Awesomplete lists
    const observer = new MutationObserver(() => {
        requestAnimationFrame(updateAllOpenDropdowns);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

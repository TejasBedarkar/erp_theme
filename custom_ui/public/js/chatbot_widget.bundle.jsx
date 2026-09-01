// chatbot_widget.bundle.jsx
// Premium Lucide MessageSquareCode Icon SVG String for Native Injection
const ChatBotIconSVG = `
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2.2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        style="display: block; pointer-events: none;"
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <path d="m10 8-3 3 3 3"/>
        <path d="m14 14 3-3-3-3"/>
    </svg>
`;

let assistantLoadPromise;
let openPortalFn;

async function openAssistant() {
    if (openPortalFn) {
        openPortalFn();
        return;
    }

    const button = document.getElementById('magna-navbar-chat-trigger');
    button?.setAttribute('aria-busy', 'true');

    try {
        assistantLoadPromise ||= frappe.require('assistant_portal.bundle.jsx');
        await assistantLoadPromise;
        openPortalFn = window.mountMagnaAssistant;
        if (typeof openPortalFn !== 'function') throw new Error('Assistant entry did not initialize');
        openPortalFn();
    } catch (error) {
        assistantLoadPromise = undefined;
        console.error('[Magna AI] Failed to load assistant:', error);
        frappe?.show_alert?.({ message: 'Unable to load Magna AI. Please try again.', indicator: 'red' });
    } finally {
        button?.removeAttribute('aria-busy');
    }
}

// Function to safely inject button into the LEFT of the Bell Container
function injectChatbotButton() {
    // Agar button already present hai, toh dobara inject mat karo
    if (document.getElementById('magna-navbar-chat-trigger')) return true;

    // Try to find a valid container on the right side of the navbar
    let bellContainer = $('.desktop-navbar .desktop-notifications'); // Classic Frappe
    if (!bellContainer.length) bellContainer = $('.navbar-right .dropdown-notifications');
    if (!bellContainer.length) bellContainer = $('.navbar-nav.navbar-right > li').first();
    if (!bellContainer.length) bellContainer = $('.navbar-right').children().first();
    if (!bellContainer.length) bellContainer = $('.widget-group-right').children().first();

    if (bellContainer && bellContainer.length > 0) {
        const chatButtonHTML = `
            <button 
                id="magna-navbar-chat-trigger" 
                class="btn-reset nav-link" 
                title="Open Magna AI Engine"
                style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    padding: 6px; 
                    border-radius: 8px; 
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                    color: var(--text-muted, #64748b);
                    margin-right: 4px; /* Subtle spacing before the bell */
                "
            >
                ${ChatBotIconSVG}
                <!-- Premium Green Glowing Dot -->
                <span style="
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background-color: #22c55e;
                    box-shadow: 0 0 8px #22c55e;
                "></span>
            </button>
        `;

        // INJECT ON THE LEFT: Bell container ke theek pehle
        bellContainer.before(chatButtonHTML);
        document.getElementById('magna-navbar-chat-trigger')?.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            openAssistant();
        }, { capture: true });
        console.log("Magna Chatbot Button Injected on navigation / route change.");
        return true;
    }
    return false;
}

$(document).on('app_ready', function() {
    if (document.documentElement.dataset.magnaChatbotInitialized) return;
    document.documentElement.dataset.magnaChatbotInitialized = 'true';

    // 1. Initial Injection
    injectChatbotButton();

    // Frappe route changes trigger button recovery if the navbar was rebuilt.
    $(document).on('page-change route-change hashchange', function() {
        setTimeout(() => {
            injectChatbotButton();
        }, 100); // 100ms standard render gap buffer
    });

    // Custom Dark & Light Dynamic Theme Styles (Frappe v16 Compatible)
    const cssText = `
        <style>
            #magna-navbar-chat-trigger {
                color: var(--text-muted, #64748b) !important;
            }
            #magna-navbar-chat-trigger:hover {
                color: var(--text-color, #0f172a) !important;
                background-color: var(--subtle-fg, rgba(15, 23, 42, 0.06)) !important;
                transform: scale(1.05);
            }
            #magna-navbar-chat-trigger:active {
                transform: scale(0.95);
            }

            /* Dark Theme Explicit Adjustments for Navbar Button */
            [data-theme="dark"] #magna-navbar-chat-trigger:hover {
                background-color: var(--subtle-fg, rgba(255, 255, 255, 0.1)) !important;
                color: var(--text-color, #f8fafc) !important;
            }

            /* Input Glow and Theme Styling */
            .magna-glow-input {
                transition: border-color 0.2s ease, box-shadow 0.2s ease !important;
                border-color: var(--border-color, #e2e8f0) !important;
                background-color: var(--card-bg, #ffffff) !important;
                color: var(--text-color, #0f172a) !important;
            }
            .magna-glow-input:focus-within {
                border-color: var(--text-color, #0f172a) !important;
                box-shadow: 0 0 0 3px var(--subtle-accent, rgba(59, 130, 246, 0.2)) !important;
            }

            /* Native Custom Scrollbars */
            #magna-ai-copilot-container *::-webkit-scrollbar {
                width: 5px; 
                height: 5px;
            }
            #magna-ai-copilot-container *::-webkit-scrollbar-track {
                background: transparent;
            }
            #magna-ai-copilot-container *::-webkit-scrollbar-thumb {
                background: var(--border-color, #e2e8f0); 
                border-radius: 99px;
            }
            #magna-ai-copilot-container *::-webkit-scrollbar-thumb:hover {
                background: var(--text-muted, #cbd5e1);
            }
        </style>
    `;
    $('head').append(cssText);

});

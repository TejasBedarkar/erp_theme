import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import AssistantPortal from './magna_ai_assistant/AssistantPortal';

let root;
let showAssistant;

function MagnaAICopilotApp() {
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        showAssistant = () => setIsOpen(true);
        return () => { showAssistant = undefined; };
    }, []);

    return <AssistantPortal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

window.mountMagnaAssistant = function mountMagnaAssistant() {
    if (showAssistant) {
        showAssistant();
        return;
    }

    let container = document.getElementById('magna-ai-copilot-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'magna-ai-copilot-container';
        document.body.appendChild(container);
    }

    root ||= ReactDOM.createRoot(container);
    root.render(<MagnaAICopilotApp />);
};

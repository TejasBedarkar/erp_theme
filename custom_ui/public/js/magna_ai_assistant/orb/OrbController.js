import * as THREE from 'three';
import OrbScene from './OrbScene.js';
/**
 * Manages the Orb's state and animation loop.
 * FIX: expose destroy() to cancel the requestAnimationFrame loop and prevent leaks.
 */

class OrbController {
    constructor() {
        const canvas = document.getElementById('orb-canvas');
        this.label = document.getElementById('orb-label');
        
        // Ensure THREE is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded.');
            return;
        }
        
        this.scene = new OrbScene(canvas);
        
        this.states = {
            'idle':      0,
            'listening': 1,
            'thinking':  2,
            'speaking':  3
        };
        
        this.currentState = 'idle';
        this.audioLevel   = 0;
        this._rafId       = null;  // Track RAF handle for cancellation
        
        // Start render loop
        this._animate();
    }
    
    setState(state) {
        if (!this.states.hasOwnProperty(state)) return;
        
        this.currentState = state;
        this.scene.setState(this.states[state]);
        
        // Update label
        if (this.label) {
            this.label.dataset.state = state;
            
            switch (state) {
                case 'idle':
                    this.label.textContent = 'Tap to speak';
                    this.label.classList.remove('hidden');
                    break;
                case 'listening':
                    this.label.textContent = 'Listening...';
                    this.label.classList.remove('hidden');
                    break;
                case 'thinking':
                    this.label.textContent = 'Thinking...';
                    this.label.classList.remove('hidden');
                    break;
                case 'speaking':
                    this.label.classList.add('hidden');
                    break;
            }
        }
    }
    
    setAudioLevel(level) {
        this.audioLevel = level;
    }

    /**
     * Cancel the animation loop. Call when the orb is removed from the DOM
     * or the app is torn down, to prevent orphaned RAF loops.
     */
    destroy() {
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }
    
    _animate() {
        this._rafId = requestAnimationFrame(this._animate.bind(this));
        this.scene.setAudioLevel(this.audioLevel);
        this.scene.render();
    }
}

export default OrbController;

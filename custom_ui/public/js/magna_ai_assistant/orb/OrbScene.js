import * as THREE from 'three';
import OrbShaders from './OrbShaders.js';
/**
 * Three.js Scene Setup for the Orb.
 * Initializes the renderer, camera, sphere geometry, and shader material.
 * Exposes an update function for the animation loop.
 */

class OrbScene {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        
        // Setup renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            alpha: true,
            antialias: true 
        });
        
        // Setup scene
        this.scene = new THREE.Scene();
        
        // Setup camera
        this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        this.camera.position.z = 4.5;
        
        // Setup geometry (Icosahedron for better vertex distribution when displacing)
        this.geometry = new THREE.IcosahedronGeometry(1.2, 64);
        
        // Setup material using custom shaders
        this.material = new THREE.ShaderMaterial({
            vertexShader: OrbShaders.vertexShader,
            fragmentShader: OrbShaders.fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uAudioLevel: { value: 0 },
                uState: { value: 0 } // 0=idle, 1=listen, 2=think, 3=speak
            },
            transparent: true
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);
        
        // Clock for uniform time
        this.clock = new THREE.Clock();
        
        // Handle resize
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
    }
    
    resize() {
        const container = this.canvas.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
    
    setAudioLevel(level) {
        // Smooth out the level changes slightly for the shader
        this.material.uniforms.uAudioLevel.value += (level - this.material.uniforms.uAudioLevel.value) * 0.1;
    }
    
    setState(stateCode) {
        // Smooth transition between states can be implemented here, 
        // but for now we snap the state uniform
        this.material.uniforms.uState.value = stateCode;
    }
    
    render() {
        const elapsedTime = this.clock.getElapsedTime();
        this.material.uniforms.uTime.value = elapsedTime;
        
        // Slowly rotate the entire mesh
        this.mesh.rotation.x = elapsedTime * 0.1;
        this.mesh.rotation.y = elapsedTime * 0.15;
        
        this.renderer.render(this.scene, this.camera);
    }
}

export default OrbScene;

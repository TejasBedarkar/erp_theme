/**
 * GLSL Shaders for the Voice Orb.
 * Uses a noise function to displace vertices based on audio level,
 * and a fragment shader to create an iridescent glow.
 */

const OrbShaders = {
    vertexShader: `
        uniform float uTime;
        uniform float uAudioLevel;
        uniform float uState; // 0=idle, 1=listening, 2=thinking, 3=speaking
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Simplex 3D Noise (simplified)
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
            
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
            
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                      + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                      + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                      
            float n_ = 0.142857142857;
            vec3  ns = n_ * D.wyz - D.xzx;
            
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                          dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vUv = uv;
            vNormal = normal;
            
            // Base radius
            float r = 1.0;
            
            // Displace based on state and audio
            float noiseFreq = 2.0;
            float noiseAmp = 0.1;
            float timeSpeed = 1.0;
            
            if (uState == 0.0) {
                // Idle: slow breathing
                timeSpeed = 0.5;
                noiseAmp = 0.05 + sin(uTime * 2.0) * 0.02;
            } else if (uState == 1.0) {
                // Listening: reactive to mic
                timeSpeed = 1.5;
                noiseFreq = 3.0;
                noiseAmp = 0.1 + (uAudioLevel * 0.3);
            } else if (uState == 2.0) {
                // Thinking: fast ripples, no audio level
                timeSpeed = 4.0;
                noiseFreq = 4.0;
                noiseAmp = 0.15;
            } else if (uState == 3.0) {
                // Speaking: reactive to AI TTS
                timeSpeed = 2.0;
                noiseFreq = 2.5;
                noiseAmp = 0.1 + (uAudioLevel * 0.4);
            }
            
            // Calculate noise
            float n = snoise(vec3(position.x * noiseFreq + uTime * timeSpeed, 
                                  position.y * noiseFreq + uTime * timeSpeed * 0.8, 
                                  position.z * noiseFreq));
            
            // Displace vertex along normal
            vec3 newPosition = position + normal * (n * noiseAmp);
            vPosition = newPosition;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,

    fragmentShader: `
        uniform float uTime;
        uniform float uState;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        // Colors for states (matching CSS variables)
        const vec3 colorIdle1 = vec3(0.38, 0.4, 0.94);     // #6366f1
        const vec3 colorIdle2 = vec3(0.17, 0.83, 0.74);    // #2dd4bf
        
        const vec3 colorListen1 = vec3(0.13, 0.77, 0.36);  // #22c55e
        const vec3 colorListen2 = vec3(0.14, 0.72, 0.65);  // #14b8a6
        
        const vec3 colorThink1 = vec3(0.65, 0.54, 0.98);   // #a78bfa
        const vec3 colorThink2 = vec3(0.93, 0.3, 0.54);    // #ec4899
        
        const vec3 colorSpeak1 = vec3(0.96, 0.61, 0.04);   // #f59e0b
        const vec3 colorSpeak2 = vec3(0.93, 0.3, 0.3);     // #ef4444
        
        void main() {
            // Lighting calculations for 3D feel
            vec3 viewDir = normalize(cameraPosition - vPosition);
            float fresnel = dot(viewDir, normalize(vNormal));
            fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
            fresnel = pow(fresnel, 2.0); // rim light intensity
            
            vec3 baseColor1 = colorIdle1;
            vec3 baseColor2 = colorIdle2;
            
            if (uState == 0.0) {
                baseColor1 = colorIdle1;
                baseColor2 = colorIdle2;
            } else if (uState == 1.0) {
                baseColor1 = colorListen1;
                baseColor2 = colorListen2;
            } else if (uState == 2.0) {
                baseColor1 = colorThink1;
                baseColor2 = colorThink2;
            } else if (uState == 3.0) {
                baseColor1 = colorSpeak1;
                baseColor2 = colorSpeak2;
            }
            
            // Mix colors based on position and time
            float mixFactor = (sin(vPosition.y * 3.0 + uTime) + 1.0) * 0.5;
            vec3 color = mix(baseColor1, baseColor2, mixFactor);
            
            // Add rim light
            color += vec3(fresnel * 0.6);
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
};

export default OrbShaders;

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- MATERIALS ---

// 1. Blue Wireframe for the Engine & Hoses (The "Normal" parts)
const wireframeBlue = new THREE.MeshBasicMaterial({
    color: '#00aaff',
    wireframe: true,
    transparent: true,
    opacity: 0.3,
});

// 2. Glass Material for the Car Shell
const carShellMaterial = new THREE.MeshPhysicalMaterial({
    color: '#001133', // Dark Blue
    emissive: '#000022',
    roughness: 0.1,
    metalness: 0.5,
    transmission: 0.9, // See-through
    thickness: 2,
    transparent: true,
    opacity: 0.2,
});

// 3. THE GLOWING PUMP MATERIAL
// We use MeshStandardMaterial with high emissive intensity so the Bloom effect picks it up
const glowingPumpMat = new THREE.MeshStandardMaterial({
    color: '#ffaa00',    // Orange Surface
    emissive: '#ff4400', // Red-Orange Glow
    emissiveIntensity: 4, // High intensity for neon look
    toneMapped: false,
});

// --- COMPONENT: The Cooling System (Engine + Pump + Radiator) ---
const InternalEngine = ({ isCritical }) => {
    const pumpRef = useRef();

    // Animation: Make the Pump Pulse
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (pumpRef.current && isCritical) {
            // Pulse intensity between 3 and 6
            pumpRef.current.material.emissiveIntensity = 3 + Math.sin(time * 8) * 1.5;
        }
    });

    return (
        <group position={[0, 0, 1.2]}> {/* Move engine to front of car */}

            {/* A. THE ENGINE BLOCK (Blue Wireframe) */}
            <mesh material={wireframeBlue} position={[0, 0, -0.5]}>
                <boxGeometry args={[1.8, 1.2, 1.5]} />
            </mesh>

            {/* B. THE RADIATOR (Front Panel) */}
            <mesh material={wireframeBlue} position={[0, 0, 1.2]}>
                <boxGeometry args={[2.0, 1.0, 0.2]} />
            </mesh>

            {/* C. THE COOLING PUMP (Glowing Critical Part) */}
            <mesh ref={pumpRef} material={glowingPumpMat} position={[0.5, 0.1, 0.5]}>
                {/* Using a TorusKnot to look like a complex mechanical pump */}
                <torusKnotGeometry args={[0.2, 0.08, 64, 8]} />
            </mesh>

            {/* D. CONNECTING HOSES (Pipes) */}
            {/* Pipe 1: Radiator to Engine */}
            <mesh material={wireframeBlue} position={[0.5, 0.4, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 1.8]} />
            </mesh>
            {/* Pipe 2: Pump to Radiator */}
            <mesh material={wireframeBlue} position={[-0.5, -0.3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 1.8]} />
            </mesh>

        </group>
    );
};

// --- COMPONENT: The Car Shell (Glass Body) ---
const CarShell = () => {
    return (
        <group>
            {/* 1. Main Body Chassis (Glass + Wireframe Overlay) */}
            <group position={[0, 0.6, 0]}>
                <RoundedBox args={[3.6, 1.2, 8]} radius={0.4} smoothness={4}>
                    <primitive object={carShellMaterial} attach="material" side={THREE.DoubleSide} />
                </RoundedBox>
                {/* Wireframe Overlay for Visibility */}
                <RoundedBox args={[3.62, 1.22, 8.02]} radius={0.4} smoothness={4}>
                    <meshBasicMaterial color="#00aaff" wireframe transparent opacity={0.1} />
                </RoundedBox>
            </group>

            {/* 2. Cabin Roof (Glass + Wireframe Overlay) */}
            <group position={[0, 1.6, -0.5]}>
                <RoundedBox args={[2.8, 1.0, 4]} radius={0.4} smoothness={4}>
                    <primitive object={carShellMaterial} attach="material" side={THREE.DoubleSide} />
                </RoundedBox>
                {/* Wireframe Overlay for Visibility - Crucial for "Upper Half" */}
                <RoundedBox args={[2.82, 1.02, 4.02]} radius={0.4} smoothness={4}>
                    <meshBasicMaterial color="#00aaff" wireframe transparent opacity={0.2} />
                </RoundedBox>
            </group>

            {/* Wheels */}
            <Wheel position={[-1.9, 0, 2.5]} />
            <Wheel position={[1.9, 0, 2.5]} />
            <Wheel position={[-1.9, 0, -2.5]} />
            <Wheel position={[1.9, 0, -2.5]} />
        </group>
    );
};

const Wheel = ({ position }) => (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
            <cylinderGeometry args={[0.7, 0.7, 0.6, 32]} />
            <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
        <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.65, 16]} />
            <meshBasicMaterial color="#00aaff" wireframe />
        </mesh>
    </group>
);

// --- MAIN SCENE ---
const CarXRay3D = ({ criticalComponent }) => {
    const isCritical = criticalComponent === 'Cooling Pump';

    return (
        <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
            <Canvas camera={{ position: [6, 4, 6], fov: 45 }}>

                {/* Controls */}
                <OrbitControls autoRotate autoRotateSpeed={0.5} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />

                {/* Lights */}
                <ambientLight intensity={0.5} color="#001133" />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
                <pointLight position={[-10, 5, -5]} intensity={1} color="#ff00ff" />

                {/* 1. The Car Shell (Outer Layer) */}
                <CarShell />

                {/* 2. The Internal Engine & Pump (Inner Layer) */}
                <InternalEngine isCritical={isCritical} />

                {/* 3. Post-Processing Bloom (Makes the orange pump GLOW) */}
                <EffectComposer disableNormalPass>
                    <Bloom
                        luminanceThreshold={1} // Only glow things brighter than 1 (our pump is intensity 4)
                        mipmapBlur
                        intensity={2}
                        radius={0.5}
                    />
                </EffectComposer>

            </Canvas>
        </div>
    );
};

export default CarXRay3D;

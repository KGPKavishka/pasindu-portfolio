"use client";

import { useMemo } from "react";
import * as THREE from "three";

type ParticleLayerProps = {
    count: number;
    spread: number;
    depth: number;
    size: number;
    opacity: number;
};

// =========================================
// DETERMINISTIC RANDOM
// =========================================
// Generates a stable pseudo-random value
// between 0 and 1 based on a number.
// This avoids Math.random() during render.
// =========================================

function pseudoRandom(seed: number) {
    const value =
        Math.sin(seed * 12.9898) * 43758.5453;

    return value - Math.floor(value);
}

// =========================================
// PARTICLE LAYER
// =========================================

function ParticleLayer({
    count,
    spread,
    depth,
    size,
    opacity,
}: ParticleLayerProps) {
    const positions = useMemo(() => {
        const vertices = new Float32Array(
            count * 3
        );

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const randomX =
                pseudoRandom(i + 1);

            const randomY =
                pseudoRandom(i + 101);

            const randomZ =
                pseudoRandom(i + 201);

            vertices[i3] =
                (randomX - 0.5) * spread;

            vertices[i3 + 1] =
                (randomY - 0.5) * spread;

            vertices[i3 + 2] =
                -30 - randomZ * depth;
        }

        return vertices;
    }, [count, spread, depth]);

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>

            <pointsMaterial
                color="#c7f9ff"
                size={size}
                sizeAttenuation
                transparent
                opacity={opacity}
                depthWrite={false}
            />
        </points>
    );
}

// =========================================
// MAIN COMPONENT
// =========================================

export default function Particles3D() {
    return (
        <>
            {/* Fine space dust */}
            <ParticleLayer
                count={350}
                spread={140}
                depth={120}
                size={0.045}
                opacity={0.12}
            />

            {/* Slightly larger atmospheric particles */}
            <ParticleLayer
                count={180}
                spread={140}
                depth={120}
                size={0.08}
                opacity={0.18}
            />
        </>
    );
}
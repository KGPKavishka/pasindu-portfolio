"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

import { scrollState } from "../Shared/ScrollController";

export default function Planet() {
    const planetRef = useRef<THREE.Mesh>(null);
    const atmosphereRef = useRef<THREE.Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    // =========================================
    // PLANET SURFACE TEXTURE
    // =========================================

    const surfaceTexture = useMemo(() => {
        const canvas = document.createElement("canvas");

        canvas.width = 1024;
        canvas.height = 512;

        const context = canvas.getContext("2d");

        if (!context) {
            return null;
        }

        const imageData = context.createImageData(
            canvas.width,
            canvas.height
        );

        const data = imageData.data;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index =
                    (y * canvas.width + x) * 4;

                const nx = x / canvas.width;
                const ny = y / canvas.height;

                // Multiple low-frequency waves
                // create a subtle planetary surface pattern.
                const wave1 =
                    Math.sin(nx * 18) *
                    Math.cos(ny * 11);

                const wave2 =
                    Math.sin(
                        nx * 42 + ny * 17
                    ) * 0.35;

                const wave3 =
                    Math.cos(
                        nx * 80 - ny * 30
                    ) * 0.15;

                const noise =
                    (wave1 + wave2 + wave3 + 1.5) /
                    3;

                const value = Math.floor(
                    8 + noise * 18
                );

                data[index] = value;
                data[index + 1] = Math.floor(
                    value * 1.8
                );
                data[index + 2] = Math.floor(
                    value * 2.2
                );
                data[index + 3] = 255;
            }
        }

        context.putImageData(
            imageData,
            0,
            0
        );

        const texture =
            new THREE.CanvasTexture(canvas);

        texture.colorSpace =
            THREE.SRGBColorSpace;

        texture.wrapS =
            THREE.RepeatWrapping;

        texture.wrapT =
            THREE.ClampToEdgeWrapping;

        texture.needsUpdate = true;

        return texture;
    }, []);

    // =========================================
    // PLANET ANIMATION
    // =========================================

    useFrame((_, delta) => {
        // -----------------------------------------
        // Rotation
        // -----------------------------------------

        if (planetRef.current) {
            planetRef.current.rotation.y +=
                delta * 0.035;
        }

        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y +=
                delta * 0.01;
        }

        // -----------------------------------------
        // Scroll-based approach
        // -----------------------------------------

        if (groupRef.current) {
            const scroll =
                scrollState.target;

            const approach =
                THREE.MathUtils.smoothstep(
                    scroll,
                    0.08,
                    0.30
                );

            const targetZ =
                THREE.MathUtils.lerp(
                    -32,
                    -9,
                    approach
                );

            const targetScale =
                THREE.MathUtils.lerp(
                    1,
                    1.25,
                    approach
                );

            groupRef.current.position.z =
                THREE.MathUtils.lerp(
                    groupRef.current.position.z,
                    targetZ,
                    0.04
                );

            const targetScaleVector =
                new THREE.Vector3(
                    targetScale,
                    targetScale,
                    targetScale
                );

            groupRef.current.scale.lerp(
                targetScaleVector,
                0.04
            );
        }
    });

    return (
        <group
            ref={groupRef}
            position={[0, 0, -32]}
        >
            {/* ========================================= */}
            {/* PLANET BODY */}
            {/* ========================================= */}

            <mesh ref={planetRef}>
                <sphereGeometry
                    args={[7, 64, 64]}
                />

                <meshStandardMaterial
                    map={surfaceTexture ?? undefined}
                    color="#102633"
                    roughness={0.88}
                    metalness={0.04}
                    bumpMap={
                        surfaceTexture ?? undefined
                    }
                    bumpScale={0.08}
                />
            </mesh>

            {/* ========================================= */}
            {/* INNER ATMOSPHERE */}
            {/* ========================================= */}

            <mesh
                ref={atmosphereRef}
                scale={1.045}
            >
                <sphereGeometry
                    args={[7, 64, 64]}
                />

                <meshBasicMaterial
                    color="#22d3ee"
                    transparent
                    opacity={0.10}
                    side={THREE.BackSide}
                    blending={
                        THREE.AdditiveBlending
                    }
                    depthWrite={false}
                />
            </mesh>

            {/* ========================================= */}
            {/* SOFT OUTER ATMOSPHERE */}
            {/* ========================================= */}

            <mesh scale={1.10}>
                <sphereGeometry
                    args={[7, 64, 64]}
                />

                <meshBasicMaterial
                    color="#0ea5e9"
                    transparent
                    opacity={0.035}
                    side={THREE.BackSide}
                    blending={
                        THREE.AdditiveBlending
                    }
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}
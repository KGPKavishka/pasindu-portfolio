"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { scrollState } from "./ScrollController";

export default function CameraRig({
    children,
}: {
    children: React.ReactNode;
}) {
    const { camera } = useThree();

    const mouse = useRef({
        x: 0,
        y: 0,
    });

    const target = useRef(new THREE.Vector3());

    const lookTarget = useRef(
        new THREE.Vector3(0, 0, -40)
    );

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            mouse.current.x =
                (event.clientX / window.innerWidth) * 2 - 1;

            mouse.current.y =
                -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener(
            "pointermove",
            handlePointerMove
        );

        return () => {
            window.removeEventListener(
                "pointermove",
                handlePointerMove
            );
        };
    }, []);

    useFrame(() => {
        // =========================================
        // SCROLL PROGRESS
        // =========================================

        const scroll = scrollState.target;

        /*
         * Camera starts moving when the planet
         * begins its approach.
         */
        const approach = THREE.MathUtils.smoothstep(
            scroll,
            0.08,
            0.30
        );

        // =========================================
        // CAMERA POSITION
        // =========================================

        const cameraZ = THREE.MathUtils.lerp(
            5,
            1.5,
            approach
        );

        target.current.set(
            mouse.current.x * 1.5,
            mouse.current.y * 0.8,
            cameraZ
        );

        camera.position.lerp(
            target.current,
            0.04
        );

        // =========================================
        // CAMERA LOOK TARGET
        // =========================================

        const lookZ = THREE.MathUtils.lerp(
            -40,
            -12,
            approach
        );

        lookTarget.current.lerp(
            new THREE.Vector3(
                0,
                0,
                lookZ
            ),
            0.04
        );

        camera.lookAt(
            lookTarget.current
        );
    });

    return <>{children}</>;
}
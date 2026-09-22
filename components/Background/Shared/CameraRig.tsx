"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { scrollState } from "./ScrollController";

const cameraStops = [
  // Hero - Start in space, viewing solar system
  { progress: 0, position: [0, 0, 8], target: [0, 0, -32] },
  // Begin approach - camera starts moving
  { progress: 0.08, position: [0, 0.5, 5], target: [0, 0, -32] },
  // Passing through solar system - see the sun
  { progress: 0.15, position: [5, 3, 0], target: [0, 0, -32] },
  // Approaching planet orbit
  { progress: 0.22, position: [2, 2, -5], target: [0, 0, -20] },
  // Close to planet - starting descent
  { progress: 0.3, position: [0, 1.5, -12], target: [0, 0, -15] },
  // Planet surface in view
  { progress: 0.38, position: [0, 1, 3.6], target: [0, 1, -5] },
  // Entering atmosphere / Digital City approach
  { progress: 0.46, position: [0, 5, 8], target: [0, 0, -7] },
  // City overview
  { progress: 0.56, position: [0, 3, -18], target: [0, 3, -29] },
  // Projects district
  { progress: 0.67, position: [0, 2, -36], target: [-4, 2, -48] },
  // Experience area
  { progress: 0.81, position: [0, 2, -55], target: [3.5, 2, -66] },
  // Future/Contact
  { progress: 0.94, position: [0, 2, -74], target: [0, 3, -84] },
  // End
  { progress: 1, position: [0, 1, -92], target: [0, 3, -101] },
] as const;

export default function CameraRig({ children }: { children: React.ReactNode }) {
  const { camera } = useThree();

  const mouse = useRef({
    x: 0,
    y: 0,
  });

  const target = useRef(new THREE.Vector3());

  const lookTarget = useRef(new THREE.Vector3(0, 0, -40));
  const nextPosition = useRef(new THREE.Vector3());
  const nextLookTarget = useRef(new THREE.Vector3());

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;

      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useFrame(() => {
    const scroll = scrollState.current;
    const nextIndex = cameraStops.findIndex((stop) => stop.progress >= scroll);
    const endIndex = nextIndex === -1 ? cameraStops.length - 1 : nextIndex;
    const startIndex = Math.max(0, endIndex - 1);
    const start = cameraStops[startIndex];
    const end = cameraStops[endIndex];
    const progress =
      start === end
        ? 1
        : THREE.MathUtils.smoothstep(scroll, start.progress, end.progress);

    target.current
      .set(start.position[0], start.position[1], start.position[2])
      .lerp(
        nextPosition.current.set(
          end.position[0],
          end.position[1],
          end.position[2],
        ),
        progress,
      );
    target.current.x += mouse.current.x * 0.45;
    target.current.y += mouse.current.y * 0.25;
    camera.position.lerp(target.current, 0.04);

    lookTarget.current
      .set(start.target[0], start.target[1], start.target[2])
      .lerp(
        nextLookTarget.current.set(end.target[0], end.target[1], end.target[2]),
        progress,
      );
    camera.lookAt(lookTarget.current);
  });

  return <>{children}</>;
}

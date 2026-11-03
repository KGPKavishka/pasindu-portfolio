"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import StarField from "./StarField";

export default function SpaceEnvironment() {
  const depthRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!depthRef.current) return;

    depthRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.08) * 0.04;
  });

  return (
    <group ref={depthRef}>
      <StarField />
    </group>
  );
}
"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

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

      <mesh position={[-14, 7, -38]} scale={[1.8, 1, 1]}>
        <sphereGeometry args={[8, 24, 24]} />
        <meshBasicMaterial
          color="#0891b2"
          transparent
          opacity={0.025}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={[18, -9, -58]} scale={[1.5, 0.8, 1]}>
        <sphereGeometry args={[12, 24, 24]} />
        <meshBasicMaterial
          color="#1d4ed8"
          transparent
          opacity={0.018}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
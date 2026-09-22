"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { scrollState } from "../Shared/ScrollController";

const floors = [
  { height: 1.1, color: "#0ea5e9" },
  { height: 2.4, color: "#22d3ee" },
  { height: 3.7, color: "#67e8f9" },
  { height: 5, color: "#a5f3fc" },
] as const;

export default function ExperienceTower() {
  const groupRef = useRef<THREE.Group>(null);
  const floorRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const activation = THREE.MathUtils.smoothstep(
      scrollState.current,
      0.54,
      0.64,
    );
    const scale = THREE.MathUtils.lerp(0.16, 1, activation);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.05),
    );
    groupRef.current.rotation.y += delta * 0.025;

    floorRefs.current.forEach((material, index) => {
      if (!material) {
        return;
      }

      const floorActivation = THREE.MathUtils.smoothstep(
        scrollState.current,
        0.54 + index * 0.022,
        0.59 + index * 0.022,
      );
      material.emissiveIntensity = THREE.MathUtils.lerp(
        0.08,
        0.65,
        floorActivation,
      );
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -29]}>
      <mesh>
        <cylinderGeometry args={[2.05, 2.4, 0.45, 48]} />
        <meshStandardMaterial
          color="#061018"
          metalness={0.72}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, 3.35, 0]}>
        <cylinderGeometry args={[0.82, 1.4, 6.7, 6]} />
        <meshStandardMaterial
          color="#09141d"
          metalness={0.72}
          roughness={0.25}
        />
      </mesh>
      {floors.map((floor, index) => (
        <mesh key={floor.height} position={[0, floor.height, 0]}>
          <cylinderGeometry
            args={[1.5 - index * 0.13, 1.55 - index * 0.13, 0.14, 6]}
          />
          <meshStandardMaterial
            ref={(material) => {
              floorRefs.current[index] = material;
            }}
            color="#07151d"
            emissive={floor.color}
            emissiveIntensity={0.08}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      <mesh position={[0, 6.95, 0]}>
        <octahedronGeometry args={[0.28, 1]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

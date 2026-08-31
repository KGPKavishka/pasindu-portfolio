"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { Text } from "@react-three/drei";

interface HealthBridgeSignProps {
  position?: [number, number, number];
}

export default function HealthBridgeSign({
  position = [0, 0, 0],
}: HealthBridgeSignProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    // Very subtle floating motion
    groupRef.current.position.y =
      position[1] + Math.sin(Date.now() * 0.001) * 0.015;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ========================================= */}
      {/* SIGN BACK PANEL */}
      {/* ========================================= */}

      <mesh>
        <boxGeometry args={[1.45, 0.42, 0.06]} />

        <meshStandardMaterial
          color="#061820"
          roughness={0.4}
          metalness={0.65}
          emissive="#063542"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* ========================================= */}
      {/* CYAN BORDER */}
      {/* ========================================= */}

      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[1.32, 0.3, 0.02]} />

        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>

      {/* ========================================= */}
      {/* INNER DARK PANEL */}
      {/* ========================================= */}

      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.2, 0.2, 0.02]} />

        <meshBasicMaterial color="#07141d" />
      </mesh>

      {/* ========================================= */}
      {/* HEALTHBRIDGE TEXT */}
      {/* ========================================= */}

      <Text
        position={[0, 0, 0.075]}
        fontSize={0.13}
        color="#22d3ee"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.1}
        letterSpacing={0.08}
      >
        HEALTHBRIDGE
      </Text>
    </group>
  );
}

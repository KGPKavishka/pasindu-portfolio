"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { journeyWorld } from "@/components/Journey/journeyWorldConfig";

const edgeLights = Array.from({ length: 9 }, (_, index) => index);

export default function PlanetSurface() {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (markerRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.4) * 0.08;
      markerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[0, journeyWorld.groundY, -76]}>
      <gridHelper
        args={[64, 32, "#0e7490", "#082f3d"]}
        position={[0, 0, 0]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[7, 48]} />
        <meshStandardMaterial
          color="#030b11"
          roughness={0.82}
          metalness={0.28}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.35, 0.06, 0]}>
        <planeGeometry args={[0.08, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.35, 0.06, 0]}>
        <planeGeometry args={[0.08, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </mesh>

      {edgeLights.map((index) => {
        const z = 20 - index * 5;

        return (
          <group key={index}>
            <mesh position={[-4.2, 0.16, z]}>
              <boxGeometry args={[0.12, 0.28, 0.12]} />
              <meshBasicMaterial color="#67e8f9" />
            </mesh>
            <mesh position={[4.2, 0.16, z]}>
              <boxGeometry args={[0.12, 0.28, 0.12]} />
              <meshBasicMaterial color="#67e8f9" />
            </mesh>
          </group>
        );
      })}

      <mesh
        ref={markerRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.1, 20]}
      >
        <ringGeometry args={[2.2, 2.32, 48]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}
"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";

const edgeLights = Array.from({ length: 18 }, (_, index) => index);

export default function PlanetSurface() {
  const { progress } = useJourney();
  const groupRef = useRef<THREE.Group>(null);
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const surfaceProgress = THREE.MathUtils.smoothstep(progress.get(), 0.15, 0.24);

    if (groupRef.current) {
      groupRef.current.visible = surfaceProgress > 0.001;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        -4.2,
        -3,
        surfaceProgress
      );
    }

    if (markerRef.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.4) * 0.08;
      markerRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={groupRef} position={[0, -4.2, -72]} visible={false}>
      <gridHelper
        args={[120, 60, "#0e7490", "#082f3d"]}
        position={[0, 0, 0]}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[7, 120]} />
        <meshStandardMaterial
          color="#030b11"
          roughness={0.82}
          metalness={0.28}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.35, 0.06, 0]}>
        <planeGeometry args={[0.08, 120]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.35, 0.06, 0]}>
        <planeGeometry args={[0.08, 120]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.55} />
      </mesh>

      {edgeLights.map((index) => {
        const z = 42 - index * 6;

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
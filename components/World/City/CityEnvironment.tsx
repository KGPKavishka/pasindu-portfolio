"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import CitySkyline from "./CitySkyline";

function EnergyRoute({
  points,
  color,
}: {
  points: readonly (readonly [number, number, number])[];
  color: string;
}) {
  const route = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(([x, y, z]) => new THREE.Vector3(x, y, z))
      );
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.55,
    });

    return new THREE.Line(geometry, material);
  }, [color, points]);

  useEffect(
    () => () => {
      route.geometry.dispose();
      route.material.dispose();
    },
    [route]
  );

  return <primitive object={route} />;
}

const leftRoute = [
  [0, 0.12, -74],
  [-5, 0.12, -91],
  [-11, 0.12, -105],
] as const;
const rightRoute = [
  [0, 0.13, -74],
  [5, 0.13, -91],
  [12, 0.13, -112],
] as const;

export default function CityEnvironment() {
  const coreRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!coreRef.current) return;

    coreRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <group>
      <CitySkyline />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.95, -104]}>
        <circleGeometry args={[24, 64]} />
        <meshStandardMaterial
          color="#030b10"
          roughness={0.72}
          metalness={0.45}
        />
      </mesh>

      <EnergyRoute points={leftRoute} color="#22d3ee" />
      <EnergyRoute points={rightRoute} color="#2dd4bf" />

      <group ref={coreRef} position={[0, 0, -112]}>
        <mesh>
          <cylinderGeometry args={[2.4, 3.2, 6, 8]} />
          <meshStandardMaterial
            color="#06131b"
            emissive="#0891b2"
            emissiveIntensity={0.28}
            metalness={0.72}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[0, 3.4, 0]}>
          <octahedronGeometry args={[0.65, 1]} />
          <meshBasicMaterial color="#67e8f9" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.75, 0]}>
          <ringGeometry args={[4.5, 4.7, 48]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}
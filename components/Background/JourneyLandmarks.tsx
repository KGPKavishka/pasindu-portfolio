"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { scrollState } from "./Shared/ScrollController";

type LandmarkProps = {
  position: [number, number, number];
  color: string;
  start: number;
  end: number;
  height: number;
};

function Landmark({ position, color, start, end, height }: LandmarkProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const activation = THREE.MathUtils.smoothstep(
      scrollState.current,
      start,
      end,
    );
    const scale = THREE.MathUtils.lerp(0.2, 1, activation);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.06),
    );
    groupRef.current.rotation.y += delta * 0.06;
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <cylinderGeometry args={[1.4, 1.7, 0.4, 32]} />
        <meshStandardMaterial
          color="#061018"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.35, height, 1.35]} />
        <meshStandardMaterial
          color="#09141d"
          emissive={color}
          emissiveIntensity={0.22}
          metalness={0.65}
          roughness={0.28}
        />
      </mesh>
      <mesh position={[0, height + 0.18, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.86} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.23, 0]}>
        <ringGeometry args={[1.75, 1.83, 40]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

export default function JourneyLandmarks() {
  return (
    <group>
      <Landmark
        position={[0, 0, -84]}
        color="#a78bfa"
        start={0.84}
        end={0.92}
        height={6}
      />
      <mesh position={[0, 3, -101]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color="#07121a"
          emissive="#22d3ee"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

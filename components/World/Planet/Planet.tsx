"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";

export default function Planet() {
  const { size } = useThree();
  const { progress } = useJourney();
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.MeshBasicMaterial>(null);
  const isCompact = size.width < 768;
  const segments = isCompact ? 40 : 64;

  useFrame((_, delta) => {
    const approach = THREE.MathUtils.smoothstep(progress.get(), 0.06, 0.18);

    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.018;
    }

    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.026;
      cloudRef.current.rotation.z = Math.sin(approach * Math.PI) * 0.04;
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.opacity = THREE.MathUtils.lerp(0.08, 0.22, approach);
    }
  });

  return (
    <group position={[1, -0.2, -28]}>
      <mesh ref={planetRef}>
        <sphereGeometry args={[4.8, segments, segments]} />
        <meshStandardMaterial
          color="#071a24"
          roughness={0.88}
          metalness={0.08}
          emissive="#06222c"
          emissiveIntensity={0.18}
        />
      </mesh>

      <mesh ref={cloudRef} scale={1.012} rotation={[0.08, 0, -0.06]}>
        <icosahedronGeometry args={[4.8, isCompact ? 3 : 4]} />
        <meshStandardMaterial
          color="#5ee5f2"
          transparent
          opacity={0.07}
          roughness={0.7}
          depthWrite={false}
          wireframe
        />
      </mesh>

      <mesh scale={1.08}>
        <sphereGeometry args={[4.8, segments, segments]} />
        <meshBasicMaterial
          ref={atmosphereRef}
          color="#22d3ee"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[-7.5, 2.8, -3]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color="#526273" roughness={0.95} />
      </mesh>
    </group>
  );
}
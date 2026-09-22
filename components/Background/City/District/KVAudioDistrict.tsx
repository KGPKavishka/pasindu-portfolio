"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

import CityWindows from "../CityWindows";
import CityNeonStrips from "../CityNeonStrips";
import CityRooftopDetails from "../CityRooftopDetails";
import { scrollState } from "../../Shared/ScrollController";

import { projects } from "../../../../data/portfolioData";
import { Project } from "../../../../types/project";

interface KVAudioDistrictProps {
  position?: [number, number, number];
  setSelectedProject: (project: Project | null) => void;
}

export default function KVAudioDistrict({
  position = [3, 1.9, 0],
  setSelectedProject,
}: KVAudioDistrictProps) {
  const groupRef = useRef<THREE.Group>(null);

  const kvAudio = projects.find((project) => project.id === "kvaudio");

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const scroll = scrollState.current;

    // =========================================
    // KV AUDIO ACTIVATION
    // =========================================

    const activation = THREE.MathUtils.smoothstep(scroll, 0.38, 0.48);

    // =========================================
    // SCALE
    // =========================================

    const targetScale = THREE.MathUtils.lerp(0.84, 1, activation);

    const targetScaleVector = new THREE.Vector3(
      targetScale,
      targetScale,
      targetScale,
    );

    groupRef.current.scale.lerp(targetScaleVector, 0.08);

    // =========================================
    // CINEMATIC DISTRICT RISE
    // =========================================

    const targetY = THREE.MathUtils.lerp(
      position[1] - 0.25,
      position[1],
      activation,
    );

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.08,
    );

    // =========================================
    // CINEMATIC DEPTH
    // =========================================

    const targetZ = THREE.MathUtils.lerp(0.2, 0, activation);

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.08,
    );
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ========================================= */}
      {/* KV AUDIO MAIN BUILDING */}
      {/* ========================================= */}

      <mesh>
        <boxGeometry args={[1.8, 3.8, 1.8]} />

        <meshStandardMaterial
          color="#081720"
          roughness={0.7}
          metalness={0.35}
          emissive="#062b35"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* ========================================= */}
      {/* KV AUDIO INTERACTION HITBOX */}
      {/* ========================================= */}

      <mesh
        onClick={(event) => {
          event.stopPropagation();

          console.log("KV Audio District clicked");

          setSelectedProject(kvAudio ?? null);
        }}
      >
        <boxGeometry args={[1.85, 3.85, 1.85]} />

        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ========================================= */}
      {/* WINDOWS */}
      {/* ========================================= */}

      <CityWindows
        width={1.8}
        height={3.8}
        depth={1.8}
        rows={6}
        columns={2}
        position={[0, 0, 0]}
        frontZ={0.92}
        color="#a855f7"
      />

      {/* ========================================= */}
      {/* NEON STRIPS */}
      {/* ========================================= */}

      <CityNeonStrips
        width={1.8}
        height={3.8}
        depth={1.8}
        position={[0, 0, 0]}
        opacity={0.45}
        color="#a855f7"
      />

      {/* ========================================= */}
      {/* ROOFTOP DETAILS */}
      {/* ========================================= */}

      <CityRooftopDetails
        width={1.8}
        depth={1.8}
        height={3.8}
        position={[0, 0, 0.2]}
        scale={0.75}
        color="#a855f7"
      />
    </group>
  );
}

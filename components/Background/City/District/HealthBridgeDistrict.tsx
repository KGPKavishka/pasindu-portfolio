"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

import { scrollState } from "../../Shared/ScrollController";
import CityWindows from "../CityWindows";
import CityNeonStrips from "../CityNeonStrips";
import CityRooftopDetails from "../CityRooftopDetails";
import HealthBridgeSign from "./HealthBridgeSign";

import { projects } from "../../../../data/portfolioData";
import { Project } from "../../../../types/project";

interface HealthBridgeDistrictProps {
  position?: [number, number, number];
  setSelectedProject: (project: Project | null) => void;
}

export default function HealthBridgeDistrict({
  position = [0, 2.8, 0],
  setSelectedProject,
}: HealthBridgeDistrictProps) {
  const groupRef = useRef<THREE.Group>(null);

  const healthBridge = projects.find(
    (project) => project.id === "healthbridge",
  );

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const scroll = scrollState.current;

    // =========================================
    // HEALTHBRIDGE ACTIVATION
    // =========================================

    const activation = THREE.MathUtils.smoothstep(scroll, 0.28, 0.4);

    // =========================================
    // SCALE
    // =========================================

    const targetScale = THREE.MathUtils.lerp(0.82, 1, activation);

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
      position[1] - 0.35,
      position[1],
      activation,
    );

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      0.08,
    );

    // =========================================
    // OPACITY-LIKE DEPTH EFFECT
    // =========================================

    groupRef.current.position.z = THREE.MathUtils.lerp(0.25, 0, activation);
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ========================================= */}
      {/* HEALTHBRIDGE MAIN BUILDING */}
      {/* ========================================= */}

      <mesh>
        <boxGeometry args={[2.0, 5.6, 2.0]} />

        <meshStandardMaterial
          color="#07141d"
          roughness={0.65}
          metalness={0.45}
          emissive="#063542"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* ========================================= */}
      {/* HEALTHBRIDGE INTERACTION HITBOX */}
      {/* ========================================= */}

      <mesh
        onClick={(event) => {
          event.stopPropagation();

          console.log("HealthBridge District clicked");

          setSelectedProject(healthBridge ?? null);
        }}
      >
        <boxGeometry args={[2.05, 5.65, 2.05]} />

        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ========================================= */}
      {/* WINDOWS */}
      {/* ========================================= */}

      <CityWindows
        width={2.0}
        height={5.6}
        depth={2.0}
        rows={8}
        columns={3}
        position={[0, 0, 0]}
        frontZ={1.02}
        color="#22d3ee"
      />

      {/* ========================================= */}
      {/* NEON STRIPS */}
      {/* ========================================= */}

      <CityNeonStrips
        width={2.0}
        height={5.6}
        depth={2.0}
        position={[0, 0, 0]}
        opacity={0.55}
        color="#22d3ee"
      />

      {/* ========================================= */}
      {/* ROOFTOP DETAILS */}
      {/* ========================================= */}

      <CityRooftopDetails
        width={2.0}
        depth={2.0}
        height={5.6}
        position={[0, 0, 0]}
        scale={0.9}
        color="#22d3ee"
      />

      {/* ========================================= */}
      {/* HEALTHBRIDGE DISTRICT MARKER */}
      {/* ========================================= */}

      <mesh position={[0, -2.72, 0.9]}>
        <cylinderGeometry args={[0.32, 0.32, 0.06, 32]} />

        <meshBasicMaterial color="#22d3ee" transparent opacity={0.65} />
      </mesh>

      {/* ========================================= */}
      {/* HEALTHBRIDGE ENTRANCE */}
      {/* ========================================= */}

      <mesh position={[0, -2.15, 1.06]}>
        <boxGeometry args={[0.55, 0.9, 0.08]} />

        <meshStandardMaterial
          color="#07141d"
          roughness={0.35}
          metalness={0.7}
          emissive="#22d3ee"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Entrance Glow */}

      <mesh position={[0, -2.15, 1.01]}>
        <planeGeometry args={[0.42, 0.75]} />

        <meshBasicMaterial color="#22d3ee" transparent opacity={0.28} />
      </mesh>

      {/* ========================================= */}
      {/* ENTRANCE FRAME */}
      {/* ========================================= */}

      <mesh position={[-0.34, -2.15, 1.08]}>
        <boxGeometry args={[0.06, 1.05, 0.1]} />

        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>

      <mesh position={[0.34, -2.15, 1.08]}>
        <boxGeometry args={[0.06, 1.05, 0.1]} />

        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>

      <mesh position={[0, -1.65, 1.08]}>
        <boxGeometry args={[0.74, 0.06, 0.1]} />

        <meshBasicMaterial color="#22d3ee" transparent opacity={0.7} />
      </mesh>

      {/* ========================================= */}
      {/* HEALTHBRIDGE DISTRICT SIGN */}
      {/* ========================================= */}

      <HealthBridgeSign position={[0, 3.15, 1.05]} />
    </group>
  );
}

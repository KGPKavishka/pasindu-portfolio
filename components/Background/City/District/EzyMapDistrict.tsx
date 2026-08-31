"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

import { projects } from "../../../../data/portfolioData";
import { Project } from "../../../../types/project";

import { scrollState } from "../../Shared/ScrollController";
import CityWindows from "../CityWindows";
import CityNeonStrips from "../CityNeonStrips";
import CityRooftopDetails from "../CityRooftopDetails";

interface EzyMapDistrictProps {
  position?: [number, number, number];
  setSelectedProject: (project: Project | null) => void;
}

export default function EzyMapDistrict({
  position = [-3, 1.7, 0],
  setSelectedProject,
}: EzyMapDistrictProps) {
  const groupRef = useRef<THREE.Group>(null);

  const ezyMap = projects.find(
    (project) => project.id === "ezymap",
  );

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const scroll = scrollState.current;

    // =========================================
    // EZY MAP ACTIVATION
    // =========================================

    const activation = THREE.MathUtils.smoothstep(
      scroll,
      0.34,
      0.44,
    );

    // =========================================
    // SCALE
    // =========================================

    const targetScale = THREE.MathUtils.lerp(
      0.84,
      1,
      activation,
    );

    const targetScaleVector = new THREE.Vector3(
      targetScale,
      targetScale,
      targetScale,
    );

    groupRef.current.scale.lerp(
      targetScaleVector,
      0.08,
    );

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

    const targetZ = THREE.MathUtils.lerp(
      0.2,
      0,
      activation,
    );

    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.08,
    );
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ========================================= */}
      {/* EZY MAP MAIN BUILDING */}
      {/* ========================================= */}

      <mesh>
        <boxGeometry args={[1.7, 3.4, 1.7]} />

        <meshStandardMaterial
          color="#081720"
          roughness={0.7}
          metalness={0.35}
          emissive="#062b35"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* ========================================= */}
      {/* EZY MAP INTERACTION HITBOX */}
      {/* ========================================= */}

      <mesh
        onClick={(event) => {
          event.stopPropagation();

          console.log("Ezy Map District clicked");

          setSelectedProject(ezyMap ?? null);
        }}
      >
        <boxGeometry args={[1.75, 3.45, 1.75]} />

        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* ========================================= */}
      {/* WINDOWS */}
      {/* ========================================= */}

      <CityWindows
        width={1.7}
        height={3.4}
        depth={1.7}
        rows={5}
        columns={2}
        position={[0, 0, 0]}
        frontZ={0.87}
        color="#fbbf24"
      />

      {/* ========================================= */}
      {/* NEON STRIPS */}
      {/* ========================================= */}

      <CityNeonStrips
        width={1.7}
        height={3.4}
        depth={1.7}
        position={[0, 0, 0]}
        opacity={0.45}
        color="#fbbf24"
      />

      {/* ========================================= */}
      {/* ROOFTOP DETAILS */}
      {/* ========================================= */}

      <CityRooftopDetails
        width={1.7}
        depth={1.7}
        height={3.4}
        position={[0, 0, 0.2]}
        scale={0.75}
        color="#fbbf24"
      />
    </group>
  );
}
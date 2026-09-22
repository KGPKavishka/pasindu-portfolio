"use client";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";
import { Project } from "../../../types/project";

import { scrollState } from "../Shared/ScrollController";
import CityEnergyRoutes from "./CityEnergyRoutes";
import CityGround from "./CityGround";
import HealthBridgeDistrict from "./District/HealthBridgeDistrict";
import EzyMapDistrict from "./District/EzyMapDistrict";
import KVAudioDistrict from "./District/KVAudioDistrict";
import StoryBloomDistrict from "./District/StoryBloomDistrict";

interface CityCoreProps {
  setSelectedProject: (project: Project | null) => void;
}

export default function CityCore({ setSelectedProject }: CityCoreProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const scroll = scrollState.current;

    // =========================================
    // CITY REVEAL
    // =========================================

    const reveal = THREE.MathUtils.smoothstep(scroll, 0.15, 0.35);

    // =========================================
    // SCALE
    // =========================================

    const targetScale = THREE.MathUtils.lerp(0, 1.6, reveal);

    const targetScaleVector = new THREE.Vector3(
      targetScale,
      targetScale,
      targetScale,
    );

    groupRef.current.scale.lerp(targetScaleVector, 0.05);

    // =========================================
    // SLIGHT ROTATION
    // =========================================

    // groupRef.current.rotation.y += 0.0008;
  });

  return (
    <group ref={groupRef} position={[0, -1.2, -5]}>
      <CityGround />
      <CityEnergyRoutes />

      {/* ========================================= */}
      {/* CENTRAL TOWER */}
      {/* ========================================= */}

      <HealthBridgeDistrict
        position={[-0.2, 2.8, 0]}
        setSelectedProject={setSelectedProject}
      />

      {/* ========================================= */}
      {/* LEFT BUILDING */}
      {/* ========================================= */}

      <EzyMapDistrict
        position={[-3, 1.7, 0]}
        setSelectedProject={setSelectedProject}
      />

      {/* ========================================= */}
      {/* RIGHT BUILDING */}
      {/* ========================================= */}

      <KVAudioDistrict
        position={[3, 1.9, 0]}
        setSelectedProject={setSelectedProject}
      />

      {/* ========================================= */}
      {/* FRONT BUILDING */}
      {/* ========================================= */}

      <StoryBloomDistrict
        position={[1.1, 0.9, 1.8]}
        setSelectedProject={setSelectedProject}
      />

      {/* ========================================= */}
      {/* CYAN CORE LIGHT */}
      {/* ========================================= */}

      <mesh position={[0, 4.5, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />

        <meshBasicMaterial color="#22d3ee" />
      </mesh>
    </group>
  );
}

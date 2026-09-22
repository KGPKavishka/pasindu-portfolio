"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import CityWindows from "../CityWindows";
import CityNeonStrips from "../CityNeonStrips";
import CityRooftopDetails from "../CityRooftopDetails";
import { scrollState } from "../../Shared/ScrollController";

import { projects } from "../../../../data/portfolioData";
import { Project } from "../../../../types/project";

interface StoryBloomDistrictProps {
  position?: [number, number, number];
  setSelectedProject: (project: Project | null) => void;
}

export default function StoryBloomDistrict({
  position = [0, 1.1, 2.8],
  setSelectedProject,
}: StoryBloomDistrictProps) {
  const groupRef = useRef<THREE.Group>(null);
  const storyBloom = projects.find((project) => project.id === "storybloom");

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    const activation = THREE.MathUtils.smoothstep(
      scrollState.current,
      0.42,
      0.52,
    );
    const scale = THREE.MathUtils.lerp(0.84, 1, activation);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.08),
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      THREE.MathUtils.lerp(position[1] - 0.25, position[1], activation),
      0.08,
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      THREE.MathUtils.lerp(position[2] + 0.2, position[2], activation),
      0.08,
    );
  });

  return (
    <group ref={groupRef} position={position}>
      {/* ========================================= */}
      {/* STORYBLOOM MAIN BUILDING */}
      {/* ========================================= */}

      <mesh>
        <boxGeometry args={[1.6, 2.2, 1.6]} />

        <meshStandardMaterial
          color="#091820"
          roughness={0.7}
          metalness={0.3}
          emissive="#07313b"
          emissiveIntensity={0.28}
        />
      </mesh>

      {/* ========================================= */}
      {/* STORYBLOOM INTERACTION HITBOX */}
      {/* ========================================= */}

      <mesh
        onClick={(event) => {
          event.stopPropagation();

          console.log("StoryBloom District clicked");

          setSelectedProject(storyBloom ?? null);
        }}
      >
        <boxGeometry args={[1.65, 2.25, 1.65]} />

        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* ========================================= */}
      {/* WINDOWS */}
      {/* ========================================= */}

      <CityWindows
        width={1.6}
        height={2.2}
        depth={1.6}
        rows={3}
        columns={2}
        position={[0, 0, 0]}
        frontZ={0.82}
        color="#10b981"
      />

      {/* ========================================= */}
      {/* NEON STRIPS */}
      {/* ========================================= */}

      <CityNeonStrips
        width={1.6}
        height={2.2}
        depth={1.6}
        position={[0, 0, 0]}
        opacity={0.4}
        color="#10b981"
      />

      {/* ========================================= */}
      {/* ROOFTOP DETAILS */}
      {/* ========================================= */}

      <CityRooftopDetails
        width={1.6}
        depth={1.6}
        height={2.2}
        position={[0, 0, 0]}
        scale={0.65}
        color="#10b981"
      />
    </group>
  );
}

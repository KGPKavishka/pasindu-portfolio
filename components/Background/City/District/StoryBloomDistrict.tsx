"use client";

import CityWindows from "../CityWindows";
import CityNeonStrips from "../CityNeonStrips";
import CityRooftopDetails from "../CityRooftopDetails";

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
  const storyBloom = projects.find((project) => project.id === "storybloom");

  return (
    <group position={position}>
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

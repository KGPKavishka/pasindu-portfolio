"use client";

import { ReactNode } from "react";
import { useThree } from "@react-three/fiber";

import { JourneyWorldPoint, journeyWorld } from "@/components/Journey/journeyWorldConfig";
import { projects } from "@/data/portfolioData";

interface DistrictProps {
  projectId: string;
  position: JourneyWorldPoint;
  children: ReactNode;
}

interface LandmarkProps {
  isCompact: boolean;
}

function District({
  projectId,
  position,
  children,
}: DistrictProps) {
  const project = projects.find((item) => item.id === projectId);

  if (!project) return null;

  const accent = project.accentColor ?? "#22d3ee";

  return (
    <group
      position={[position[0], position[1], position[2]]}
      userData={{ projectId: project.id, title: project.title }}
    >
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[4.5, 5, 0.7, 32]} />
        <meshStandardMaterial
          color="#041017"
          metalness={0.62}
          roughness={0.32}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[3.8, 3.98, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={0.62} />
      </mesh>
      {children}
    </group>
  );
}

function HealthBridgeLandmark() {
  return (
    <group>
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[3.2, 6.6, 3.2]} />
        <meshStandardMaterial
          color="#071720"
          emissive="#00d4ff"
          emissiveIntensity={0.2}
          metalness={0.55}
          roughness={0.32}
        />
      </mesh>
      <mesh position={[0, 3.8, 1.64]}>
        <boxGeometry args={[0.45, 2.2, 0.08]} />
        <meshBasicMaterial color="#67e8f9" />
      </mesh>
      <mesh position={[0, 3.8, 1.66]}>
        <boxGeometry args={[2.2, 0.45, 0.08]} />
        <meshBasicMaterial color="#67e8f9" />
      </mesh>
    </group>
  );
}

function EzyMapLandmark({ isCompact }: LandmarkProps) {
  return (
    <group>
      <mesh position={[0, 2.7, 0]}>
        <cylinderGeometry args={[1.4, 2.4, 5.4, 8]} />
        <meshStandardMaterial
          color="#171208"
          emissive="#f59e0b"
          emissiveIntensity={0.22}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {[1.2, 2.7, 4.2].map((height) => (
        <mesh key={height} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.75, 0.08, 8, isCompact ? 24 : 40]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      ))}
      <mesh position={[0, 5.8, 0]}>
        <octahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial color="#fde68a" />
      </mesh>
    </group>
  );
}

function KVAudioLandmark({ isCompact }: LandmarkProps) {
  return (
    <group>
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[4.6, 5.2, 2.8]} />
        <meshStandardMaterial
          color="#100a18"
          emissive="#8b5cf6"
          emissiveIntensity={0.2}
          metalness={0.58}
          roughness={0.34}
        />
      </mesh>
      {[-1.25, 1.25].map((x) => (
        <group key={x} position={[x, 2.7, 1.48]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.85, 0.48, 0.25, isCompact ? 18 : 32]} />
            <meshBasicMaterial color="#a78bfa" />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <torusGeometry args={[1.05, 0.07, 8, isCompact ? 20 : 36]} />
            <meshBasicMaterial color="#c4b5fd" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StoryBloomLandmark({ isCompact }: LandmarkProps) {
  return (
    <group position={[0, 2.1, 0]}>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.35, 0.6, 3.5, 12]} />
        <meshStandardMaterial color="#0b2a22" metalness={0.4} roughness={0.45} />
      </mesh>
      {Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;

        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 1.4, 1.5, Math.sin(angle) * 1.4]}
            scale={[0.75, 1.5, 0.55]}
          >
            <sphereGeometry
              args={[0.85, isCompact ? 14 : 24, isCompact ? 14 : 24]}
            />
            <meshStandardMaterial
              color="#10b981"
              emissive="#10b981"
              emissiveIntensity={0.24}
              roughness={0.4}
            />
          </mesh>
        );
      })}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry
          args={[0.9, isCompact ? 14 : 24, isCompact ? 14 : 24]}
        />
        <meshBasicMaterial color="#6ee7b7" />
      </mesh>
    </group>
  );
}

export default function ProjectDistricts() {
  const { size } = useThree();
  const isCompact = size.width < 768;

  return (
    <group>
      <District projectId="healthbridge" position={journeyWorld.healthbridge}>
        <HealthBridgeLandmark />
      </District>
      <District projectId="ezymap" position={journeyWorld.ezymap}>
        <EzyMapLandmark isCompact={isCompact} />
      </District>
      <District projectId="kvaudio" position={journeyWorld.kvaudio}>
        <KVAudioLandmark isCompact={isCompact} />
      </District>
      <District projectId="storybloom" position={journeyWorld.storybloom}>
        <StoryBloomLandmark isCompact={isCompact} />
      </District>
    </group>
  );
}
"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import { creativeWorks } from "@/data/creativeData";
import { futureSkills } from "@/data/futureData";

const categoryColors: Record<string, string> = {
  Art: "#f472b6",
  "UI Design": "#22d3ee",
  Research: "#a78bfa",
  Logo: "#fbbf24",
};

const futureColors: Record<string, string> = {
  purple: "#a78bfa",
  pink: "#f472b6",
  blue: "#60a5fa",
  green: "#34d399",
  cyan: "#22d3ee",
  indigo: "#818cf8",
  orange: "#fb923c",
  rose: "#fb7185",
};

export default function CreativeFutureLandmarks() {
  const { progress } = useJourney();
  const creativeRef = useRef<THREE.Group>(null);
  const futureRef = useRef<THREE.Group>(null);
  const categories = useMemo(
    () =>
      Array.from(new Set(creativeWorks.map((work) => work.category))).map(
        (category) => ({
          category,
          count: creativeWorks.filter((work) => work.category === category).length,
        })
      ),
    []
  );

  useFrame(({ clock }) => {
    const journeyProgress = progress.get();
    const creativeReveal = THREE.MathUtils.smoothstep(
      journeyProgress,
      0.74,
      0.84
    );
    const futureReveal = THREE.MathUtils.smoothstep(
      journeyProgress,
      0.83,
      0.92
    );

    if (creativeRef.current) {
      creativeRef.current.position.y = THREE.MathUtils.lerp(
        -2.5,
        0,
        creativeReveal
      );
      creativeRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.1) * 0.06;
    }

    if (futureRef.current) {
      futureRef.current.position.y = THREE.MathUtils.lerp(
        -2.2,
        0,
        futureReveal
      );
    }
  });

  return (
    <group>
      <group
        ref={creativeRef}
        position={[-7, -2.5, -252]}
        userData={{ workCount: creativeWorks.length }}
      >
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[5.5, 6, 0.7, 48]} />
          <meshStandardMaterial
            color="#120919"
            metalness={0.58}
            roughness={0.34}
          />
        </mesh>

        {categories.map(({ category, count }, index) => {
          const angle = (index / categories.length) * Math.PI * 2;
          const color = categoryColors[category] ?? "#22d3ee";

          return (
            <group
              key={category}
              position={[Math.cos(angle) * 3.4, 2.6, Math.sin(angle) * 3.4]}
              rotation={[0, -angle + Math.PI / 2, 0]}
              userData={{ category, count }}
            >
              <mesh>
                <boxGeometry args={[2.2, 3.4, 0.18]} />
                <meshStandardMaterial
                  color="#140d1c"
                  emissive={color}
                  emissiveIntensity={0.2}
                  metalness={0.42}
                  roughness={0.4}
                />
              </mesh>
              {Array.from({ length: Math.min(count, 6) }, (_, lightIndex) => (
                <mesh
                  key={lightIndex}
                  position={[
                    -0.72 + (lightIndex % 2) * 1.44,
                    1.05 - Math.floor(lightIndex / 2) * 0.95,
                    0.11,
                  ]}
                >
                  <boxGeometry args={[0.42, 0.42, 0.04]} />
                  <meshBasicMaterial color={color} transparent opacity={0.78} />
                </mesh>
              ))}
            </group>
          );
        })}

        <mesh position={[0, 3.1, 0]}>
          <dodecahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial
            color="#2a1231"
            emissive="#f472b6"
            emissiveIntensity={0.38}
            wireframe
          />
        </mesh>
      </group>

      <group
        ref={futureRef}
        position={[7, -2.2, -274]}
        userData={{ skillCount: futureSkills.length }}
      >
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[5.5, 6, 0.6, 48]} />
          <meshStandardMaterial color="#070c18" metalness={0.7} roughness={0.28} />
        </mesh>

        {futureSkills.map((skill, index) => {
          const angle = (index / futureSkills.length) * Math.PI * 2;
          const radius = 2.9 + (index % 2) * 1.15;
          const color = futureColors[skill.color] ?? "#22d3ee";
          const scale = 0.42 + skill.progress / 180;

          return (
            <group
              key={skill.id}
              position={[
                Math.cos(angle) * radius,
                1.4 + (index % 3) * 1.15,
                Math.sin(angle) * radius,
              ]}
              userData={{
                skillId: skill.id,
                title: skill.title,
                progress: skill.progress,
              }}
            >
              <mesh scale={scale}>
                <octahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                  color="#0b1220"
                  emissive={color}
                  emissiveIntensity={0.48}
                  metalness={0.48}
                  roughness={0.32}
                />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[scale + 0.28, scale + 0.34, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.5} />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 3.2, 0]}>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshBasicMaterial color="#a5f3fc" wireframe />
        </mesh>
      </group>
    </group>
  );
}
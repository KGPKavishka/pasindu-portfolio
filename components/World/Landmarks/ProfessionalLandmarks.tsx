"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { journeyWorld } from "@/components/Journey/journeyWorldConfig";
import { experiences } from "@/data/experienceData";
import { skills } from "@/data/skillsData";

export default function ProfessionalLandmarks() {
  const experienceRef = useRef<THREE.Group>(null);
  const experience = experiences[0];

  useFrame(({ clock }) => {
    if (experienceRef.current) {
      experienceRef.current.rotation.y =
        Math.sin(clock.getElapsedTime() * 0.12) * 0.08;
    }
  });

  return (
    <group>
      <group
        ref={experienceRef}
        position={[...journeyWorld.experience]}
        userData={{ company: experience.company, role: experience.role }}
      >
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[5.2, 5.7, 0.7, 48]} />
          <meshStandardMaterial color="#040d14" metalness={0.68} roughness={0.3} />
        </mesh>
        <mesh position={[0, 4.4, 0]}>
          <cylinderGeometry args={[1.5, 2.8, 8.8, 8]} />
          <meshStandardMaterial
            color="#07151e"
            emissive="#0891b2"
            emissiveIntensity={0.22}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        {experience.achievements.map((achievement, index) => (
          <mesh
            key={achievement}
            position={[0, 1.1 + index * 1.05, 0]}
            userData={{ achievement }}
          >
            <cylinderGeometry args={[2.45 - index * 0.1, 2.5 - index * 0.1, 0.13, 8]} />
            <meshBasicMaterial color="#22d3ee" transparent opacity={0.72} />
          </mesh>
        ))}
        <mesh position={[0, 9.15, 0]}>
          <octahedronGeometry args={[0.5, 1]} />
          <meshBasicMaterial color="#a5f3fc" />
        </mesh>
      </group>

      <group position={[...journeyWorld.data]}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[12, 0.6, 8]} />
          <meshStandardMaterial color="#030c12" metalness={0.62} roughness={0.35} />
        </mesh>
        {skills.map((skill, rackIndex) => {
          const x = (rackIndex - (skills.length - 1) / 2) * 2;

          return (
            <group
              key={skill.id}
              position={[x, 2.2, 0]}
              userData={{ skillId: skill.id, title: skill.title, level: skill.level }}
            >
              <mesh>
                <boxGeometry args={[1.45, 4.4, 2]} />
                <meshStandardMaterial
                  color="#06131b"
                  emissive="#082f49"
                  emissiveIntensity={0.24}
                  metalness={0.72}
                  roughness={0.25}
                />
              </mesh>
              {skill.technologies.map((technology, technologyIndex) => (
                <mesh
                  key={technology}
                  position={[0, -1.45 + technologyIndex * 0.72, 1.02]}
                  userData={{ technology }}
                >
                  <boxGeometry args={[0.92, 0.12, 0.04]} />
                  <meshBasicMaterial color="#38bdf8" />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>
    </group>
  );
}
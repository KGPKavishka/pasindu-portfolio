"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import { contactItems } from "@/data/contactData";

export default function ContactLandmarks() {
  const { progress } = useJourney();
  const contactRef = useRef<THREE.Group>(null);
  const completionRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const journeyProgress = progress.get();
    const contactReveal = THREE.MathUtils.smoothstep(
      journeyProgress,
      0.9,
      0.98
    );
    const completionReveal = THREE.MathUtils.smoothstep(
      journeyProgress,
      0.97,
      1
    );

    if (contactRef.current) {
      contactRef.current.position.y = THREE.MathUtils.lerp(
        -2,
        0,
        contactReveal
      );
    }

    if (completionRef.current) {
      completionRef.current.scale.setScalar(
        THREE.MathUtils.lerp(0.6, 1, completionReveal)
      );
      completionRef.current.rotation.y = clock.getElapsedTime() * 0.035;
    }
  });

  return (
    <group>
      <group
        ref={contactRef}
        position={[0, -2, -296]}
        userData={{ contactCount: contactItems.length }}
      >
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[6, 6.5, 0.7, 48]} />
          <meshStandardMaterial
            color="#030d12"
            metalness={0.66}
            roughness={0.3}
          />
        </mesh>

        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[1.1, 2.5, 5.2, 8]} />
          <meshStandardMaterial
            color="#061820"
            emissive="#0e7490"
            emissiveIntensity={0.32}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>

        {contactItems.map((item, index) => {
          const angle = (index / contactItems.length) * Math.PI * 2;
          const x = Math.cos(angle) * 4.2;
          const z = Math.sin(angle) * 4.2;

          return (
            <group
              key={item.id}
              position={[x, 1.3, z]}
              userData={{
                contactId: item.id,
                title: item.title,
                href: item.href,
              }}
            >
              <mesh>
                <cylinderGeometry args={[0.42, 0.72, 2.6, 8]} />
                <meshStandardMaterial
                  color="#07151c"
                  emissive="#22d3ee"
                  emissiveIntensity={0.26}
                  metalness={0.62}
                  roughness={0.3}
                />
              </mesh>
              <mesh position={[0, 1.55, 0]}>
                <sphereGeometry args={[0.28, 16, 16]} />
                <meshBasicMaterial color="#67e8f9" />
              </mesh>
              <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[-x / 2, -1.2, -z / 2]}
                scale={[Math.max(Math.abs(x), 0.1), 1, 1]}
              >
                <planeGeometry args={[1, 0.035]} />
                <meshBasicMaterial color="#164e63" transparent opacity={0.55} />
              </mesh>
            </group>
          );
        })}

        <mesh position={[0, 5.6, 0]}>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshBasicMaterial color="#a5f3fc" />
        </mesh>
      </group>

      <group ref={completionRef} position={[0, 2.5, -320]} scale={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.25, 1]} />
          <meshStandardMaterial
            color="#06141b"
            emissive="#22d3ee"
            emissiveIntensity={0.4}
            wireframe
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.8, 3.92, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.28} />
        </mesh>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[3.1, 3.18, 64]} />
          <meshBasicMaterial color="#67e8f9" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
}
"use client";

import { Image } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

import { scrollState } from "../Shared/ScrollController";

const canvases = [
  {
    position: [-1.85, 2.45, 0],
    image: "/creative/art/digital-art-1.jpg",
    tilt: -0.18,
  },
  {
    position: [0, 3.1, -0.4],
    image: "/creative/ui/portfolio-wireframe-1.png",
    tilt: 0,
  },
  {
    position: [1.85, 2.15, 0],
    image: "/creative/research/healthbridge-poster.jpg",
    tilt: 0.18,
  },
] as const;

export default function CreativeDistrict() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const activation = THREE.MathUtils.smoothstep(
      scrollState.current,
      0.74,
      0.82,
    );
    const scale = THREE.MathUtils.lerp(0.14, 1, activation);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.05),
    );
    groupRef.current.position.y =
      Math.sin(clock.getElapsedTime() * 0.28) * 0.16;
  });

  return (
    <group ref={groupRef} position={[3.5, 0, -66]}>
      <mesh>
        <cylinderGeometry args={[3.1, 3.45, 0.34, 48]} />
        <meshStandardMaterial
          color="#160b1d"
          metalness={0.68}
          roughness={0.32}
        />
      </mesh>
      {canvases.map((canvas) => (
        <group
          key={canvas.image}
          position={canvas.position}
          rotation={[0, canvas.tilt, 0]}
        >
          <mesh position={[0, 0, -0.04]}>
            <boxGeometry args={[1.62, 2.22, 0.1]} />
            <meshStandardMaterial
              color="#f472b6"
              emissive="#f472b6"
              emissiveIntensity={0.18}
            />
          </mesh>
          {/* Drei Image renders a WebGL mesh; its source work is described in CreativeStudio. */}
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            url={canvas.image}
            scale={[1.48, 2.06]}
            transparent
            opacity={0.94}
          />
        </group>
      ))}
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.62, 48]} />
        <meshBasicMaterial color="#f472b6" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

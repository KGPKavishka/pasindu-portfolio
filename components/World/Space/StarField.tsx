"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";

interface PointLayerProps {
  count: number;
  color: string;
  size: number;
  opacity: number;
  spread: number;
  depth: number;
  drift: number;
}

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

function PointLayer({
  count,
  color,
  size,
  opacity,
  spread,
  depth,
  drift,
}: PointLayerProps) {
  const { progress } = useJourney();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;

      values[offset] = (seededRandom(index + 17) - 0.5) * spread;
      values[offset + 1] = (seededRandom(index + 71) - 0.5) * spread * 0.65;
      values[offset + 2] = -seededRandom(index + 149) * depth + 8;
    }

    return values;
  }, [count, depth, spread]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !materialRef.current) return;

    pointsRef.current.rotation.y = clock.getElapsedTime() * drift;
    const atmosphericEntry = THREE.MathUtils.smoothstep(
      progress.get(),
      0.14,
      0.27
    );
    materialRef.current.opacity = THREE.MathUtils.lerp(
      opacity,
      opacity * 0.04,
      atmosphericEntry
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

export default function StarField() {
  const { size } = useThree();
  const isCompact = size.width < 768;

  return (
    <group>
      <PointLayer
        count={isCompact ? 280 : 620}
        color="#d9f7ff"
        size={0.055}
        opacity={0.8}
        spread={70}
        depth={110}
        drift={0.003}
      />
      <PointLayer
        count={isCompact ? 90 : 180}
        color="#67e8f9"
        size={0.11}
        opacity={0.28}
        spread={55}
        depth={95}
        drift={-0.002}
      />
    </group>
  );
}
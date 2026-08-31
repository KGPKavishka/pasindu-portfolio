"use client";

import { useMemo } from "react";
import * as THREE from "three";

type StarLayerProps = {
  count: number;
  spread: number;
  depth: number;
  size: number;
  color: string;
};

function StarLayer({
  count,
  spread,
  depth,
  size,
  color,
}: StarLayerProps) {
  const positions = useMemo(() => {
    const vertices: number[] = [];

    for (let i = 0; i < count; i++) {
      const x = Math.sin(i * 12.9898) * 0.5;
      const y = Math.sin(i * 78.233) * 0.5;
      const z = Math.sin(i * 43.758) * 0.5;

      vertices.push(
        x * spread,
        y * spread,
        -20 - Math.abs(z) * depth
      );
    }

    return new Float32Array(vertices);
  }, [count, spread, depth]);

  const starTexture = useMemo(() => {
    const canvas = document.createElement("canvas");

    canvas.width = 64;
    canvas.height = 64;

    const context = canvas.getContext("2d");

    if (!context) return null;

    const gradient = context.createRadialGradient(
      32,
      32,
      0,
      32,
      32,
      32
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(220,250,255,1)");
    gradient.addColorStop(0.5, "rgba(180,240,255,0.6)");
    gradient.addColorStop(1, "rgba(180,240,255,0)");

    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);

    texture.needsUpdate = true;

    return texture;
  }, []);

  if (!starTexture) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        map={starTexture}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
}

export default function Stars3D() {
  return (
    <>
      {/* Far stars */}
      <StarLayer
        count={5000}
        spread={320}
        depth={420}
        size={0.24}
        color="#dbeafe"
      />

      {/* Mid stars */}
      <StarLayer
        count={1500}
        spread={240}
        depth={260}
        size={0.42}
        color="#f8fafc"
      />

      {/* Near stars */}
      <StarLayer
        count={250}
        spread={140}
        depth={120}
        size={0.75}
        color="#ffffff"
      />
    </>
  );
}
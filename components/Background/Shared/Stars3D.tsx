"use client";

import { useMemo } from "react";

type LayerProps = {
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
}: LayerProps) {
  const positions = useMemo(() => {
    const vertices: number[] = [];

    for (let i = 0; i < count; i++) {
      vertices.push(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        -Math.random() * depth
      );
    }

    return new Float32Array(vertices);
  }, [count, spread, depth]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>

      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
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
        count={3500}
        spread={320}
        depth={420}
        size={0.18}
        color="#dbeafe"
      />

      {/* Mid stars */}
      <StarLayer
        count={1200}
        spread={240}
        depth={260}
        size={0.35}
        color="#f8fafc"
      />

      {/* Near stars */}
      <StarLayer
        count={250}
        spread={140}
        depth={120}
        size={0.7}
        color="#ffffff"
      />
    </>
  );
}
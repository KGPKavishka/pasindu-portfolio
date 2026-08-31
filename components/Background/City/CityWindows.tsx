"use client";

import * as THREE from "three";

interface CityWindowsProps {
  width: number;
  height: number;
  depth: number;
  rows: number;
  columns: number;
  position?: [number, number, number];
  frontZ?: number;
  color?: string;
}

export default function CityWindows({
  width,
  height,
  depth,
  rows,
  columns,
  position = [0, 0, 0],
  frontZ = depth / 2 + 0.02,
  color = "#22d3ee",
}: CityWindowsProps) {
  const windows = [];

  const windowWidth = (width * 0.55) / columns;
  const windowHeight = (height * 0.45) / rows;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const x =
        -((columns - 1) * windowWidth) / 2 +
        column * windowWidth;

      const y =
        height * 0.25 -
        row * windowHeight;

      windows.push(
        <mesh
          key={`${row}-${column}`}
          position={[x, y, frontZ]}
        >
          <planeGeometry
            args={[
              windowWidth * 0.45,
              windowHeight * 0.45,
            ]}
          />

          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.65}
            side={THREE.DoubleSide}
          />
        </mesh>,
      );
    }
  }

  return (
    <group position={position}>
      {windows}
    </group>
  );
}
"use client";

interface CityNeonStripsProps {
  width: number;
  height: number;
  depth: number;
  position?: [number, number, number];
  opacity?: number;
  color?: string;
}

export default function CityNeonStrips({
  width,
  height,
  depth,
  position = [0, 0, 0],
  opacity = 0.7,
  color = "#22d3ee",
}: CityNeonStripsProps) {
  const stripWidth = 0.035;

  const verticalOffset = width * 0.38;

  return (
    <group position={position}>
      {/* ========================================= */}
      {/* FRONT LEFT STRIP */}
      {/* ========================================= */}

      <mesh
        position={[
          -verticalOffset,
          0,
          depth / 2 + 0.025,
        ]}
      >
        <boxGeometry
          args={[
            stripWidth,
            height * 0.86,
            0.025,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ========================================= */}
      {/* FRONT RIGHT STRIP */}
      {/* ========================================= */}

      <mesh
        position={[
          verticalOffset,
          0,
          depth / 2 + 0.025,
        ]}
      >
        <boxGeometry
          args={[
            stripWidth,
            height * 0.86,
            0.025,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ========================================= */}
      {/* LEFT SIDE STRIP */}
      {/* ========================================= */}

      <mesh
        position={[
          -width / 2 - 0.025,
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.025,
            height * 0.72,
            stripWidth,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.65}
        />
      </mesh>

      {/* ========================================= */}
      {/* RIGHT SIDE STRIP */}
      {/* ========================================= */}

      <mesh
        position={[
          width / 2 + 0.025,
          0,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.025,
            height * 0.72,
            stripWidth,
          ]}
        />

        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.65}
        />
      </mesh>
    </group>
  );
}
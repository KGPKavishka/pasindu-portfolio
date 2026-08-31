"use client";

interface CityRooftopDetailsProps {
  width: number;
  depth: number;
  height: number;
  position?: [number, number, number];
  scale?: number;
  color?: string;
}

export default function CityRooftopDetails({
  width,
  depth,
  height,
  position = [0, 0, 0],
  scale = 1,
  color = "#22d3ee",
}: CityRooftopDetailsProps) {
  const roofY = height / 2;

  return (
    <group position={position} scale={scale}>
      {/* ========================================= */}
      {/* CENTRAL ROOFTOP UNIT */}
      {/* ========================================= */}

      <mesh position={[0, roofY + 0.12, 0]}>
        <boxGeometry args={[width * 0.22, 0.18, depth * 0.22]} />

        <meshStandardMaterial
          color="#0a202b"
          roughness={0.55}
          metalness={0.6}
          emissive="#063542"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* ========================================= */}
      {/* ANTENNA */}
      {/* ========================================= */}

      <mesh position={[0, roofY + 0.55, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.75, 12]} />

        <meshBasicMaterial color={color} />
      </mesh>

      {/* ========================================= */}
      {/* BEACON LIGHT */}
      {/* ========================================= */}

      <mesh position={[0, roofY + 0.95, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />

        <meshBasicMaterial color={color} />
      </mesh>

      {/* ========================================= */}
      {/* SMALL LEFT UNIT */}
      {/* ========================================= */}

      <mesh position={[-width * 0.28, roofY + 0.09, -depth * 0.12]}>
        <boxGeometry args={[width * 0.12, 0.14, depth * 0.16]} />

        <meshStandardMaterial
          color="#081923"
          roughness={0.65}
          metalness={0.5}
        />
      </mesh>

      {/* ========================================= */}
      {/* SMALL RIGHT UNIT */}
      {/* ========================================= */}

      <mesh position={[width * 0.28, roofY + 0.09, depth * 0.12]}>
        <boxGeometry args={[width * 0.12, 0.14, depth * 0.16]} />

        <meshStandardMaterial
          color="#081923"
          roughness={0.65}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

"use client";

export default function CityGround() {
  return (
    <group>
      {/* ========================================= */}
      {/* CITY PLATFORM */}
      {/* ========================================= */}

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[5.5, 5.5, 0.25, 64]} />

        <meshStandardMaterial
          color="#061018"
          roughness={0.85}
          metalness={0.35}
          emissive="#031820"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* ========================================= */}
      {/* CITY DISTRICT RING */}
      {/* ========================================= */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.14, 0]}
      >
        <ringGeometry args={[3.9, 4.02, 64]} />

        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* ========================================= */}
      {/* LEFT DISTRICT CONNECTION */}
      {/* ========================================= */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-1.45, 0.16, 0]}
      >
        <planeGeometry args={[2.6, 0.28]} />

        <meshBasicMaterial
          color="#0b2733"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ========================================= */}
      {/* RIGHT DISTRICT CONNECTION */}
      {/* ========================================= */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[1.45, 0.16, 0]}
      >
        <planeGeometry args={[2.6, 0.28]} />

        <meshBasicMaterial
          color="#0b2733"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ========================================= */}
      {/* FRONT DISTRICT CONNECTION */}
      {/* ========================================= */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.16, 1.45]}
      >
        <planeGeometry args={[0.28, 2.6]} />

        <meshBasicMaterial
          color="#0b2733"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* ========================================= */}
      {/* CENTRAL DISTRICT CROSSING */}
      {/* ========================================= */}

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.17, 0]}
      >
        <circleGeometry args={[0.45, 32]} />

        <meshBasicMaterial
          color="#0d3440"
          transparent
          opacity={0.95}
        />
      </mesh>
    </group>
  );
}
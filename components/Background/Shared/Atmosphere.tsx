"use client";

export default function Atmosphere() {
  return (
    <>
      {/* Distant cyan nebula */}
      <mesh position={[-35, 15, -70]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.035}
          depthWrite={false}
        />
      </mesh>

      {/* Distant violet nebula */}
      <mesh position={[40, -10, -90]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>

      {/* Distant blue nebula */}
      <mesh position={[0, 30, -120]}>
        <sphereGeometry args={[45, 32, 32]} />
        <meshBasicMaterial
          color="#1d4ed8"
          transparent
          opacity={0.02}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
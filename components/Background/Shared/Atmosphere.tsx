"use client";

export default function Atmosphere() {
  return (
    <>
      {/* Cyan glow */}
      <mesh position={[-35, 15, -70]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial
          color="#22d3ee"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Purple glow */}
      <mesh position={[40, -10, -90]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Blue nebula */}
      <mesh position={[0, 30, -120]}>
        <sphereGeometry args={[45, 32, 32]} />
        <meshBasicMaterial
          color="#1d4ed8"
          transparent
          opacity={0.05}
        />
      </mesh>
    </>
  );
}
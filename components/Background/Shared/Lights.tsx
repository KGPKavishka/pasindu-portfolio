"use client";

export default function Lights() {
  return (
    <>
      {/* Global ambient light */}
      <ambientLight intensity={0.25} />

      {/* Main cyan key light */}
      <directionalLight
        position={[5, 4, 5]}
        intensity={2}
        color="#67e8f9"
      />

      {/* Soft blue fill */}
      <pointLight
        position={[-8, 3, 6]}
        intensity={15}
        distance={40}
        color="#60a5fa"
      />

      {/* Purple rim */}
      <pointLight
        position={[8, -4, -2]}
        intensity={10}
        distance={35}
        color="#8b5cf6"
      />
    </>
  );
}
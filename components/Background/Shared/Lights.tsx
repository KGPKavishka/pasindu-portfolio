"use client";

export default function Lights() {
  return (
    <>
      {/* ========================================= */}
      {/* GLOBAL AMBIENT LIGHT */}
      {/* ========================================= */}

      <ambientLight intensity={0.65} color="#b8eaff" />

      {/* ========================================= */}
      {/* MAIN CYAN KEY LIGHT */}
      {/* ========================================= */}

      <directionalLight position={[5, 8, 6]} intensity={4} color="#67e8f9" />

      {/* ========================================= */}
      {/* SOFT BLUE FRONT FILL */}
      {/* ========================================= */}

      <pointLight
        position={[-6, 4, 8]}
        intensity={15}
        distance={40}
        color="#38bdf8"
      />

      {/* ========================================= */}
      {/* PURPLE BACK / RIM LIGHT */}
      {/* ========================================= */}

      <pointLight
        position={[8, 2, -6]}
        intensity={10}
        distance={45}
        color="#8b5cf6"
      />

      {/* ========================================= */}
      {/* CITY TOP LIGHT */}
      {/* ========================================= */}

      <pointLight
        position={[0, 10, 2]}
        intensity={8}
        distance={35}
        color="#22d3ee"
      />
    </>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";

function TestSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4fd1c5" />
    </mesh>
  );
}

export default function JourneyScene() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
        }}
      >
        <color attach="background" args={["#020617"]} />

        <ambientLight intensity={0.4} />

        <pointLight
          position={[3, 3, 5]}
          intensity={20}
          distance={20}
        />

        <TestSphere />
      </Canvas>
    </div>
  );
}
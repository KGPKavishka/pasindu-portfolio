"use client";

import { Canvas } from "@react-three/fiber";
import Stars3D from "./Shared/Stars3D";
import Lights from "./Shared/Lights";
import Atmosphere from "./Shared/Atmosphere";

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
        }}
      >
        <Lights />
        {/* <Atmosphere /> */}
        <Stars3D />
      </Canvas>
    </div>
  );
}
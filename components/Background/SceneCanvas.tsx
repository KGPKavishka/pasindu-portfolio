"use client";

import { Canvas } from "@react-three/fiber";
import { Project } from "../../types/project";

import Stars3D from "./Shared/Stars3D";
import CameraRig from "./Shared/CameraRig";
import Lights from "./Shared/Lights";
import Atmosphere from "./Shared/Atmosphere";
import Particles3D from "./Shared/Particles3D";
import ScrollController from "./Shared/ScrollController";
import Planet from "./Planet/Planet";
import CityCore from "./City/CityCore";

interface SceneCanvasProps {
  setSelectedProject: (project: Project | null) => void;
}

export default function SceneCanvas({ setSelectedProject }: SceneCanvasProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
        }}
        onPointerMissed={() => {
          console.log("Canvas received pointer event");
        }}
      >
        <Stars3D />

        <Lights />

        <Atmosphere />

        <Particles3D />

        <ScrollController />

        <CameraRig>
          <group />
        </CameraRig>

        <Planet />
        <CityCore setSelectedProject={setSelectedProject} />
      </Canvas>
    </div>
  );
}

"use client";

import { Canvas } from "@react-three/fiber";
import { Project } from "../../types/project";

import ExperienceScene from "./ExperienceScene";

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
      >
        <ExperienceScene setSelectedProject={setSelectedProject} />
      </Canvas>
    </div>
  );
}

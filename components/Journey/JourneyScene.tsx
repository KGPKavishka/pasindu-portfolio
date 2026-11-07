"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import SpaceEnvironment from "@/components/World/Space/SpaceEnvironment";
import OrbitScene from "@/components/World/Orbit/OrbitScene";
import Planet from "@/components/World/Planet/Planet";
import ProjectStructures from "@/components/World/Outpost/ProjectStructures";
import JourneyAtmosphere from "@/components/World/Atmosphere/JourneyAtmosphere";
import JourneyCameraRig from "./JourneyCameraRig";
import WorldGate from "./WorldGate";
import LandingWorld from "@/components/World/Landing/LandingWorld";

export default function JourneyScene() {
  const [bloomEnabled, setBloomEnabled] = useState(
    () => typeof window === "undefined" || window.innerWidth >= 768
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      data-layer="journey-environment"
    >
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={["#050505"]} />

        <AdaptiveDpr pixelated={false} />
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => setBloomEnabled(false)}
          onFallback={() => setBloomEnabled(false)}
        />

        <JourneyCameraRig />
        <JourneyAtmosphere />
        <SpaceEnvironment />
        <OrbitScene />
        <Planet />
        <LandingWorld />
        <WorldGate from={0.27}>
          <ProjectStructures />
        </WorldGate>

        {bloomEnabled && (
          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={1.08}
              luminanceSmoothing={0.25}
              intensity={0.45}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
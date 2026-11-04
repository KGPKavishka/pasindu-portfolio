"use client";

import { Canvas } from "@react-three/fiber";

import SpaceEnvironment from "@/components/World/Space/SpaceEnvironment";
import OrbitScene from "@/components/World/Orbit/OrbitScene";
import Planet from "@/components/World/Planet/Planet";
import PlanetSurface from "@/components/World/Surface/PlanetSurface";
import CityEnvironment from "@/components/World/City/CityEnvironment";
import JourneyTransitRoute from "@/components/World/City/JourneyTransitRoute";
import ProjectDistricts from "@/components/World/Districts/ProjectDistricts";
import ProfessionalLandmarks from "@/components/World/Landmarks/ProfessionalLandmarks";
import CreativeFutureLandmarks from "@/components/World/Landmarks/CreativeFutureLandmarks";
import ContactLandmarks from "@/components/World/Landmarks/ContactLandmarks";
import JourneyAtmosphere from "@/components/World/Atmosphere/JourneyAtmosphere";
import JourneyCameraRig from "./JourneyCameraRig";
import WorldGate from "./WorldGate";

export default function JourneyScene() {
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
        }}
      >
        <color attach="background" args={["#050505"]} />

        <JourneyCameraRig />
        <JourneyAtmosphere />
        <SpaceEnvironment />
        <OrbitScene />
        <Planet />
        <WorldGate from={0.16}>
          <PlanetSurface />
          <JourneyTransitRoute />
          <CityEnvironment />
          <ProjectDistricts />
          <ProfessionalLandmarks />
          <CreativeFutureLandmarks />
          <ContactLandmarks />
        </WorldGate>
      </Canvas>
    </div>
  );
}
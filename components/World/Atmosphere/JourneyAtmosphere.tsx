"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import {
  landingUniforms,
  updateTimeOfDay,
} from "@/components/World/Landing/landingConfig";

export default function JourneyAtmosphere() {
  const { scene } = useThree();
  const { progress } = useJourney();
  const sceneRef = useRef(scene);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const directionalRef = useRef<THREE.DirectionalLight>(null);
  const colors = useMemo(
    () => ({
      space: new THREE.Color("#050505"),
      atmosphere: new THREE.Color("#1a120d"),
      current: new THREE.Color("#050505"),
      spaceLight: new THREE.Color("#e9e6df"),
      atmosphereLight: new THREE.Color("#ffe3c2"),
      currentLight: new THREE.Color("#e9e6df"),
    }),
    []
  );

  useEffect(() => {
    const activeScene = sceneRef.current;
    const fog = new THREE.Fog("#050505", 18, 95);
    activeScene.fog = fog;

    return () => {
      activeScene.fog = null;
    };
  }, []);

  useFrame(() => {
    const journeyProgress = progress.get();
    const approachMix = THREE.MathUtils.smoothstep(journeyProgress, 0.12, 0.18);
    const entryIn = THREE.MathUtils.smoothstep(journeyProgress, 0.14, 0.2);
    const entryOut = THREE.MathUtils.smoothstep(journeyProgress, 0.2, 0.27);
    const entryMix = entryIn * (1 - entryOut);
    // Once under the entry plasma, the surface time-of-day sky and sun take over
    // for the rest of the journey.
    const surfaceActive = THREE.MathUtils.smoothstep(journeyProgress, 0.19, 0.208);
    const lighting = updateTimeOfDay(journeyProgress);

    colors.current
      .copy(colors.space)
      .lerp(colors.atmosphere, entryIn * (1 - surfaceActive))
      .lerp(landingUniforms.haze.value, surfaceActive);
    sceneRef.current.background = colors.current;

    if (sceneRef.current.fog instanceof THREE.Fog) {
      sceneRef.current.fog.color.copy(colors.current);
      const approachFar = THREE.MathUtils.lerp(58, 78, approachMix);
      const entryFar = THREE.MathUtils.lerp(approachFar, 38, entryMix);

      sceneRef.current.fog.near = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(18, 8, entryIn),
        32,
        surfaceActive
      );
      sceneRef.current.fog.far = THREE.MathUtils.lerp(entryFar, 135, surfaceActive);
    }

    if (ambientRef.current && directionalRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.08, 0.24, entryIn),
        lighting.ambientIntensity,
        surfaceActive
      );
      ambientRef.current.color
        .copy(colors.spaceLight)
        .lerp(lighting.ambientColor, surfaceActive);

      directionalRef.current.intensity =
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(0, 1.15, approachMix),
          1.55,
          entryMix
        ) *
        (1 - surfaceActive);
      colors.currentLight
        .copy(colors.spaceLight)
        .lerp(colors.atmosphereLight, entryIn);
      directionalRef.current.color.copy(colors.currentLight);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.08} color="#e9e6df" />
      <directionalLight
        ref={directionalRef}
        position={[4, 6, 8]}
        intensity={0}
        color="#e9e6df"
      />
    </>
  );
}
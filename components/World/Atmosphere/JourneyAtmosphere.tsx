"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";

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
      surface: new THREE.Color("#140e0a"),
      city: new THREE.Color("#021116"),
      creative: new THREE.Color("#100819"),
      future: new THREE.Color("#07091a"),
      complete: new THREE.Color("#010509"),
      current: new THREE.Color("#050505"),
      spaceLight: new THREE.Color("#e9e6df"),
      atmosphereLight: new THREE.Color("#ffe3c2"),
      surfaceLight: new THREE.Color("#ffe3c2"),
      currentLight: new THREE.Color("#e9e6df"),
    }),
    []
  );

  useEffect(() => {
    const activeScene = sceneRef.current;
    const fog = new THREE.Fog("#050505", 18, 58);
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
    const surfaceMix = THREE.MathUtils.smoothstep(journeyProgress, 0.2, 0.28);
    const cityMix = THREE.MathUtils.smoothstep(journeyProgress, 0.18, 0.32);
    // The landing site brings its own sun and sky; these lights step aside while
    // it is on screen and return for the city world that follows.
    const landingMix =
      THREE.MathUtils.smoothstep(journeyProgress, 0.19, 0.208) *
      (1 - THREE.MathUtils.smoothstep(journeyProgress, 0.285, 0.31));
    const creativeMix = THREE.MathUtils.smoothstep(journeyProgress, 0.72, 0.85);
    const futureMix = THREE.MathUtils.smoothstep(journeyProgress, 0.84, 0.92);
    const completeMix = THREE.MathUtils.smoothstep(journeyProgress, 0.92, 1);

    colors.current.copy(colors.space).lerp(colors.atmosphere, entryIn);
    colors.current.lerp(colors.surface, surfaceMix);
    colors.current.lerp(colors.city, cityMix);
    colors.current.lerp(colors.creative, creativeMix);
    colors.current.lerp(colors.future, futureMix);
    colors.current.lerp(colors.complete, completeMix);
    sceneRef.current.background = colors.current;

    if (sceneRef.current.fog instanceof THREE.Fog) {
      sceneRef.current.fog.color.copy(colors.current);
      const approachFar = THREE.MathUtils.lerp(58, 78, approachMix);
      const entryFar = THREE.MathUtils.lerp(approachFar, 38, entryMix);

      sceneRef.current.fog.near = THREE.MathUtils.lerp(18, 8, entryIn);
      sceneRef.current.fog.near = THREE.MathUtils.lerp(
        sceneRef.current.fog.near,
        28,
        cityMix
      );
      sceneRef.current.fog.far = THREE.MathUtils.lerp(entryFar, 92, surfaceMix);
    }

    if (ambientRef.current && directionalRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0.08, 0.24, entryIn),
        0.1,
        landingMix
      );
      directionalRef.current.intensity =
        THREE.MathUtils.lerp(
          THREE.MathUtils.lerp(0, 1.15, approachMix),
          1.55,
          entryMix
        ) *
        (1 - landingMix);
      colors.currentLight
        .copy(colors.spaceLight)
        .lerp(colors.atmosphereLight, entryIn)
        .lerp(colors.surfaceLight, surfaceMix);
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
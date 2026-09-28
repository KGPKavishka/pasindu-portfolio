"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";

export default function JourneyAtmosphere() {
  const { scene } = useThree();
  const { progress } = useJourney();
  const sceneRef = useRef(scene);
  const colors = useMemo(
    () => ({
      space: new THREE.Color("#01040b"),
      city: new THREE.Color("#021116"),
      creative: new THREE.Color("#100819"),
      future: new THREE.Color("#07091a"),
      complete: new THREE.Color("#010509"),
      current: new THREE.Color("#01040b"),
    }),
    []
  );

  useEffect(() => {
    const activeScene = sceneRef.current;
    const fog = new THREE.Fog("#01040b", 45, 115);
    activeScene.fog = fog;

    return () => {
      activeScene.fog = null;
    };
  }, []);

  useFrame(() => {
    const journeyProgress = progress.get();
    const cityMix = THREE.MathUtils.smoothstep(journeyProgress, 0.18, 0.32);
    const creativeMix = THREE.MathUtils.smoothstep(journeyProgress, 0.72, 0.85);
    const futureMix = THREE.MathUtils.smoothstep(journeyProgress, 0.84, 0.92);
    const completeMix = THREE.MathUtils.smoothstep(journeyProgress, 0.92, 1);

    colors.current.copy(colors.space).lerp(colors.city, cityMix);
    colors.current.lerp(colors.creative, creativeMix);
    colors.current.lerp(colors.future, futureMix);
    colors.current.lerp(colors.complete, completeMix);
    sceneRef.current.background = colors.current;

    if (sceneRef.current.fog instanceof THREE.Fog) {
      sceneRef.current.fog.color.copy(colors.current);
      sceneRef.current.fog.near = THREE.MathUtils.lerp(45, 28, cityMix);
      sceneRef.current.fog.far = THREE.MathUtils.lerp(115, 92, cityMix);
    }
  });

  return null;
}
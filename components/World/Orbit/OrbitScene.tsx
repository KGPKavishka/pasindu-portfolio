"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import OrbitPlanet from "./OrbitPlanet";
import StationTruss from "./StationTruss";
import {
  type OrbitVisibility,
  createOrbitLayout,
  orbitDissolve,
  orbitStarMask,
} from "./orbitLayout";

const { smoothstep } = THREE.MathUtils;
const SUN_LIGHT_INTENSITY = 3.4;

/**
 * Opening "orbit" shot of the journey: a giant planet with a sunrise at its
 * limb and the station truss the astronaut is working on. Everything hands
 * over to the planet approach and stops rendering once the camera leaves it.
 */
export default function OrbitScene() {
  const { size } = useThree();
  const { currentPhase, progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const isReadyRef = useRef(false);
  const revealStartRef = useRef<number | null>(null);
  const visibility = useRef<OrbitVisibility>({
    intro: 0,
    scenery: 1,
    station: 1,
    time: 0,
  });
  const layout = useMemo(
    () => createOrbitLayout(size.width, size.height),
    [size.width, size.height]
  );

  useEffect(() => {
    isReadyRef.current = currentPhase.id !== "loading";
  }, [currentPhase.id]);

  useEffect(
    () => () => {
      orbitStarMask.cosine.value = 2;
    },
    []
  );

  useFrame(({ clock }, delta) => {
    const state = visibility.current;
    const journeyProgress = progress.get();
    const now = clock.getElapsedTime();

    if (isReadyRef.current && revealStartRef.current === null) {
      revealStartRef.current = now;
    }

    const elapsed =
      revealStartRef.current === null ? 0 : now - revealStartRef.current;

    state.intro = reduceMotion
      ? Number(revealStartRef.current !== null)
      : smoothstep(elapsed, 0, 2.4);
    // The station dissolves first, then the planet and sun hand over to the
    // planet-approach shot (which fades in a touch later, so the two overlap
    // only briefly).
    state.station = 1 - smoothstep(journeyProgress, 0.025, 0.05);
    state.scenery = 1 - smoothstep(journeyProgress, 0.045, 0.068);

    if (!reduceMotion) state.time += Math.min(delta, 0.05);

    const planetVisible = state.scenery * state.intro > 0.001;

    orbitDissolve.value = state.station * state.intro;
    orbitStarMask.direction.value.copy(layout.planet.direction);
    orbitStarMask.cosine.value = planetVisible
      ? Math.cos(layout.planet.angularRadius * 1.02)
      : 2;

    if (sunLightRef.current) {
      sunLightRef.current.intensity =
        SUN_LIGHT_INTENSITY * Math.max(state.station, state.scenery) * state.intro;
    }
  });

  return (
    <>
      {/* Sun: a single hard light. Kept in the scene at zero intensity once the
          opening ends, so the light count (and compiled shaders) never change. */}
      <directionalLight
        ref={sunLightRef}
        position={layout.sun.position}
        color="#fff4e2"
        intensity={0}
      />

      <OrbitPlanet layout={layout} visibility={visibility} />
      <StationTruss layout={layout} visibility={visibility} />
    </>
  );
}

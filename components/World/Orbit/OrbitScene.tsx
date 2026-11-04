"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import OrbitPlanet from "./OrbitPlanet";
import StationTruss from "./StationTruss";
import Tether from "./Tether";
import { createStationEnvironment } from "./stationEnvironment";
import {
  type OrbitVisibility,
  createOrbitLayout,
  orbitDissolve,
  orbitStarMask,
} from "./orbitLayout";

const { smoothstep } = THREE.MathUtils;
const SUN_LIGHT_INTENSITY = 3.4;

/**
 * The orbit view of the journey: a giant planet with a sunrise at its limb and
 * the station truss the astronaut is working on. It stays on screen through the
 * spacewalk, then dissolves into the planet approach.
 */
export default function OrbitScene() {
  const { size } = useThree();
  const gl = useThree((state) => state.gl);
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
  const environment = useMemo(
    () => createStationEnvironment(gl, layout.sun.direction, layout.planet.direction),
    [gl, layout.sun.direction, layout.planet.direction]
  );

  useEffect(() => () => environment.dispose(), [environment]);

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
    // The station stays through the whole spacewalk and dissolves first; then
    // the planet and sun hand over to the planet-approach shot, which fades in
    // underneath (see Planet.tsx).
    state.station = 1 - smoothstep(journeyProgress, 0.105, 0.128);
    state.scenery = 1 - smoothstep(journeyProgress, 0.118, 0.142);

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
          orbit view ends, so the light count (and compiled shaders) never change. */}
      <directionalLight
        ref={sunLightRef}
        position={layout.sun.position}
        color="#fff4e2"
        intensity={0}
      />

      <OrbitPlanet layout={layout} visibility={visibility} />
      <StationTruss layout={layout} visibility={visibility} environment={environment} />
      <Tether layout={layout} visibility={visibility} environment={environment} />
    </>
  );
}

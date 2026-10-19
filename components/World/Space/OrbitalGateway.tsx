"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import PlanetRimLight from "@/components/World/Planet/PlanetRimLight";
import CosmicArc from "./CosmicArc";
import DeepVoidBackdrop from "./DeepVoidBackdrop";
import ForegroundDebris from "./ForegroundDebris";
import GoldenAnomaly from "./GoldenAnomaly";
import {
  GatewayVisibility,
  createOrbitalGatewayLayout,
} from "./orbitalGatewayLayout";

const { smoothstep } = THREE.MathUtils;

/**
 * Opening "Orbital Gateway" shot of the journey: deep void, golden anomaly,
 * cosmic arc and foreground debris. Everything hands over to the planet
 * approach and is hidden once the camera leaves outer space.
 */
export default function OrbitalGateway() {
  const { size } = useThree();
  const { currentPhase, progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);
  const isReadyRef = useRef(false);
  const revealStartRef = useRef<number | null>(null);
  const visibility = useRef<GatewayVisibility>({
    intro: 0,
    galaxy: 0,
    comet: 0,
    debris: 0,
    backdrop: 1,
    time: 0,
    pinDistance: 50,
  });
  const layout = useMemo(
    () => createOrbitalGatewayLayout(size.width, size.height),
    [size.width, size.height]
  );

  useEffect(() => {
    isReadyRef.current = currentPhase.id !== "loading";
  }, [currentPhase.id]);

  useFrame(({ camera, clock }, delta) => {
    const state = visibility.current;
    const journeyProgress = progress.get();
    const now = clock.getElapsedTime();

    // Just behind the planet's far limb, but always in front of the (fogged)
    // landing grid and city further down the route.
    state.pinDistance =
      camera.position.distanceTo(layout.planet.center) + layout.planet.radius * 1.3;

    if (isReadyRef.current && revealStartRef.current === null) {
      revealStartRef.current = now;
    }

    const elapsed =
      revealStartRef.current === null ? 0 : now - revealStartRef.current;
    const isRevealed = revealStartRef.current !== null;
    const intro = reduceMotion
      ? Number(isRevealed)
      : smoothstep(elapsed, 0, 2.6);
    const cometIntro = reduceMotion
      ? Number(isRevealed)
      : smoothstep(elapsed, 0.6, 2.4);

    state.intro = intro;
    state.galaxy = intro * (1 - smoothstep(journeyProgress, 0.1, 0.16));
    state.comet = cometIntro * (1 - smoothstep(journeyProgress, 0.04, 0.09));
    state.debris = intro * (1 - smoothstep(journeyProgress, 0.045, 0.085));
    state.backdrop = 1 - smoothstep(journeyProgress, 0.08, 0.16);

    if (!reduceMotion) state.time += Math.min(delta, 0.05);

    if (groupRef.current) {
      groupRef.current.visible =
        state.backdrop > 0.001 ||
        state.galaxy > 0.001 ||
        state.comet > 0.001 ||
        state.debris > 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      <DeepVoidBackdrop layout={layout} visibility={visibility} />
      <GoldenAnomaly layout={layout} visibility={visibility} />
      <CosmicArc layout={layout} visibility={visibility} />
      <PlanetRimLight layout={layout} visibility={visibility} />
      <ForegroundDebris layout={layout} visibility={visibility} />
    </group>
  );
}

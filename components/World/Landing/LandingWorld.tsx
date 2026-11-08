"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import LandingRocks from "./LandingRocks";
import { LandingSky, LandingTerrain } from "./LandingTerrain";
import {
  START_ALTITUDE,
  descentAltitude,
  landingFade,
  landingOffset,
  landingUniforms,
  updateTimeOfDay,
} from "./landingConfig";

/** Sideways glide (world units) the plain carries while the lander descends. */
const GLIDE = { x: 26, z: -38 };

/**
 * The landing site and surface plain: sky, a plain with distant ridges,
 * boulders and a time-of-day sun. It appears underneath the entry plasma, then
 * the *ground rises to meet the camera* (altitude falls to zero at touchdown),
 * and remains active across the surface walk from morning through nightfall.
 */
export default function LandingWorld() {
  const { size } = useThree();
  const { progress } = useJourney();
  const groupRef = useRef<THREE.Group>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const isCompact = size.width < 768;

  useFrame(() => {
    const journeyProgress = progress.get();
    const fade = landingFade(journeyProgress);
    const altitude = descentAltitude(journeyProgress);
    const high = altitude / START_ALTITUDE;
    const lighting = updateTimeOfDay(journeyProgress);

    landingUniforms.fade.value = fade;
    landingUniforms.altitude.value = high;
    landingOffset.x = GLIDE.x * high;
    landingOffset.z = GLIDE.z * high;

    if (groupRef.current) {
      groupRef.current.visible = fade > 0.001;
      groupRef.current.position.set(landingOffset.x, -altitude, landingOffset.z);
    }

    if (sunLightRef.current) {
      sunLightRef.current.intensity = lighting.sunIntensity * fade;
      sunLightRef.current.color.copy(landingUniforms.sunColor.value);
      sunLightRef.current.position.set(
        landingUniforms.sun.value.x * 100,
        landingUniforms.sun.value.y * 100,
        landingUniforms.sun.value.z * 100
      );
    }
  });

  return (
    <>
      <LandingSky />

      {/* Kept in the scene at zero intensity while hidden, so the light count
          (and compiled shaders) never change. */}
      <directionalLight
        ref={sunLightRef}
        position={[
          landingUniforms.sun.value.x * 100,
          landingUniforms.sun.value.y * 100,
          landingUniforms.sun.value.z * 100,
        ]}
        color="#fff0dc"
        intensity={0}
      />

      <group ref={groupRef} visible={false}>
        <LandingTerrain />
        <LandingRocks isCompact={isCompact} />
      </group>
    </>
  );
}

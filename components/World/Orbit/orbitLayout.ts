import type { RefObject } from "react";
import * as THREE from "three";

import {
  compactOpeningTargetShiftX,
  journeyCameraKeyframes,
} from "@/components/Journey/journeyCameraConfig";

export const PLANET_DISTANCE = 150;
// Far enough behind the planet that the visible cap is mostly night side with a
// lit crescent along the limb (a real orbital sunrise), not a washed-out half-moon.
export const SUN_DISTANCE = 320;

export interface OrbitVisibility {
  /** Reveal after the loading screen (0–1). */
  intro: number;
  /** Planet, atmosphere and sun while the opening shot is on screen. */
  scenery: number;
  /** Station dissolve (0–1). */
  station: number;
  /** Animation clock in seconds; frozen when reduced motion is requested. */
  time: number;
}

export interface OrbitLayout {
  isCompact: boolean;
  isPortrait: boolean;
  origin: THREE.Vector3;
  /** Place a point relative to the opening camera: yaw right+, pitch up+ (degrees). */
  place: (yawDegrees: number, pitchDegrees: number, distance: number) => THREE.Vector3;
  planet: {
    center: THREE.Vector3;
    radius: number;
    direction: THREE.Vector3;
    angularRadius: number;
  };
  sun: {
    position: THREE.Vector3;
    /** Unit vector from the camera toward the sun. */
    direction: THREE.Vector3;
    /** Unit vector from the planet toward the sun (the light direction). */
    lightDirection: THREE.Vector3;
    radius: number;
  };
}

export interface OrbitLayerProps {
  layout: OrbitLayout;
  visibility: RefObject<OrbitVisibility>;
}

/**
 * Stars are treated as a skybox: any star whose direction falls inside the
 * planet's cone is hidden, so none shine through the planet's disc.
 */
export const orbitStarMask = {
  direction: { value: new THREE.Vector3(0, 0, -1) },
  cosine: { value: 2 },
};

/** Station dissolve amount (1 = fully solid, 0 = gone); driven by OrbitScene. */
export const orbitDissolve = { value: 0 };

export function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

/**
 * Screen-door dissolve: lets opaque, depth-writing meshes fade out without
 * switching to (badly sorted) transparency.
 */
export function applyDissolve(
  material: THREE.Material,
  fade: { value: number }
) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uFade = fade;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uFade;")
      .replace(
        "void main() {",
        "void main() {\n  if (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) > uFade) discard;"
      );
  };
  material.customProgramCacheKey = () => "orbit-dissolve";
}

/**
 * Lays out the opening shot relative to the opening camera pose (first journey
 * keyframe, with the same compact adjustments the camera rig applies) so the
 * composition holds on landscape and portrait screens.
 */
export function createOrbitLayout(width: number, height: number): OrbitLayout {
  const isCompact = width < 768;
  const isPortrait = width / Math.max(height, 1) < 1;
  const opening = journeyCameraKeyframes[0];
  const origin = new THREE.Vector3(
    opening.position[0] * (isCompact ? 0.58 : 1),
    opening.position[1] + (isCompact ? 0.35 : 0),
    opening.position[2]
  );
  const target = new THREE.Vector3(
    opening.target[0] * (isCompact ? 0.82 : 1) +
    (isCompact ? compactOpeningTargetShiftX : 0),
    opening.target[1],
    opening.target[2]
  );
  const forward = target.sub(origin).normalize();
  const right = new THREE.Vector3()
    .crossVectors(forward, new THREE.Vector3(0, 1, 0))
    .normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();

  const direction = (yawDegrees: number, pitchDegrees: number) => {
    const yaw = THREE.MathUtils.degToRad(yawDegrees);
    const pitch = THREE.MathUtils.degToRad(pitchDegrees);

    return forward
      .clone()
      .multiplyScalar(Math.cos(pitch) * Math.cos(yaw))
      .addScaledVector(right, Math.cos(pitch) * Math.sin(yaw))
      .addScaledVector(up, Math.sin(pitch))
      .normalize();
  };
  const place = (yawDegrees: number, pitchDegrees: number, distance: number) =>
    origin.clone().addScaledVector(direction(yawDegrees, pitchDegrees), distance);

  // Planet: a huge world below, its limb sweeping across the lower screen and
  // rising toward the sunrise on the right.
  const angularRadius = THREE.MathUtils.degToRad(isPortrait ? 36 : 32);
  const planetDirection = isPortrait ? direction(6, -47) : direction(13, -40);
  const planetRadius = PLANET_DISTANCE * Math.sin(angularRadius);
  const planetCenter = origin
    .clone()
    .addScaledVector(planetDirection, PLANET_DISTANCE);

  // Sun: just above the limb, so it rises over the planet's brow.
  const screenAngle = THREE.MathUtils.degToRad(isPortrait ? 100 : 80);
  const screenAxis = right
    .clone()
    .multiplyScalar(Math.cos(screenAngle))
    .addScaledVector(up, Math.sin(screenAngle));
  const perpendicular = screenAxis
    .clone()
    .addScaledVector(planetDirection, -screenAxis.dot(planetDirection))
    .normalize();
  const sunOffset = angularRadius + THREE.MathUtils.degToRad(0.7);
  const sunDirection = planetDirection
    .clone()
    .multiplyScalar(Math.cos(sunOffset))
    .addScaledVector(perpendicular, Math.sin(sunOffset))
    .normalize();
  const sunPosition = origin.clone().addScaledVector(sunDirection, SUN_DISTANCE);

  return {
    isCompact,
    isPortrait,
    origin,
    place,
    planet: {
      center: planetCenter,
      radius: planetRadius,
      direction: planetDirection,
      angularRadius,
    },
    sun: {
      position: sunPosition,
      direction: sunDirection,
      lightDirection: sunPosition.clone().sub(planetCenter).normalize(),
      radius: SUN_DISTANCE * Math.tan(THREE.MathUtils.degToRad(1.1)),
    },
  };
}

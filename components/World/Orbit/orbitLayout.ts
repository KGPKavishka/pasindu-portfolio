import type { RefObject } from "react";
import * as THREE from "three";

import {
  type JourneyCameraKeyframe,
  type JourneyVector,
  openingCameraPose,
  spacewalkEndProgress,
} from "@/components/Journey/journeyCameraConfig";

export const PLANET_DISTANCE = 150;
// Far enough behind the planet that the visible cap is mostly night side with a
// lit crescent along the limb (a real orbital sunrise), not a washed-out half-moon.
export const SUN_DISTANCE = 320;

const X_AXIS = new THREE.Vector3(1, 0, 0);

export interface OrbitVisibility {
  /** Reveal after the loading screen (0–1). */
  intro: number;
  /** Planet, atmosphere and sun while the orbit view is on screen. */
  scenery: number;
  /** Station (truss, handrail, tether) dissolve (0–1). */
  station: number;
  /** Animation clock in seconds; frozen when reduced motion is requested. */
  time: number;
}

export interface OrbitStation {
  /** World position of the truss's near end. */
  start: THREE.Vector3;
  /** Unit vector along the truss axis, pointing away from the camera. */
  direction: THREE.Vector3;
  /** Truss-local frame: +X along the axis. */
  quaternion: THREE.Quaternion;
  length: number;
  bays: number;
  /** Half the truss cross-section. */
  half: number;
}

export interface OrbitHandrail {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  /** World position of the clip the EVA tether is hooked to. */
  anchor: THREE.Vector3;
}

export interface OrbitLayout {
  isCompact: boolean;
  isPortrait: boolean;
  origin: THREE.Vector3;
  /** Unit vector the opening camera looks along. */
  forward: THREE.Vector3;
  /** Opening camera look-at point. */
  openingTarget: THREE.Vector3;
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
  station: OrbitStation;
  handrail: OrbitHandrail;
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
 * Lays out the orbit view relative to the opening camera pose (with the same
 * compact adjustments the camera rig applies to every keyframe), so the
 * composition holds on landscape and portrait screens.
 */
export function createOrbitLayout(width: number, height: number): OrbitLayout {
  const isCompact = width < 768;
  const isPortrait = width / Math.max(height, 1) < 1;
  const origin = new THREE.Vector3(
    openingCameraPose.position[0] * (isCompact ? 0.58 : 1),
    openingCameraPose.position[1] + (isCompact ? 0.35 : 0),
    openingCameraPose.position[2]
  );
  const openingTarget = new THREE.Vector3(
    openingCameraPose.target[0] * (isCompact ? 0.82 : 1),
    openingCameraPose.target[1],
    openingCameraPose.target[2]
  );
  const forward = openingTarget.clone().sub(origin).normalize();
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

  // Station truss: enters from the upper-left corner and runs away toward the
  // upper-centre. The spacewalk slides along it.
  const bays = isCompact ? 10 : 14;
  const length = isCompact ? 16 : 22;
  const trussStart = place(isPortrait ? -22 : -42, isPortrait ? 22 : 17, 3.4);
  const trussEnd = place(
    isPortrait ? -6 : -13,
    isPortrait ? 27 : 16,
    3.4 + length
  );
  const trussDirection = trussEnd.clone().sub(trussStart).normalize();
  const trussQuaternion = new THREE.Quaternion()
    .setFromUnitVectors(X_AXIS, trussDirection)
    .multiply(new THREE.Quaternion().setFromAxisAngle(X_AXIS, 0.5));

  // EVA handrail close to the lens (lower right) with a tether clip.
  const handrailPosition = place(isPortrait ? 14 : 30, isPortrait ? -12 : -19, 2.2);
  const handrailRotation = new THREE.Euler(0.2, -0.5, 0.9);
  const handrailAnchor = new THREE.Vector3(0, 0.12, 0.05)
    .applyEuler(handrailRotation)
    .add(handrailPosition);

  return {
    isCompact,
    isPortrait,
    origin,
    forward,
    openingTarget,
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
    station: {
      start: trussStart,
      direction: trussDirection,
      quaternion: trussQuaternion,
      length,
      bays,
      half: 0.4,
    },
    handrail: {
      position: handrailPosition,
      rotation: handrailRotation,
      anchor: handrailAnchor,
    },
  };
}

const toVector = (vector: THREE.Vector3): JourneyVector => [
  vector.x,
  vector.y,
  vector.z,
];

/**
 * Camera path for the first part of the journey, in the same (already
 * compact-adjusted) space as the layout.
 *
 * The camera first holds at the opening pose, then slides along the truss
 * (translating parallel to its axis keeps the framing the layout was built
 * for), turning gradually toward the planet it is about to approach. The last
 * keyframe sits just before `handoff`, the first static keyframe.
 */
export function createSpacewalkKeyframes(
  layout: OrbitLayout,
  handoff: JourneyCameraKeyframe
): JourneyCameraKeyframe[] {
  const { origin, forward, station } = layout;
  const lookDistance = layout.openingTarget.distanceTo(origin);
  const handoffAim = new THREE.Vector3(...handoff.target)
    .sub(new THREE.Vector3(...handoff.position))
    .normalize();
  const reach = station.length * 0.55;
  const step = (
    progress: number,
    travel: number,
    turn: number,
    moment: JourneyCameraKeyframe["moment"]
  ): JourneyCameraKeyframe => {
    const position = origin
      .clone()
      .addScaledVector(station.direction, travel * reach);
    const aim = forward.clone().lerp(handoffAim, turn).normalize();

    return {
      progress,
      position: toVector(position),
      target: toVector(position.addScaledVector(aim, lookDistance)),
      moment,
    };
  };

  return [
    {
      progress: 0,
      position: toVector(origin),
      target: toVector(layout.openingTarget),
      moment: "travel",
    },
    step(0.045, 0.03, 0.01, "travel"),
    step(0.075, 0.3, 0.06, "travel"),
    step(0.105, 0.66, 0.22, "travel"),
    step(spacewalkEndProgress - 0.01, 1, 0.5, "approach"),
  ];
}

import * as THREE from "three";

import { journeyWorld } from "@/components/Journey/journeyWorldConfig";

/** Journey progress at which each part of the descent happens. */
export const descent = {
  /** Landing world fades in underneath the entry plasma. */
  worldIn: [0.196, 0.208],
  /** The approach planet is hidden from here (fully under the plasma). */
  planetHidden: 0.207,
  /** Altitude starts to fall / touchdown. */
  start: 0.196,
  touchdown: 0.25,
  /** Landing world hands over to the old city world. */
  worldOut: [0.285, 0.31],
} as const;

/** Altitude (world units) the landing plain starts at when it appears. */
export const START_ALTITUDE = 150;
export const GROUND_Y = journeyWorld.groundY;
/** Ground level the camera eye finally rests at: 1.7 above the plain. */
export const EYE_HEIGHT = 1.7;

const { clamp, smoothstep } = THREE.MathUtils;

/** Remaining time fraction (1 at the start of the descent, 0 at touchdown). */
function remaining(progress: number) {
  return 1 - clamp((progress - descent.start) / (descent.touchdown - descent.start), 0, 1);
}

/**
 * Height above the landing plain. Constant deceleration: fast during entry,
 * slowing to a hover as the retro-thrusters take over, zero at touchdown.
 */
export function descentAltitude(progress: number) {
  return START_ALTITUDE * Math.pow(remaining(progress), 2.2);
}

/** Descent speed in m/s for the lander console (arbitrary but consistent scale). */
export function descentSpeed(progress: number) {
  const left = remaining(progress);

  return 86 * Math.pow(left, 1.2);
}

export function landingFade(progress: number) {
  return (
    smoothstep(progress, descent.worldIn[0], descent.worldIn[1]) *
    (1 - smoothstep(progress, descent.worldOut[0], descent.worldOut[1]))
  );
}

/**
 * Shared uniforms: one source of truth for every landing layer (sky, ground,
 * hills, rocks, shadows). Driven once per frame by LandingWorld.
 */
export const landingUniforms = {
  fade: { value: 0 },
  /** 0 on the ground, 1 high above it. */
  altitude: { value: 1 },
  /** Direction toward the sun (unit). Morning: low, ahead and a little to the right. */
  sun: { value: new THREE.Vector3(0.38, 0.24, -0.9).normalize() },
  sunColor: { value: new THREE.Color("#fff0dc") },
  /** Dust-haze horizon colour (linear). */
  haze: { value: new THREE.Color("#c79b78") },
  zenith: { value: new THREE.Color("#5b4636") },
  /** Scene background colour, used as the fade-in target. */
  base: { value: new THREE.Color("#050505") },
};

/** Sun elevation (radians), used to size rock shadows. */
export const sunElevation = Math.asin(landingUniforms.sun.value.y);

/**
 * Where the landing world's group currently sits (it rises and glides toward
 * the lander). Written by LandingWorld; read by layers that follow the camera.
 */
export const landingOffset = { x: 0, z: 0 };

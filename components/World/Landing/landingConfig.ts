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
  /** Surface plain stays visible through the end of the journey. */
  worldOut: [1.05, 1.1],
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
  /** Distant ridge silhouette tint. */
  hillsTint: { value: new THREE.Color("#4a3629") },
  /** Intensity multiplier for the sun disc and halo in the sky shader. */
  sunGlow: { value: 1 },
};

interface TimeOfDayStop {
  readonly progress: number;
  readonly sun: readonly [number, number, number];
  readonly sunColor: THREE.Color;
  readonly haze: THREE.Color;
  readonly zenith: THREE.Color;
  readonly hillsTint: THREE.Color;
  readonly sunIntensity: number;
  readonly ambientIntensity: number;
  readonly ambientColor: THREE.Color;
  readonly sunGlow: number;
}

const TIME_OF_DAY_STOPS: readonly TimeOfDayStop[] = [
  // Morning — Landfall & Outpost Overview (0.20 - 0.34)
  {
    progress: 0.25,
    sun: [0.38, 0.24, -0.9],
    sunColor: new THREE.Color("#fff0dc"),
    haze: new THREE.Color("#c79b78"),
    zenith: new THREE.Color("#5b4636"),
    hillsTint: new THREE.Color("#4a3629"),
    sunIntensity: 3.2,
    ambientIntensity: 1.1,
    ambientColor: new THREE.Color("#d9a97f"),
    sunGlow: 1.0,
  },
  // Late Morning — Med-Lab & Logistics Depot (0.34 - 0.45)
  {
    progress: 0.4,
    sun: [0.32, 0.42, -0.85],
    sunColor: new THREE.Color("#fff4e4"),
    haze: new THREE.Color("#d2a884"),
    zenith: new THREE.Color("#6a513e"),
    hillsTint: new THREE.Color("#523c2d"),
    sunIntensity: 3.5,
    ambientIntensity: 1.2,
    ambientColor: new THREE.Color("#dfc2a4"),
    sunGlow: 1.0,
  },
  // Midday — Hangar, Greenhouse & Crew Habitat (0.45 - 0.65)
  {
    progress: 0.56,
    sun: [0.18, 0.62, -0.76],
    sunColor: new THREE.Color("#fff7eb"),
    haze: new THREE.Color("#d9b79a"),
    zenith: new THREE.Color("#785c47"),
    hillsTint: new THREE.Color("#5c4434"),
    sunIntensity: 3.8,
    ambientIntensity: 1.3,
    ambientColor: new THREE.Color("#e9e6df"),
    sunGlow: 0.95,
  },
  // Harsh Noon — Power Grid Solar Arrays (0.65 - 0.77)
  {
    progress: 0.72,
    sun: [0.06, 0.72, -0.69],
    sunColor: new THREE.Color("#fffaf0"),
    haze: new THREE.Color("#e0c1a6"),
    zenith: new THREE.Color("#82654f"),
    hillsTint: new THREE.Color("#634a39"),
    sunIntensity: 4.1,
    ambientIntensity: 1.35,
    ambientColor: new THREE.Color("#fff4e2"),
    sunGlow: 0.9,
  },
  // Warm Afternoon — Off-Shift Quarters (0.77 - 0.85)
  {
    progress: 0.81,
    sun: [-0.22, 0.34, -0.91],
    sunColor: new THREE.Color("#ffe0b5"),
    haze: new THREE.Color("#c9936b"),
    zenith: new THREE.Color("#4f3b31"),
    hillsTint: new THREE.Color("#3e2e24"),
    sunIntensity: 2.8,
    ambientIntensity: 0.95,
    ambientColor: new THREE.Color("#d49b72"),
    sunGlow: 1.05,
  },
  // Martian Blue Sunset — Ridge Observatory (0.85 - 0.92)
  // Real Martian science: fine dust scatters blue light forward around the low sun.
  {
    progress: 0.885,
    sun: [-0.3, 0.11, -0.95],
    sunColor: new THREE.Color("#bcd6f2"),
    haze: new THREE.Color("#6f8faf"),
    zenith: new THREE.Color("#3b2d28"),
    hillsTint: new THREE.Color("#292224"),
    sunIntensity: 2.2,
    ambientIntensity: 0.72,
    ambientColor: new THREE.Color("#6f8faf"),
    sunGlow: 1.15,
  },
  // Dusk — Comms Mast (0.92 - 0.98)
  {
    progress: 0.95,
    sun: [-0.34, 0.02, -0.94],
    sunColor: new THREE.Color("#8aa6c4"),
    haze: new THREE.Color("#2d3947"),
    zenith: new THREE.Color("#11151c"),
    hillsTint: new THREE.Color("#141519"),
    sunIntensity: 0.95,
    ambientIntensity: 0.42,
    ambientColor: new THREE.Color("#4a5d73"),
    sunGlow: 0.55,
  },
  // Night — Log End (0.98 - 1.0)
  {
    progress: 0.995,
    sun: [-0.36, -0.14, -0.92],
    sunColor: new THREE.Color("#3a4b5e"),
    haze: new THREE.Color("#0e1217"),
    zenith: new THREE.Color("#050505"),
    hillsTint: new THREE.Color("#08090c"),
    sunIntensity: 0.22,
    ambientIntensity: 0.24,
    ambientColor: new THREE.Color("#25303d"),
    sunGlow: 0.12,
  },
];

const scratchSun = new THREE.Vector3();
const scratchEndSun = new THREE.Vector3();

export interface TimeOfDayLighting {
  sunIntensity: number;
  ambientIntensity: number;
  ambientColor: THREE.Color;
}

const currentLighting: TimeOfDayLighting = {
  sunIntensity: 3.2,
  ambientIntensity: 1.1,
  ambientColor: new THREE.Color("#d9a97f"),
};

/**
 * Updates `landingUniforms` for the current journey progress and returns the
 * matching directional/ambient light intensities for `LandingWorld` and
 * `JourneyAtmosphere`.
 */
export function updateTimeOfDay(progress: number): TimeOfDayLighting {
  const first = TIME_OF_DAY_STOPS[0];
  const last = TIME_OF_DAY_STOPS[TIME_OF_DAY_STOPS.length - 1];

  if (progress <= first.progress) {
    landingUniforms.sun.value.set(...first.sun).normalize();
    landingUniforms.sunColor.value.copy(first.sunColor);
    landingUniforms.haze.value.copy(first.haze);
    landingUniforms.zenith.value.copy(first.zenith);
    landingUniforms.hillsTint.value.copy(first.hillsTint);
    landingUniforms.sunGlow.value = first.sunGlow;
    currentLighting.sunIntensity = first.sunIntensity;
    currentLighting.ambientIntensity = first.ambientIntensity;
    currentLighting.ambientColor.copy(first.ambientColor);
    return currentLighting;
  }

  let endIndex = TIME_OF_DAY_STOPS.findIndex((stop) => stop.progress >= progress);
  if (endIndex === -1) endIndex = TIME_OF_DAY_STOPS.length - 1;
  const startIndex = Math.max(0, endIndex - 1);
  const start = TIME_OF_DAY_STOPS[startIndex];
  const end = TIME_OF_DAY_STOPS[endIndex] ?? last;
  const span = end.progress - start.progress;
  const t = span <= 0 ? 1 : smoothstep(progress, start.progress, end.progress);

  scratchSun.set(...start.sun);
  scratchEndSun.set(...end.sun);
  landingUniforms.sun.value.copy(scratchSun).lerp(scratchEndSun, t).normalize();
  landingUniforms.sunColor.value.copy(start.sunColor).lerp(end.sunColor, t);
  landingUniforms.haze.value.copy(start.haze).lerp(end.haze, t);
  landingUniforms.zenith.value.copy(start.zenith).lerp(end.zenith, t);
  landingUniforms.hillsTint.value.copy(start.hillsTint).lerp(end.hillsTint, t);
  landingUniforms.sunGlow.value = THREE.MathUtils.lerp(start.sunGlow, end.sunGlow, t);

  currentLighting.sunIntensity = THREE.MathUtils.lerp(start.sunIntensity, end.sunIntensity, t);
  currentLighting.ambientIntensity = THREE.MathUtils.lerp(
    start.ambientIntensity,
    end.ambientIntensity,
    t
  );
  currentLighting.ambientColor.copy(start.ambientColor).lerp(end.ambientColor, t);

  return currentLighting;
}

/** Sun elevation (radians), used to size rock shadows. */
export const sunElevation = Math.asin(landingUniforms.sun.value.y);

/**
 * Where the landing world's group currently sits (it rises and glides toward
 * the lander). Written by LandingWorld; read by layers that follow the camera.
 */
export const landingOffset = { x: 0, z: 0 };

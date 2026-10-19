import type { RefObject } from "react";
import * as THREE from "three";

import {
  compactOpeningTargetShiftX,
  journeyCameraKeyframes,
} from "@/components/Journey/journeyCameraConfig";
import { journeyWorld } from "@/components/Journey/journeyWorldConfig";

export interface GatewayVisibility {
  intro: number;
  galaxy: number;
  comet: number;
  debris: number;
  backdrop: number;
  /** Animation clock in seconds; frozen when reduced motion is requested. */
  time: number;
  /** View distance the deep background is depth-pinned to (just behind the planet). */
  pinDistance: number;
}

export interface GatewayAsteroid {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  rotation: THREE.Euler;
  spin: THREE.Vector3;
  seed: number;
}

export interface OrbitalGatewayLayout {
  isCompact: boolean;
  origin: THREE.Vector3;
  planet: {
    center: THREE.Vector3;
    radius: number;
  };
  galaxy: {
    position: THREE.Vector3;
    direction: THREE.Vector3;
    radius: number;
    diskQuaternion: THREE.Quaternion;
    haloQuaternion: THREE.Quaternion;
  };
  comet: {
    /** Quadratic Bézier control points of the slow trajectory. */
    path: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
    headWidth: number;
    /** Tail length as a fraction of the trajectory. */
    tailLength: number;
  };
  asteroids: GatewayAsteroid[];
  dust: {
    positions: Float32Array;
    colors: Float32Array;
    size: number;
  };
}

export interface GatewayLayerProps {
  layout: OrbitalGatewayLayout;
  visibility: RefObject<GatewayVisibility>;
}

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const GALAXY_DISTANCE = 160;
const COMET_DISTANCE = 120;

/**
 * The quasar and comet sit far behind the planet, but the fully fogged city
 * further down the route would block them. Their depth is therefore pinned to
 * just behind the planet: the planet (and moon) still eclipse them, while the
 * distant, invisible city geometry cannot.
 */
export const pinDepthChunk = /* glsl */ `
  uniform float uPinDistance;

  vec4 pinDepth(vec4 clipPosition) {
    float viewZ = -uPinDistance;
    float ndcZ = (projectionMatrix[2][2] * viewZ + projectionMatrix[3][2]) / -viewZ;

    clipPosition.z = ndcZ * clipPosition.w;
    return clipPosition;
  }
`;

export function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

/**
 * Places every Orbital Gateway element relative to the opening camera pose
 * (first journey keyframe, with the same compact adjustments the camera rig
 * applies) so the composition holds on landscape and portrait screens.
 */
export function createOrbitalGatewayLayout(
  width: number,
  height: number
): OrbitalGatewayLayout {
  const isCompact = width < 768;
  const aspect = width / Math.max(height, 1);
  const isPortrait = aspect < 1;
  const verticalHalf = THREE.MathUtils.degToRad((isCompact ? 56 : 50) / 2);
  const horizontalHalf = Math.atan(Math.tan(verticalHalf) * aspect);
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
  const right = new THREE.Vector3().crossVectors(forward, WORLD_UP).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward).normalize();

  // yaw/pitch are fractions of the horizontal/vertical half field of view.
  const direction = (yaw: number, pitch: number) => {
    const yawAngle = yaw * horizontalHalf;
    const pitchAngle = pitch * verticalHalf;

    return forward
      .clone()
      .multiplyScalar(Math.cos(pitchAngle) * Math.cos(yawAngle))
      .addScaledVector(right, Math.cos(pitchAngle) * Math.sin(yawAngle))
      .addScaledVector(up, Math.sin(pitchAngle))
      .normalize();
  };
  const place = (yaw: number, pitch: number, distance: number) =>
    origin.clone().addScaledVector(direction(yaw, pitch), distance);

  const planetCenter = new THREE.Vector3(...journeyWorld.planet);
  const planetOffset = planetCenter.clone().sub(origin);
  const planetDirection = planetOffset.clone().normalize();
  const planetAngularRadius = Math.asin(
    journeyWorld.planetRadius / planetOffset.length()
  );

  // Quasar core sits on the planet's limb (upper-right on landscape, top-left
  // on portrait where the right side is off-screen) so the planet eclipses it.
  const limbAngle = THREE.MathUtils.degToRad(isPortrait ? 118 : 36);
  const limbOffset = right
    .clone()
    .multiplyScalar(Math.cos(limbAngle))
    .addScaledVector(up, Math.sin(limbAngle))
    .multiplyScalar(Math.tan(planetAngularRadius * 1.02));
  const galaxyDirection = planetDirection.clone().add(limbOffset).normalize();
  const galaxyAngularRadius = isPortrait
    ? horizontalHalf * 0.78
    : Math.min(horizontalHalf * 0.42, verticalHalf * 0.75);
  const galaxyPosition = origin
    .clone()
    .addScaledVector(galaxyDirection, GALAXY_DISTANCE);
  const orientation = new THREE.Object3D();

  orientation.position.copy(galaxyPosition);
  orientation.lookAt(origin);
  const haloQuaternion = orientation.quaternion.clone();
  orientation.rotateZ(0.34);
  orientation.rotateX(-1.12);
  const diskQuaternion = orientation.quaternion.clone();

  // Slow arc from the upper-left that ends behind the planet.
  const cometPath: [THREE.Vector3, THREE.Vector3, THREE.Vector3] = isPortrait
    ? [
      place(-1.3, 0.62, COMET_DISTANCE),
      place(-0.35, 0.5, COMET_DISTANCE),
      origin.clone().addScaledVector(planetDirection, COMET_DISTANCE),
    ]
    : [
      place(-1.2, 0.98, COMET_DISTANCE),
      place(-0.25, 0.72, COMET_DISTANCE),
      origin.clone().addScaledVector(planetDirection, COMET_DISTANCE),
    ];
  const cometHeadWidth = COMET_DISTANCE * 0.0042;

  const asteroidSlots = isCompact
    ? [
      [0.92, 0.86, 9, 0.7],
      [0.92, -0.4, 8, 0.75],
      [-0.95, 0.4, 11, 0.35],
    ]
    : [
      [0.96, 0.84, 8, 0.85],
      [0.9, -0.9, 7, 1.0],
      [-1.0, 0.2, 9, 0.7],
      [0.32, -0.62, 13, 0.32],
      [-0.5, 0.72, 15, 0.36],
    ];
  const asteroids = asteroidSlots.map(([yaw, pitch, distance, size], index) => {
    const seed = index * 7.31 + 3.7;

    return {
      position: place(yaw, pitch, distance),
      scale: new THREE.Vector3(
        size * (1.05 + seededRandom(seed) * 0.35),
        size * (0.7 + seededRandom(seed + 1) * 0.25),
        size * (0.85 + seededRandom(seed + 2) * 0.3)
      ),
      rotation: new THREE.Euler(
        seededRandom(seed + 3) * Math.PI,
        seededRandom(seed + 4) * Math.PI,
        seededRandom(seed + 5) * Math.PI
      ),
      spin: new THREE.Vector3(
        (seededRandom(seed + 6) - 0.5) * 0.12,
        (seededRandom(seed + 7) - 0.5) * 0.16,
        (seededRandom(seed + 8) - 0.5) * 0.08
      ),
      seed,
    };
  });

  const dustCount = isCompact ? 20 : 46;
  const dustPositions = new Float32Array(dustCount * 3);
  const dustColors = new Float32Array(dustCount * 3);

  for (let index = 0; index < dustCount; index += 1) {
    const seed = index * 3.17 + 101;
    const point = place(
      (seededRandom(seed) - 0.5) * 2.3,
      (seededRandom(seed + 1) - 0.5) * 2.2,
      2.2 + seededRandom(seed + 2) * 9
    );
    const warm = seededRandom(seed + 3) < 0.6;
    const intensity = 0.08 + seededRandom(seed + 4) * 0.14;

    dustPositions.set([point.x, point.y, point.z], index * 3);
    dustColors.set(
      warm
        ? [1 * intensity, 0.68 * intensity, 0.3 * intensity]
        : [0.4 * intensity, 0.88 * intensity, 1 * intensity],
      index * 3
    );
  }

  return {
    isCompact,
    origin,
    planet: {
      center: planetCenter,
      radius: journeyWorld.planetRadius,
    },
    galaxy: {
      position: galaxyPosition,
      direction: galaxyDirection,
      radius: GALAXY_DISTANCE * Math.tan(galaxyAngularRadius),
      diskQuaternion,
      haloQuaternion,
    },
    comet: {
      path: cometPath,
      headWidth: cometHeadWidth,
      tailLength: 0.075,
    },
    asteroids,
    dust: {
      positions: dustPositions,
      colors: dustColors,
      size: isCompact ? 0.26 : 0.32,
    },
  };
}

let softGlowTexture: THREE.CanvasTexture | null = null;

/** Shared radial sprite used for glows, comet particles and bokeh dust. */
export function getSoftGlowTexture() {
  if (softGlowTexture) return softGlowTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d");

  if (context) {
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.22, "rgba(255,255,255,0.6)");
    gradient.addColorStop(0.55, "rgba(255,255,255,0.14)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
  }

  softGlowTexture = new THREE.CanvasTexture(canvas);
  softGlowTexture.colorSpace = THREE.SRGBColorSpace;

  return softGlowTexture;
}

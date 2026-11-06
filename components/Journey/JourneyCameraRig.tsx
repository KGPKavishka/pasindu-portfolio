"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { createOrbitLayout, createSpacewalkKeyframes } from "@/components/World/Orbit/orbitLayout";
import { useJourney } from "./JourneyController";
import {
  type JourneyCameraKeyframe,
  type JourneyVector,
  journeyCameraKeyframes,
} from "./journeyCameraConfig";
import { useJourneyPointer } from "./journeyPointer";

function interpolateCoordinate(
  previous: number,
  start: number,
  end: number,
  next: number,
  amount: number
) {
  const amountSquared = amount * amount;
  const amountCubed = amountSquared * amount;
  const startTangent = (end - previous) * 0.5;
  const endTangent = (next - start) * 0.5;

  return (
    (2 * start - 2 * end + startTangent + endTangent) * amountCubed +
    (-3 * start + 3 * end - 2 * startTangent - endTangent) * amountSquared +
    startTangent * amount +
    start
  );
}

function interpolateVector(
  previous: JourneyVector,
  start: JourneyVector,
  end: JourneyVector,
  next: JourneyVector,
  amount: number,
  output: THREE.Vector3
) {
  output.set(
    interpolateCoordinate(previous[0], start[0], end[0], next[0], amount),
    interpolateCoordinate(previous[1], start[1], end[1], next[1], amount),
    interpolateCoordinate(previous[2], start[2], end[2], next[2], amount)
  );
}

// Narrow screens pull the path toward the centre line; step back on surface
// structure stops so portrait viewports frame the full building above the callout.
function adjustForCompact(keyframe: JourneyCameraKeyframe): JourneyCameraKeyframe {
  const isSurface = keyframe.progress >= 0.25;
  const isOutpostStop = keyframe.progress >= 0.32 && keyframe.progress < 0.98;

  return {
    ...keyframe,
    position: [
      keyframe.position[0] * 0.58,
      keyframe.position[1] + (isSurface ? 0 : 0.35),
      keyframe.position[2] + (isOutpostStop ? 5.2 : 0),
    ],
    target: [
      keyframe.target[0] * 0.82,
      keyframe.target[1] + (isOutpostStop ? -0.45 : 0),
      keyframe.target[2],
    ],
  };
}

const { smoothstep } = THREE.MathUtils;

// High-frequency noise from a few incommensurate sines (cheap, no allocation).
function shakeNoise(time: number, channel: number) {
  return (
    Math.sin(time * 17.3 + channel * 1.7) +
    Math.sin(time * 29.1 + channel * 3.1) * 0.6 +
    Math.sin(time * 47.7 + channel * 5.3) * 0.3
  ) / 1.9;
}

/**
 * Cabin vibration from atmospheric entry until touchdown. It always rumbles a
 * little while the lander is falling, and grows with how fast the visitor is
 * scrolling (the lander shakes harder the faster it descends).
 */
function getRumble(progress: number, scrollSpeed: number) {
  const envelope =
    smoothstep(progress, 0.172, 0.195) *
    (1 - 0.7 * smoothstep(progress, 0.205, 0.235)) *
    (1 - smoothstep(progress, 0.244, 0.25));

  return envelope * (0.4 + 0.6 * THREE.MathUtils.clamp(scrollSpeed * 5, 0, 1));
}

/** Damped bounce of the touchdown: one firm thump, then still. */
function getTouchdownThud(progress: number) {
  const since = progress - 0.248;

  if (since <= 0 || since > 0.02) return 0;

  return -0.07 * Math.exp(-since / 0.0045) * Math.sin(since / 0.0016);
}

export default function JourneyCameraRig() {
  const { camera, size } = useThree();
  const { progress, velocity } = useJourney();
  const reduceMotion = useReducedMotion();
  const pointer = useJourneyPointer();
  const cameraRef = useRef(camera);
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3(0, 0, -24));
  const lookTarget = useRef(new THREE.Vector3(0, 0, -24));
  const smoothedPosition = useRef(new THREE.Vector3());
  const shakeOffset = useRef(new THREE.Vector3());
  const isPlaced = useRef(false);
  const segmentIndex = useRef(0);
  const isCompact = size.width < 768;

  // Spacewalk keyframes follow the station truss, which is laid out per screen
  // shape; everything after the handoff is static.
  const keyframes = useMemo(() => {
    const staticFrames = isCompact
      ? journeyCameraKeyframes.map(adjustForCompact)
      : [...journeyCameraKeyframes];
    const layout = createOrbitLayout(size.width, size.height);

    return [...createSpacewalkKeyframes(layout, staticFrames[0]), ...staticFrames];
  }, [isCompact, size.width, size.height]);

  useEffect(() => {
    const activeCamera = cameraRef.current;

    if (!(activeCamera instanceof THREE.PerspectiveCamera)) return;

    activeCamera.fov = isCompact ? 56 : 50;
    activeCamera.updateProjectionMatrix();
  }, [isCompact]);

  useFrame(({ clock }, delta) => {
    const journeyProgress = progress.get();
    const time = clock.getElapsedTime();
    const finalIndex = keyframes.length - 1;

    segmentIndex.current = Math.min(segmentIndex.current, finalIndex);

    while (
      segmentIndex.current < finalIndex - 1 &&
      journeyProgress > keyframes[segmentIndex.current + 1].progress
    ) {
      segmentIndex.current += 1;
    }

    while (
      segmentIndex.current > 0 &&
      journeyProgress < keyframes[segmentIndex.current].progress
    ) {
      segmentIndex.current -= 1;
    }

    const startIndex = segmentIndex.current;
    const resolvedEndIndex = Math.min(startIndex + 1, finalIndex);
    const start = keyframes[startIndex];
    const end = keyframes[resolvedEndIndex];
    const previous = keyframes[Math.max(0, startIndex - 1)];
    const next = keyframes[Math.min(finalIndex, resolvedEndIndex + 1)];
    const segmentDuration = end.progress - start.progress;
    const segmentProgress =
      segmentDuration <= 0
        ? 1
        : THREE.MathUtils.clamp(
            (journeyProgress - start.progress) / segmentDuration,
            0,
            1
          );
    const reducedDelta = Math.min(delta, 0.05);

    interpolateVector(
      previous.position,
      start.position,
      end.position,
      next.position,
      segmentProgress,
      desiredPosition.current
    );
    interpolateVector(
      previous.target,
      start.target,
      end.target,
      next.target,
      segmentProgress,
      desiredTarget.current
    );
    desiredPosition.current.y += reduceMotion ? 0 : Math.sin(time * 0.12) * 0.05;

    // EVA presence: a free-floating body never holds perfectly still. Strongest
    // in orbit and the spacewalk, gone once the descent begins.
    const eva = reduceMotion ? 0 : 1 - smoothstep(journeyProgress, 0.15, 0.19);
    // Surface walk: once boots are on the ground and the hatch opens, walking
    // cadence and subtle head-look resume.
    const surfaceWalk = reduceMotion ? 0 : smoothstep(journeyProgress, 0.275, 0.295);

    if (eva > 0) {
      desiredPosition.current.x += Math.sin(time * 0.09) * 0.05 * eva;
    }

    if (surfaceWalk > 0) {
      // Walking head-bob: driven by distance along -z so footsteps match travel
      // and naturally settle when dwelling at a structure.
      const isFocusDwell =
        start.moment === "focus" && Math.abs(segmentProgress - 0.5) < 0.35;
      const dwellDamp = isFocusDwell ? 0.3 : 1;
      const scrollBoost = THREE.MathUtils.clamp(Math.abs(velocity.get()) * 6, 0.22, 1);
      const stepPhase = desiredPosition.current.z * 1.35 + time * 1.1;
      const bobAmplitude = 0.038 * surfaceWalk * dwellDamp * scrollBoost;

      desiredPosition.current.y += Math.abs(Math.sin(stepPhase)) * bobAmplitude;
      desiredPosition.current.x += Math.cos(stepPhase * 0.5) * bobAmplitude * 0.45;
    }

    // Head-look: in orbit it translates the camera slightly; on the surface it
    // turns the astronaut's head toward the pointer.
    const orbitLook = reduceMotion
      ? 0
      : 1 - smoothstep(journeyProgress, 0.12, 0.16);

    if (orbitLook > 0) {
      const offsetX = pointer.x * 0.42 * orbitLook;
      const offsetY = pointer.y * 0.24 * orbitLook;

      desiredPosition.current.x += offsetX;
      desiredPosition.current.y += offsetY;
      desiredTarget.current.x += offsetX;
      desiredTarget.current.y += offsetY;
    }

    if (surfaceWalk > 0) {
      desiredTarget.current.x += pointer.x * 1.15 * surfaceWalk;
      desiredTarget.current.y += pointer.y * 0.55 * surfaceWalk;
    }

    // The smoothed path is kept apart from the shake, so the smoothing never
    // filters the rumble away.
    if (!isPlaced.current) {
      smoothedPosition.current.copy(camera.position);
      isPlaced.current = true;
    }

    const posLerpRate = reduceMotion ? 10 : isCompact ? 3.8 : 3.4;
    const lookLerpRate = reduceMotion ? 10 : journeyProgress >= 0.25 ? 4.8 : 3.2;

    smoothedPosition.current.lerp(
      desiredPosition.current,
      1 - Math.exp(-posLerpRate * reducedDelta)
    );
    lookTarget.current.lerp(
      desiredTarget.current,
      1 - Math.exp(-lookLerpRate * reducedDelta)
    );

    const rumble = reduceMotion
      ? 0
      : getRumble(journeyProgress, Math.abs(velocity.get()));
    const thud = reduceMotion ? 0 : getTouchdownThud(journeyProgress);

    camera.position.copy(smoothedPosition.current);

    if (rumble > 0 || thud !== 0) {
      camera.position.add(
        shakeOffset.current.set(
          shakeNoise(time, 0) * 0.06 * rumble,
          shakeNoise(time, 1) * 0.05 * rumble + thud,
          shakeNoise(time, 2) * 0.03 * rumble
        )
      );
    }

    camera.lookAt(lookTarget.current);

    if (rumble > 0) {
      camera.rotateZ(shakeNoise(time, 3) * 0.007 * rumble);
      camera.rotateX(shakeNoise(time, 4) * 0.004 * rumble);
      camera.rotateY(shakeNoise(time, 5) * 0.004 * rumble);
    }

    if (eva > 0) {
      // Slow drift in roll (~0.7°) and a faint breathing nod (~0.2°, ~4 s).
      camera.rotateZ(
        (Math.sin(time * 0.21) * 0.012 + Math.sin(time * 0.53 + 1.3) * 0.004) * eva
      );
      camera.rotateX(Math.sin(time * 1.5) * 0.0035 * eva);
    }
  });

  return null;
}

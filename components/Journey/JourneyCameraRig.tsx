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

// Narrow screens pull the path toward the centre line and lift it slightly.
function adjustForCompact(keyframe: JourneyCameraKeyframe): JourneyCameraKeyframe {
  return {
    ...keyframe,
    position: [keyframe.position[0] * 0.58, keyframe.position[1] + 0.35, keyframe.position[2]],
    target: [keyframe.target[0] * 0.82, keyframe.target[1], keyframe.target[2]],
  };
}

const { smoothstep } = THREE.MathUtils;

export default function JourneyCameraRig() {
  const { camera, size } = useThree();
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const pointer = useJourneyPointer();
  const cameraRef = useRef(camera);
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3(0, 0, -24));
  const lookTarget = useRef(new THREE.Vector3(0, 0, -24));
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

    if (eva > 0) {
      desiredPosition.current.x += Math.sin(time * 0.09) * 0.05 * eva;
    }

    // Head-look: translating the camera makes near objects swing against the
    // pointer while distant stars barely move.
    const headLook = reduceMotion
      ? 0
      : 1 - smoothstep(journeyProgress, 0.12, 0.16);

    if (headLook > 0) {
      const offsetX = pointer.x * 0.42 * headLook;
      const offsetY = pointer.y * 0.24 * headLook;

      desiredPosition.current.x += offsetX;
      desiredPosition.current.y += offsetY;
      desiredTarget.current.x += offsetX;
      desiredTarget.current.y += offsetY;
    }

    camera.position.lerp(
      desiredPosition.current,
      1 - Math.exp(-(reduceMotion ? 10 : isCompact ? 3.6 : 3) * reducedDelta)
    );
    lookTarget.current.lerp(
      desiredTarget.current,
      1 - Math.exp(-3.2 * reducedDelta)
    );
    camera.lookAt(lookTarget.current);

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

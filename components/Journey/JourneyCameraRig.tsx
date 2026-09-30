"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "./JourneyController";
import { JourneyVector, journeyCameraKeyframes } from "./journeyCameraConfig";

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

export default function JourneyCameraRig() {
  const { camera, size } = useThree();
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const cameraRef = useRef(camera);
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3(0, 0, -24));
  const lookTarget = useRef(new THREE.Vector3(0, 0, -24));
  const segmentIndex = useRef(0);

  useEffect(() => {
    const activeCamera = cameraRef.current;

    if (!(activeCamera instanceof THREE.PerspectiveCamera)) return;

    activeCamera.fov = size.width < 768 ? 56 : 50;
    activeCamera.updateProjectionMatrix();
  }, [size.width]);

  useFrame(({ clock }, delta) => {
    const journeyProgress = progress.get();
    const finalIndex = journeyCameraKeyframes.length - 1;

    while (
      segmentIndex.current < finalIndex - 1 &&
      journeyProgress > journeyCameraKeyframes[segmentIndex.current + 1].progress
    ) {
      segmentIndex.current += 1;
    }

    while (
      segmentIndex.current > 0 &&
      journeyProgress < journeyCameraKeyframes[segmentIndex.current].progress
    ) {
      segmentIndex.current -= 1;
    }

    const startIndex = segmentIndex.current;
    const resolvedEndIndex = Math.min(startIndex + 1, finalIndex);
    const start = journeyCameraKeyframes[startIndex];
    const end = journeyCameraKeyframes[resolvedEndIndex];
    const previous = journeyCameraKeyframes[Math.max(0, startIndex - 1)];
    const next = journeyCameraKeyframes[Math.min(finalIndex, resolvedEndIndex + 1)];
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
    const isCompact = size.width < 768;
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
    desiredPosition.current.x *= isCompact ? 0.58 : 1;
    desiredPosition.current.y +=
      (isCompact ? 0.35 : 0) +
      (reduceMotion ? 0 : Math.sin(clock.getElapsedTime() * 0.12) * 0.05);
    desiredTarget.current.x *= isCompact ? 0.82 : 1;

    camera.position.lerp(
      desiredPosition.current,
      1 - Math.exp(-(reduceMotion ? 10 : isCompact ? 3.6 : 3) * reducedDelta)
    );
    lookTarget.current.lerp(
      desiredTarget.current,
      1 - Math.exp(-3.2 * reducedDelta)
    );
    camera.lookAt(lookTarget.current);
  });

  return null;
}
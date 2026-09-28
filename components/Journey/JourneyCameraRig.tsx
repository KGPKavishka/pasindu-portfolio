"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useRef } from "react";
import * as THREE from "three";

import { useJourney } from "./JourneyController";
import { journeyCameraKeyframes } from "./journeyCameraConfig";

export default function JourneyCameraRig() {
  const { camera } = useThree();
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredTarget = useRef(new THREE.Vector3(0, 0, -24));
  const lookTarget = useRef(new THREE.Vector3(0, 0, -24));

  useFrame(({ clock }, delta) => {
    const journeyProgress = progress.get();
    const endIndex = journeyCameraKeyframes.findIndex(
      (keyframe) => keyframe.progress >= journeyProgress
    );
    const resolvedEndIndex =
      endIndex === -1 ? journeyCameraKeyframes.length - 1 : endIndex;
    const startIndex = Math.max(0, resolvedEndIndex - 1);
    const start = journeyCameraKeyframes[startIndex];
    const end = journeyCameraKeyframes[resolvedEndIndex];
    const segmentProgress =
      start === end
        ? 1
        : THREE.MathUtils.smoothstep(
            journeyProgress,
            start.progress,
            end.progress
          );
    const reducedDelta = Math.min(delta, 0.05);

    desiredPosition.current.set(
      THREE.MathUtils.lerp(start.position[0], end.position[0], segmentProgress),
      THREE.MathUtils.lerp(start.position[1], end.position[1], segmentProgress) +
        (reduceMotion ? 0 : Math.sin(clock.getElapsedTime() * 0.12) * 0.05),
      THREE.MathUtils.lerp(start.position[2], end.position[2], segmentProgress)
    );
    desiredTarget.current.set(
      THREE.MathUtils.lerp(start.target[0], end.target[0], segmentProgress),
      THREE.MathUtils.lerp(start.target[1], end.target[1], segmentProgress),
      THREE.MathUtils.lerp(start.target[2], end.target[2], segmentProgress)
    );

    camera.position.lerp(
      desiredPosition.current,
      1 - Math.exp(-(reduceMotion ? 10 : 2.8) * reducedDelta)
    );
    lookTarget.current.lerp(
      desiredTarget.current,
      1 - Math.exp(-3.2 * reducedDelta)
    );
    camera.lookAt(lookTarget.current);
  });

  return null;
}
"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactNode } from "react";
import type * as THREE from "three";

import { useJourney } from "./JourneyController";

interface WorldGateProps {
  /** Journey progress (0–1) at which the wrapped world starts rendering. */
  from: number;
  children: ReactNode;
}

/**
 * Keeps a part of the world out of the render until the journey reaches it.
 * Hidden objects are skipped by the renderer, so the opening shot only pays
 * for what is on screen (and distant city geometry cannot show through the
 * planet and stars of the orbit view).
 */
export default function WorldGate({ from, children }: WorldGateProps) {
  const { progress } = useJourney();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.visible = progress.get() >= from;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {children}
    </group>
  );
}

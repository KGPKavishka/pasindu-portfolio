"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { scrollState } from "./ScrollController";

export default function Atmosphere() {
  const { scene } = useThree();
  const sceneRef = useRef(scene);
  const colors = useMemo(
    () => ({
      space: new THREE.Color("#020711"),
      city: new THREE.Color("#03151e"),
      creative: new THREE.Color("#16091d"),
      future: new THREE.Color("#0b0a1c"),
    }),
    [],
  );
  const color = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const activeScene = sceneRef.current;
    activeScene.fog = new THREE.FogExp2("#020711", 0.012);

    return () => {
      activeScene.fog = null;
    };
  }, []);

  useFrame(() => {
    const scroll = scrollState.current;
    const cityProgress = THREE.MathUtils.smoothstep(scroll, 0.28, 0.55);
    const creativeProgress = THREE.MathUtils.smoothstep(scroll, 0.7, 0.82);
    const futureProgress = THREE.MathUtils.smoothstep(scroll, 0.84, 0.96);

    color.copy(colors.space).lerp(colors.city, cityProgress);
    color.lerp(colors.creative, creativeProgress);
    color.lerp(colors.future, futureProgress);
    sceneRef.current.background = color;

    if (sceneRef.current.fog instanceof THREE.FogExp2) {
      sceneRef.current.fog.color.copy(color);
      sceneRef.current.fog.density = THREE.MathUtils.lerp(
        0.012,
        0.025,
        cityProgress,
      );
    }
  });

  return (
    <>
      {/* Distant cyan nebula */}
      <mesh position={[-35, 15, -70]}>
        <sphereGeometry args={[18, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.035}
          depthWrite={false}
        />
      </mesh>

      {/* Distant violet nebula */}
      <mesh position={[40, -10, -90]}>
        <sphereGeometry args={[25, 32, 32]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.03}
          depthWrite={false}
        />
      </mesh>

      {/* Distant blue nebula */}
      <mesh position={[0, 30, -120]}>
        <sphereGeometry args={[45, 32, 32]} />
        <meshBasicMaterial
          color="#1d4ed8"
          transparent
          opacity={0.02}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

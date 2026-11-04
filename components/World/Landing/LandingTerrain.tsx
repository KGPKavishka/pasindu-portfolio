"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  GROUND_Y,
  landingOffset,
  landingUniforms,
} from "./landingConfig";
import {
  getGroundMap,
  groundFragmentShader,
  groundVertexShader,
  hillsFragmentShader,
  hillsVertexShader,
  skyFragmentShader,
  skyVertexShader,
} from "./landingShaders";
import { seededRandom } from "@/components/World/Orbit/orbitLayout";

const GROUND_RADIUS = 950;

/** Open ring of distant ridges; its top edge follows a sum of sines. */
function createHillsGeometry(radius: number, amplitude: number, seed: number) {
  const segments = 220;
  const positions = new Float32Array((segments + 1) * 2 * 3);
  const tops = new Float32Array((segments + 1) * 2);
  const indices: number[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const ridge =
      0.5 +
      0.28 * Math.sin(angle * 3 + seed) +
      0.17 * Math.sin(angle * 7 + seed * 2.1) +
      0.1 * Math.sin(angle * 17 + seed * 3.7) +
      0.06 * (seededRandom(index * 0.37 + seed) - 0.5);
    const height = Math.max(0.05, ridge) * amplitude;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const base = index * 2;

    positions.set([x, -6, z], base * 3);
    positions.set([x, height, z], (base + 1) * 3);
    tops[base] = 0;
    tops[base + 1] = 1;

    if (index < segments) {
      indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aTop", new THREE.BufferAttribute(tops, 1));
  geometry.setIndex(indices);

  return geometry;
}

/** The plain, with two rings of distant ridges that always stay on the horizon. */
export function LandingTerrain() {
  const gl = useThree((state) => state.gl);
  const nearHillsRef = useRef<THREE.Mesh>(null);
  const farHillsRef = useRef<THREE.Mesh>(null);
  const map = useMemo(() => getGroundMap(gl), [gl]);

  const groundUniforms = useMemo(
    () => ({
      uMap: { value: map },
      uSun: landingUniforms.sun,
      uSunColor: landingUniforms.sunColor,
      uHaze: landingUniforms.haze,
      uZenith: landingUniforms.zenith,
      uFade: landingUniforms.fade,
      uMacro: { value: 12.5 },
      uDetail: { value: 4.8 },
    }),
    [map]
  );
  const hillsUniforms = useMemo(
    () => ({
      uHaze: landingUniforms.haze,
      uSun: landingUniforms.sun,
      uSunColor: landingUniforms.sunColor,
      uFade: landingUniforms.fade,
      uTint: { value: new THREE.Color("#4a3629") },
    }),
    []
  );
  const nearHills = useMemo(() => createHillsGeometry(640, 46, 1.3), []);
  const farHills = useMemo(() => createHillsGeometry(900, 90, 4.6), []);

  useEffect(() => () => nearHills.dispose(), [nearHills]);
  useEffect(() => () => farHills.dispose(), [farHills]);

  useFrame(({ camera }) => {
    for (const hills of [nearHillsRef.current, farHillsRef.current]) {
      hills?.position.set(
        camera.position.x - landingOffset.x,
        GROUND_Y,
        camera.position.z - landingOffset.z
      );
    }
  });

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]} renderOrder={1}>
        <circleGeometry args={[GROUND_RADIUS, 72]} />
        <shaderMaterial
          uniforms={groundUniforms}
          vertexShader={groundVertexShader}
          fragmentShader={groundFragmentShader}
          transparent
        />
      </mesh>

      <mesh ref={farHillsRef} geometry={farHills} renderOrder={1} frustumCulled={false}>
        <shaderMaterial
          uniforms={hillsUniforms}
          vertexShader={hillsVertexShader}
          fragmentShader={hillsFragmentShader}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      <mesh ref={nearHillsRef} geometry={nearHills} renderOrder={1} frustumCulled={false}>
        <shaderMaterial
          uniforms={hillsUniforms}
          vertexShader={hillsVertexShader}
          fragmentShader={hillsFragmentShader}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </>
  );
}

/** Camera-following sky dome; drawn first so everything else covers it. */
export function LandingSky() {
  const meshRef = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uSun: landingUniforms.sun,
      uSunColor: landingUniforms.sunColor,
      uHaze: landingUniforms.haze,
      uZenith: landingUniforms.zenith,
      uBase: landingUniforms.base,
      uAltitude: landingUniforms.altitude,
      uFade: landingUniforms.fade,
    }),
    []
  );

  useFrame(({ camera, scene }) => {
    const mesh = meshRef.current;

    if (!mesh) return;

    mesh.visible = landingUniforms.fade.value > 0.001;
    mesh.position.copy(camera.position);

    if (scene.background instanceof THREE.Color) {
      landingUniforms.base.value.copy(scene.background);
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[400, 32, 16]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={skyVertexShader}
        fragmentShader={skyFragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import { orbitStarMask } from "@/components/World/Orbit/orbitLayout";

interface PointLayerProps {
  count: number;
  color: string;
  size: number;
  opacity: number;
  spread: number;
  depth: number;
  drift: number;
}

type ShaderLike = Parameters<THREE.Material["onBeforeCompile"]>[0];

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;

  return value - Math.floor(value);
}

// Hides stars inside the orbit planet's cone (see orbitStarMask) and shapes
// each point sprite into a circular star core with 4-point optical spikes.
export function configureStarMaterial(
  shader: ShaderLike,
  options: { maskPlanet?: boolean } = {}
) {
  const { maskPlanet = true } = options;

  if (maskPlanet) {
    shader.uniforms.uMaskDirection = orbitStarMask.direction;
    shader.uniforms.uMaskCosine = orbitStarMask.cosine;
  }

  shader.vertexShader = shader.vertexShader
    .replace(
      "#include <common>",
      `#include <common>
attribute float aScale;
varying float vScale;
${
  maskPlanet
    ? "uniform vec3 uMaskDirection;\nuniform float uMaskCosine;"
    : ""
}`
    )
    .replace(
      "#include <fog_vertex>",
      `#include <fog_vertex>
  vScale = aScale;
  gl_PointSize = clamp(gl_PointSize * aScale, 3.0, 26.0);
${
  maskPlanet
    ? `  vec3 starDirection = normalize((modelMatrix * vec4(transformed, 1.0)).xyz - cameraPosition);
  if (dot(starDirection, uMaskDirection) > uMaskCosine) gl_PointSize = 0.0;`
    : ""
}`
    );

  shader.fragmentShader = shader.fragmentShader
    .replace(
      "#include <common>",
      `#include <common>
varying float vScale;`
    )
    .replace(
      "#include <map_particle_fragment>",
      `#include <map_particle_fragment>
  vec2 starUv = (gl_PointCoord - vec2(0.5)) * 2.0;
  float starDist = length(starUv);
  if (starDist > 1.0) discard;

  // Crisp circular Airy-disk core + soft circular corona
  float starCore = exp(-starDist * starDist * 26.0);
  float starGlow = exp(-starDist * 4.4) * 0.45;

  // 4-point optical diffraction spikes (stronger on brighter/larger stars)
  float ax = abs(starUv.x);
  float ay = abs(starUv.y);
  float spikeWeight = smoothstep(0.55, 1.35, vScale);
  float primarySpikes = (
    exp(-ay * 20.0) * pow(max(0.0, 1.0 - ax), 1.55) +
    exp(-ax * 20.0) * pow(max(0.0, 1.0 - ay), 1.55)
  ) * (0.55 + 0.45 * spikeWeight);

  vec2 diagUv = vec2(starUv.x + starUv.y, starUv.x - starUv.y) * 0.70710678;
  float secondarySpikes = (
    exp(-abs(diagUv.y) * 28.0) * pow(max(0.0, 1.0 - abs(diagUv.x) * 1.35), 2.2) +
    exp(-abs(diagUv.x) * 28.0) * pow(max(0.0, 1.0 - abs(diagUv.y) * 1.35), 2.2)
  ) * 0.25 * spikeWeight;

  float radialFade = 1.0 - smoothstep(0.7, 1.0, starDist);
  float starIntensity = clamp(
    (starCore + starGlow + primarySpikes + secondarySpikes) * radialFade,
    0.0,
    1.0
  );
  if (starIntensity < 0.015) discard;

  diffuseColor.rgb = mix(
    diffuseColor.rgb,
    vec3(1.0),
    clamp(starCore + primarySpikes * 0.45, 0.0, 1.0) * 0.65
  );
  diffuseColor.a *= starIntensity;`
    );
}

function maskStarsBehindPlanet(shader: ShaderLike) {
  configureStarMaterial(shader, { maskPlanet: true });
}

function PointLayer({
  count,
  color,
  size,
  opacity,
  spread,
  depth,
  drift,
}: PointLayerProps) {
  const { progress } = useJourney();
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const { positions, scales } = useMemo(() => {
    const values = new Float32Array(count * 3);
    const scaleValues = new Float32Array(count);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;

      values[offset] = (seededRandom(index + 17) - 0.5) * spread;
      values[offset + 1] = (seededRandom(index + 71) - 0.5) * spread * 0.65;
      // Keep stars in deep space behind the foreground station truss
      values[offset + 2] = -seededRandom(index + 149) * depth - 10;

      // Power distribution so most stars are crisp pinpoints and ~20% are bright beacon stars
      const r = seededRandom(index + 283);
      scaleValues[index] = 0.55 + Math.pow(r, 2.6) * 1.15;
    }

    return { positions: values, scales: scaleValues };
  }, [count, depth, spread]);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !materialRef.current) return;

    pointsRef.current.rotation.y = clock.getElapsedTime() * drift;
    // Stars are gone before the landing site appears (under the entry plasma).
    const atmosphericEntry = THREE.MathUtils.smoothstep(
      progress.get(),
      0.17,
      0.2
    );
    materialRef.current.opacity = opacity * (1 - atmosphericEntry);
    pointsRef.current.visible = atmosphericEntry < 0.999;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog={false}
        onBeforeCompile={maskStarsBehindPlanet}
      />
    </points>
  );
}

export default function StarField() {
  const { size } = useThree();
  const isCompact = size.width < 768;

  return (
    <group>
      <PointLayer
        count={isCompact ? 280 : 620}
        color="#f2efe6"
        size={0.34}
        opacity={0.92}
        spread={70}
        depth={95}
        drift={0.003}
      />
      <PointLayer
        count={isCompact ? 90 : 180}
        color="#cfd8e8"
        size={0.62}
        opacity={0.85}
        spread={55}
        depth={85}
        drift={-0.002}
      />
    </group>
  );
}
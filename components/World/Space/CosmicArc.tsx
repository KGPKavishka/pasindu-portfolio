"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  GatewayLayerProps,
  OrbitalGatewayLayout,
  pinDepthChunk,
  seededRandom,
} from "./orbitalGatewayLayout";

const RIBBON_SEGMENTS = 40;
/** Seconds for one pass along the trajectory, then a quiet gap before the next. */
const TRAVEL_SECONDS = 38;
const CYCLE_SECONDS = 50;
/** Where along the trajectory the comet is when the page first loads. */
const START_POSITION = 0.38;

const pathChunk = /* glsl */ `
  uniform vec3 uP0;
  uniform vec3 uP1;
  uniform vec3 uP2;
  uniform float uHead;
  uniform float uTailLength;

  vec3 cometPath(float s) {
    float u = 1.0 - s;
    return u * u * uP0 + 2.0 * u * s * uP1 + s * s * uP2;
  }

  vec3 cometTangent(float s) {
    return normalize(2.0 * (1.0 - s) * (uP1 - uP0) + 2.0 * s * (uP2 - uP1));
  }
`;

const ribbonVertexShader = /* glsl */ `
  ${pinDepthChunk}
  ${pathChunk}
  uniform float uHeadWidth;
  attribute float aAlong;
  attribute float aSide;
  varying float vAlong;
  varying float vSide;

  void main() {
    float s = uHead - (1.0 - aAlong) * uTailLength;
    vec3 point = cometPath(s);
    vec3 view = normalize(point - cameraPosition);
    vec3 side = normalize(cross(cometTangent(s), view));
    float width = uHeadWidth * mix(0.06, 1.0, pow(aAlong, 1.3));

    point += side * width * aSide;
    vAlong = aAlong;
    vSide = aSide;
    gl_Position = pinDepth(projectionMatrix * modelViewMatrix * vec4(point, 1.0));
  }
`;

const ribbonFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uHeadColor;
  uniform vec3 uMidColor;
  uniform vec3 uTailColor;
  varying float vAlong;
  varying float vSide;

  void main() {
    float core = exp(-vSide * vSide * 22.0);
    float glow = exp(-vSide * vSide * 3.0) * 0.3;
    float body = pow(vAlong, 1.6);
    float shimmer = 0.82 + 0.18 * sin(vAlong * 30.0 - uTime * 6.0);
    vec3 color = mix(uTailColor, uMidColor, smoothstep(0.0, 0.6, vAlong));

    color = mix(color, uHeadColor, smoothstep(0.8, 1.0, vAlong));

    gl_FragColor = vec4(color * (core * shimmer + glow) * body * uOpacity, 1.0);
    #include <colorspace_fragment>
  }
`;

const particleVertexShader = /* glsl */ `
  ${pinDepthChunk}
  ${pathChunk}
  uniform float uTime;
  uniform float uSize;
  uniform float uScale;
  attribute float aPhase;
  attribute float aScale;
  attribute vec3 aOffset;
  varying float vLife;

  void main() {
    // life 0 = just shed at the head, 1 = dissipated at the end of the tail.
    float life = fract(aPhase + uTime * 0.5);
    vec3 point = cometPath(uHead - life * uTailLength) + aOffset * (0.15 + life * 1.1);
    vec4 mvPosition = modelViewMatrix * vec4(point, 1.0);

    vLife = life;
    gl_PointSize = uSize * aScale * (1.0 - life * 0.6) * uScale / -mvPosition.z;
    gl_Position = pinDepth(projectionMatrix * mvPosition);
  }
`;

const particleFragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uHeadColor;
  uniform vec3 uTailColor;
  varying float vLife;

  void main() {
    float soft = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    float alpha = pow(1.0 - vLife, 2.0) * soft * soft;
    vec3 color = mix(uHeadColor, uTailColor, smoothstep(0.0, 0.8, vLife));

    gl_FragColor = vec4(color * alpha * uOpacity, 1.0);
    #include <colorspace_fragment>
  }
`;

const headVertexShader = /* glsl */ `
  ${pinDepthChunk}
  ${pathChunk}
  uniform float uSize;
  uniform float uScale;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(cometPath(uHead), 1.0);

    gl_PointSize = uSize * uScale / -mvPosition.z;
    gl_Position = pinDepth(projectionMatrix * mvPosition);
  }
`;

const headFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uHeadColor;
  uniform vec3 uGlowColor;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;

    if (r > 1.0) discard;

    float pulse = 1.0 + sin(uTime * 3.1) * 0.08;
    float core = exp(-r * r * 70.0 / pulse);
    float flare = exp(-r * r * 7.0) * 0.32 * (1.0 - r);
    vec3 color = uHeadColor * core * 1.3 + uGlowColor * flare;

    gl_FragColor = vec4(color * uOpacity, 1.0);
    #include <colorspace_fragment>
  }
`;

function createRibbonGeometry() {
  const vertexCount = (RIBBON_SEGMENTS + 1) * 2;
  const along = new Float32Array(vertexCount);
  const side = new Float32Array(vertexCount);
  const indices: number[] = [];

  for (let index = 0; index <= RIBBON_SEGMENTS; index += 1) {
    const amount = index / RIBBON_SEGMENTS;

    along.set([amount, amount], index * 2);
    side.set([1, -1], index * 2);

    if (index < RIBBON_SEGMENTS) {
      const a = index * 2;

      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();

  // Positions are computed in the vertex shader; this only sizes the draw.
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3)
  );
  geometry.setAttribute("aAlong", new THREE.BufferAttribute(along, 1));
  geometry.setAttribute("aSide", new THREE.BufferAttribute(side, 1));
  geometry.setIndex(indices);

  return geometry;
}

function createTailParticles(count: number, spread: number) {
  const phases = new Float32Array(count);
  const scales = new Float32Array(count);
  const offsets = new Float32Array(count * 3);
  const direction = new THREE.Vector3();

  for (let index = 0; index < count; index += 1) {
    const seed = index * 2.71 + 41;

    phases[index] = seededRandom(seed);
    scales[index] = 0.5 + seededRandom(seed + 1) * 0.8;
    direction
      .set(
        seededRandom(seed + 2) - 0.5,
        seededRandom(seed + 3) - 0.5,
        seededRandom(seed + 4) - 0.5
      )
      .normalize()
      .multiplyScalar(spread * (0.25 + seededRandom(seed + 5) * 0.75));
    offsets.set([direction.x, direction.y, direction.z], index * 3);
  }

  return { phases, scales, offsets };
}

/** Where the head is along its trajectory (0–1), or -1 between passes. */
function getHeadPosition(time: number) {
  const cycle =
    (((time + START_POSITION * TRAVEL_SECONDS) % CYCLE_SECONDS) +
      CYCLE_SECONDS) %
    CYCLE_SECONDS;

  return cycle <= TRAVEL_SECONDS ? cycle / TRAVEL_SECONDS : -1;
}

function createPathUniforms(comet: OrbitalGatewayLayout["comet"]) {
  return {
    uP0: { value: comet.path[0] },
    uP1: { value: comet.path[1] },
    uP2: { value: comet.path[2] },
    uHead: { value: START_POSITION },
    uTailLength: { value: comet.tailLength },
    uPinDistance: { value: 50 },
  };
}

export default function CosmicArc({ layout, visibility }: GatewayLayerProps) {
  const { comet, isCompact } = layout;
  const rootRef = useRef<THREE.Group>(null);
  const ribbonMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const particleMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const headMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const particleCount = isCompact ? 14 : 28;

  const ribbonGeometry = useMemo(() => createRibbonGeometry(), []);
  const particles = useMemo(
    () => createTailParticles(particleCount, comet.headWidth * 1.4),
    [particleCount, comet.headWidth]
  );

  const ribbonUniforms = useMemo(
    () => ({
      ...createPathUniforms(comet),
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uHeadWidth: { value: comet.headWidth },
      uHeadColor: { value: new THREE.Color("#e0ffff") },
      uMidColor: { value: new THREE.Color("#22d3ee") },
      uTailColor: { value: new THREE.Color("#1d4ed8") },
    }),
    [comet]
  );
  const particleUniforms = useMemo(
    () => ({
      ...createPathUniforms(comet),
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uSize: { value: comet.headWidth * 1.1 },
      uScale: { value: 400 },
      uHeadColor: { value: new THREE.Color("#e0ffff") },
      uTailColor: { value: new THREE.Color("#2563eb") },
    }),
    [comet]
  );
  const headUniforms = useMemo(
    () => ({
      ...createPathUniforms(comet),
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uSize: { value: comet.headWidth * 9 },
      uScale: { value: 400 },
      uHeadColor: { value: new THREE.Color("#f0ffff") },
      uGlowColor: { value: new THREE.Color("#22d3ee") },
    }),
    [comet]
  );
  const headGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(3), 3)
    );

    return geometry;
  }, []);

  useEffect(() => () => ribbonGeometry.dispose(), [ribbonGeometry]);
  useEffect(() => () => headGeometry.dispose(), [headGeometry]);

  useFrame(({ size, viewport }) => {
    const state = visibility.current;
    const head = getHeadPosition(state.time);
    const passFade =
      head < 0
        ? 0
        : THREE.MathUtils.smoothstep(head, 0, 0.06) *
        (1 - THREE.MathUtils.smoothstep(head, 0.94, 1));
    const opacity = state.comet * passFade;

    if (rootRef.current) rootRef.current.visible = opacity > 0.001;
    if (opacity <= 0.001) return;

    const scale = (size.height * viewport.dpr) / 2;
    const materials = [
      ribbonMaterialRef.current,
      particleMaterialRef.current,
      headMaterialRef.current,
    ];

    for (const material of materials) {
      if (!material) continue;

      material.uniforms.uHead.value = head;
      material.uniforms.uTime.value = state.time;
      material.uniforms.uOpacity.value = opacity;
      material.uniforms.uPinDistance.value = state.pinDistance;

      if (material.uniforms.uScale) material.uniforms.uScale.value = scale;
    }
  });

  return (
    <group ref={rootRef} visible={false}>
      <mesh geometry={ribbonGeometry} renderOrder={8} frustumCulled={false}>
        <shaderMaterial
          ref={ribbonMaterialRef}
          uniforms={ribbonUniforms}
          vertexShader={ribbonVertexShader}
          fragmentShader={ribbonFragmentShader}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <points renderOrder={9} frustumCulled={false}>
        <bufferGeometry key={particleCount}>
          {/* Positions are computed in the vertex shader from the trajectory. */}
          <bufferAttribute
            attach="attributes-position"
            args={[particles.offsets, 3]}
          />
          <bufferAttribute
            attach="attributes-aOffset"
            args={[particles.offsets, 3]}
          />
          <bufferAttribute
            attach="attributes-aPhase"
            args={[particles.phases, 1]}
          />
          <bufferAttribute
            attach="attributes-aScale"
            args={[particles.scales, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={particleMaterialRef}
          uniforms={particleUniforms}
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points geometry={headGeometry} renderOrder={9} frustumCulled={false}>
        <shaderMaterial
          ref={headMaterialRef}
          uniforms={headUniforms}
          vertexShader={headVertexShader}
          fragmentShader={headFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

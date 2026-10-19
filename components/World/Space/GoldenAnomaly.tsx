"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  GatewayLayerProps,
  pinDepthChunk,
  seededRandom,
} from "./orbitalGatewayLayout";

const planeVertexShader = /* glsl */ `
  ${pinDepthChunk}
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = pinDepth(projectionMatrix * modelViewMatrix * vec4(position, 1.0));
  }
`;

const diskFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uCore;
  uniform vec3 uGold;
  uniform vec3 uEmber;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int octave = 0; octave < OCTAVES; octave++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(1.7, 9.2);
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);

    if (r > 1.0) discard;

    // Differential rotation: the inner disk turns faster than the rim.
    float spin = uTime * 0.05 / (0.3 + r * 1.6);
    float s = sin(spin);
    float c = cos(spin);
    vec2 q = mat2(c, -s, s, c) * p;
    float angle = atan(q.y, q.x);

    float arms = pow(0.5 + 0.5 * cos(2.0 * angle - 7.0 * log(r + 0.04)), 3.0);
    float clouds = fbm(q * 3.2 + 4.0);
    float lanes = smoothstep(0.42, 0.72, fbm(q * 7.5 - 2.0));
    float grain = fbm(q * 22.0);

    float disk = exp(-r * 3.4) * (1.0 - smoothstep(0.62, 1.0, r));
    float ring = exp(-pow((r - 0.3) / 0.06, 2.0));
    float structure = disk * (0.25 + 1.4 * arms * (0.55 + 0.9 * clouds))
      + ring * (0.35 + 0.5 * clouds);

    structure *= 1.0 - 0.6 * lanes * smoothstep(0.08, 0.35, r);
    structure += disk * grain * 0.35 * smoothstep(0.25, 0.8, r);

    // Core keeps visible texture instead of a flat white blob.
    float coreTexture = 0.7 + 0.6 * fbm(q * 11.0 + uTime * 0.02);
    float bulge = exp(-r * r * 26.0) * coreTexture;
    float core = exp(-r * r * 140.0) * coreTexture;

    vec3 color = mix(uGold, uEmber, smoothstep(0.2, 0.85, r)) * structure * 0.95;
    color += uGold * bulge * 0.6;
    color += uCore * core * 0.8;

    // Soft highlight roll-off: bright areas stay golden rather than clipping to white.
    color = 1.0 - exp(-color * 1.5);

    gl_FragColor = vec4(color * uOpacity, 1.0);
    #include <colorspace_fragment>
  }
`;

const haloFragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uCore;
  uniform vec3 uGold;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float glow = exp(-r * r * 55.0) * 0.42
      + exp(-r * r * 10.0) * 0.1
      + exp(-r * 3.2) * 0.03;

    glow *= 1.0 - smoothstep(0.75, 1.0, r);

    vec3 color = mix(uGold, uCore, exp(-r * r * 40.0)) * glow;

    gl_FragColor = vec4(color * uOpacity, 1.0);
    #include <colorspace_fragment>
  }
`;

const dustVertexShader = /* glsl */ `
  ${pinDepthChunk}
  uniform float uSize;
  uniform float uScale;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vColor = aColor;
    gl_PointSize = uSize * uScale / -mvPosition.z;
    gl_Position = pinDepth(projectionMatrix * mvPosition);
  }
`;

const dustFragmentShader = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;

  void main() {
    float soft = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));

    gl_FragColor = vec4(vColor * soft * soft * uOpacity, 1.0);
    #include <colorspace_fragment>
  }
`;

function createGalaxyDust(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const inner = new THREE.Color("#ffe2a8");
  const gold = new THREE.Color("#ffaa00");
  const ember = new THREE.Color("#c2410c");
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const seed = index * 1.37 + 11;
    let radius: number;
    let angle: number;

    if (seededRandom(seed) < 0.18) {
      radius = 0.3 + (seededRandom(seed + 1) - 0.5) * 0.08;
      angle = seededRandom(seed + 2) * Math.PI * 2;
    } else {
      radius = 0.06 + Math.pow(seededRandom(seed + 1), 0.75) * 0.92;
      const arm = seededRandom(seed + 2) < 0.5 ? 0 : Math.PI;
      const scatter =
        (seededRandom(seed + 3) + seededRandom(seed + 4) - 1) *
        (0.35 + radius * 0.3);

      // Follows the same log spiral as the disk shader's arms.
      angle = arm + 3.5 * Math.log(radius + 0.04) + scatter;
    }

    positions.set(
      [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (seededRandom(seed + 5) - 0.5) * 0.02 * (1 - radius),
      ],
      index * 3
    );

    const brightness = 0.3 + seededRandom(seed + 6) * 0.55;

    color
      .copy(inner)
      .lerp(gold, THREE.MathUtils.smoothstep(radius, 0.05, 0.35))
      .lerp(ember, THREE.MathUtils.smoothstep(radius, 0.45, 0.95))
      .multiplyScalar(brightness);
    colors.set([color.r, color.g, color.b], index * 3);
  }

  return { positions, colors };
}

export default function GoldenAnomaly({ layout, visibility }: GatewayLayerProps) {
  const { galaxy, isCompact } = layout;
  const rootRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);
  const diskMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const haloMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const dustMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const diskUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uPinDistance: { value: 50 },
      uCore: { value: new THREE.Color("#ffd27a") },
      uGold: { value: new THREE.Color("#ffaa00") },
      uEmber: { value: new THREE.Color("#b4410c") },
    }),
    []
  );
  const haloUniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uPinDistance: { value: 50 },
      uCore: { value: new THREE.Color("#ffe0a0") },
      uGold: { value: new THREE.Color("#ffb800") },
    }),
    []
  );
  const dustUniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uPinDistance: { value: 50 },
      uSize: { value: galaxy.radius * 0.02 },
      uScale: { value: 400 },
    }),
    [galaxy.radius]
  );
  const dust = useMemo(
    () => createGalaxyDust(isCompact ? 1100 : 2600),
    [isCompact]
  );

  useFrame(({ size, viewport }) => {
    const state = visibility.current;
    const opacity = state.galaxy;

    if (rootRef.current) rootRef.current.visible = opacity > 0.001;
    if (opacity <= 0.001) return;

    if (scaleRef.current) {
      scaleRef.current.scale.setScalar(
        galaxy.radius * THREE.MathUtils.lerp(0.95, 1, state.intro)
      );
    }

    const materials = [
      diskMaterialRef.current,
      haloMaterialRef.current,
      dustMaterialRef.current,
    ];

    for (const material of materials) {
      if (!material) continue;

      material.uniforms.uOpacity.value = opacity;
      material.uniforms.uPinDistance.value = state.pinDistance;
    }

    if (diskMaterialRef.current) {
      diskMaterialRef.current.uniforms.uTime.value = state.time;
    }

    if (dustMaterialRef.current) {
      dustMaterialRef.current.uniforms.uScale.value =
        (size.height * viewport.dpr) / 2;
    }

    if (dustRef.current) {
      dustRef.current.rotation.z = -state.time * 0.045;
    }
  });

  return (
    <group ref={rootRef} position={galaxy.position} visible={false}>
      <group ref={scaleRef} scale={galaxy.radius * 0.95}>
        <mesh
          quaternion={galaxy.haloQuaternion}
          renderOrder={5}
          frustumCulled={false}
        >
          <planeGeometry args={[2.4, 2.4]} />
          <shaderMaterial
            ref={haloMaterialRef}
            uniforms={haloUniforms}
            vertexShader={planeVertexShader}
            fragmentShader={haloFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        <group quaternion={galaxy.diskQuaternion}>
          <mesh renderOrder={6} frustumCulled={false}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
              key={isCompact ? "disk-compact" : "disk-full"}
              ref={diskMaterialRef}
              uniforms={diskUniforms}
              defines={{ OCTAVES: isCompact ? 3 : 4 }}
              vertexShader={planeVertexShader}
              fragmentShader={diskFragmentShader}
              transparent
              depthWrite={false}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>

          <points ref={dustRef} renderOrder={7} frustumCulled={false}>
            <bufferGeometry key={dust.positions.length}>
              <bufferAttribute
                attach="attributes-position"
                args={[dust.positions, 3]}
              />
              <bufferAttribute
                attach="attributes-aColor"
                args={[dust.colors, 3]}
              />
            </bufferGeometry>
            <shaderMaterial
              ref={dustMaterialRef}
              uniforms={dustUniforms}
              vertexShader={dustVertexShader}
              fragmentShader={dustFragmentShader}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </group>
      </group>
    </group>
  );
}

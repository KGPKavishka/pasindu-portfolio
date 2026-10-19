"use client";

import { Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { GatewayLayerProps, seededRandom } from "./orbitalGatewayLayout";

type ShaderLike = Parameters<THREE.Material["onBeforeCompile"]>[0];

/**
 * The gas giant is far behind the main planet, beyond the depth the quasar is
 * pinned to. Its depth is scaled into the range just in front of the quasar so
 * it still sits in front of the quasar, comet and (invisible) fogged city.
 */
const depthScaleChunk = /* glsl */ `
  uniform float uDepthScale;

  vec4 scaleDepth(vec4 clipPosition, float viewZ) {
    float z = viewZ * uDepthScale;
    float ndcZ = (projectionMatrix[2][2] * z + projectionMatrix[3][2]) / -z;

    clipPosition.z = ndcZ * clipPosition.w;
    return clipPosition;
  }
`;

function toCss(color: THREE.Color, alpha = 1) {
  const rgb = color.getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace);

  return `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, ${alpha})`;
}

function createCanvasTexture(
  width: number,
  height: number,
  draw: (context: CanvasRenderingContext2D) => void
) {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (context) draw(context);

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

/** Latitude bands for the gas giant (sphere UV v = latitude). */
function createBandTexture() {
  const palette = ["#13263d", "#28506e", "#4d7d99", "#9cc1cf", "#3b5f82", "#6b5d8c"].map(
    (hex) => new THREE.Color(hex)
  );
  const color = new THREE.Color();

  return createCanvasTexture(8, 256, (context) => {
    for (let y = 0; y < 256; y += 1) {
      const t = y / 255;
      const wave =
        0.5 + 0.5 * Math.sin(t * Math.PI * 11 + Math.sin(t * Math.PI * 4 + 1.3) * 1.6);
      const jitter = (seededRandom(y * 0.37 + 5) - 0.5) * 0.22;
      const index =
        THREE.MathUtils.clamp(wave + jitter, 0, 1) * (palette.length - 1);
      const lower = Math.floor(index);

      color
        .copy(palette[lower])
        .lerp(palette[Math.min(lower + 1, palette.length - 1)], index - lower);
      context.fillStyle = toCss(color);
      context.fillRect(0, y, 8, 1);
    }
  });
}

/** Radial ring density (ring UV u = radius). */
function createRingTexture() {
  const tint = new THREE.Color("#c7dde6");

  return createCanvasTexture(256, 4, (context) => {
    for (let x = 0; x < 256; x += 1) {
      const t = x / 255;
      const bands = 0.55 + 0.45 * Math.sin(t * 46 + Math.sin(t * 9) * 2.2);
      const edges = THREE.MathUtils.smoothstep(t, 0, 0.08) *
        (1 - THREE.MathUtils.smoothstep(t, 0.85, 1));
      const gap = 1 - 0.9 * Math.exp(-Math.pow((t - 0.62) / 0.025, 2));
      const grain = 0.8 + seededRandom(x * 1.7 + 3) * 0.2;

      context.fillStyle = toCss(tint, bands * edges * gap * grain * 0.85);
      context.fillRect(x, 0, 1, 4);
    }
  });
}

/** Dusty rust world with darker basins and faint polar frost. */
function createTerrestrialTexture() {
  const base = new THREE.Color("#7a3b22");
  const tones = ["#4e2416", "#a2582f", "#8a4a2a", "#36190f"].map(
    (hex) => new THREE.Color(hex)
  );
  const frost = new THREE.Color("#d9c9bb");

  return createCanvasTexture(128, 64, (context) => {
    context.fillStyle = toCss(base);
    context.fillRect(0, 0, 128, 64);

    for (let index = 0; index < 34; index += 1) {
      const seed = index * 4.13 + 17;

      context.fillStyle = toCss(
        tones[Math.floor(seededRandom(seed) * tones.length)],
        0.35 + seededRandom(seed + 1) * 0.4
      );
      context.beginPath();
      context.ellipse(
        seededRandom(seed + 2) * 128,
        8 + seededRandom(seed + 3) * 48,
        3 + seededRandom(seed + 4) * 14,
        2 + seededRandom(seed + 5) * 6,
        seededRandom(seed + 6) * Math.PI,
        0,
        Math.PI * 2
      );
      context.fill();
    }

    context.fillStyle = toCss(frost, 0.55);
    context.fillRect(0, 0, 128, 4);
    context.fillStyle = toCss(frost, 0.4);
    context.fillRect(0, 61, 128, 3);
  });
}

function createRingGeometry(inner: number, outer: number) {
  const geometry = new THREE.RingGeometry(inner, outer, 96, 1);
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  const vertex = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    uv.setXY(index, (vertex.length() - inner) / (outer - inner), 0.5);
  }

  return geometry;
}

/**
 * Three extra bodies around the main planet: a ringed gas giant far in the
 * background, a nearer terrestrial planet and a small icy moon. Each has its
 * own tilt and spin axis; all are lit by the quasar light from where they sit.
 */
export default function DistantPlanets({ layout, visibility }: GatewayLayerProps) {
  const { gasGiant, terrestrial, moon } = layout.planets;
  const segments = layout.isCompact ? 32 : 48;

  const gasGiantRef = useRef<THREE.Group>(null);
  const gasGiantBodyRef = useRef<THREE.Mesh>(null);
  const terrestrialRef = useRef<THREE.Group>(null);
  const terrestrialBodyRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Group>(null);
  const moonBodyRef = useRef<THREE.Mesh>(null);
  const gasGiantMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const ringMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const terrestrialMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const moonMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const depthScale = useRef({ value: 0.45 });

  const bandTexture = useMemo(() => createBandTexture(), []);
  const ringTexture = useMemo(() => createRingTexture(), []);
  const terrestrialTexture = useMemo(() => createTerrestrialTexture(), []);
  const ringGeometry = useMemo(
    () => createRingGeometry(gasGiant.radius * 1.35, gasGiant.radius * 2.25),
    [gasGiant.radius]
  );

  useEffect(() => () => bandTexture.dispose(), [bandTexture]);
  useEffect(() => () => ringTexture.dispose(), [ringTexture]);
  useEffect(() => () => terrestrialTexture.dispose(), [terrestrialTexture]);
  useEffect(() => () => ringGeometry.dispose(), [ringGeometry]);

  const injectDepthScale = useCallback((shader: ShaderLike) => {
    shader.uniforms.uDepthScale = depthScale.current;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${depthScaleChunk}`)
      .replace(
        "#include <project_vertex>",
        "#include <project_vertex>\n  gl_Position = scaleDepth(gl_Position, mvPosition.z);"
      );
  }, []);

  useFrame(({ camera }) => {
    const state = visibility.current;
    const far = state.galaxy;
    const near = state.debris;

    // Centre the gas giant a little in front of the quasar's pinned depth.
    depthScale.current.value =
      (state.pinDistance - 8) /
      Math.max(camera.position.distanceTo(gasGiant.position), 1);

    if (gasGiantRef.current) gasGiantRef.current.visible = far > 0.001;
    if (moonRef.current) moonRef.current.visible = far > 0.001;
    if (terrestrialRef.current) terrestrialRef.current.visible = near > 0.001;

    if (gasGiantMaterialRef.current) gasGiantMaterialRef.current.opacity = far;
    if (ringMaterialRef.current) ringMaterialRef.current.opacity = far * 0.55;
    if (moonMaterialRef.current) moonMaterialRef.current.opacity = far;
    if (terrestrialMaterialRef.current) {
      terrestrialMaterialRef.current.opacity = near;
    }

    // Different spin rates and axes (each body's group carries its own tilt).
    if (gasGiantBodyRef.current) gasGiantBodyRef.current.rotation.y = state.time * 0.05;
    if (terrestrialBodyRef.current) {
      terrestrialBodyRef.current.rotation.y = -state.time * 0.09;
    }
    if (moonBodyRef.current) moonBodyRef.current.rotation.y = state.time * 0.14;
  });

  return (
    <>
      {/* Ringed gas giant — far background, axis tilted toward the viewer. */}
      <group
        ref={gasGiantRef}
        position={gasGiant.position}
        rotation={[0.38, 0.2, -0.46]}
        visible={false}
      >
        <Sphere
          ref={gasGiantBodyRef}
          args={[gasGiant.radius, segments, segments]}
          renderOrder={3}
        >
          <meshStandardMaterial
            ref={gasGiantMaterialRef}
            map={bandTexture}
            roughness={0.92}
            metalness={0}
            emissive="#0d2236"
            emissiveIntensity={0.35}
            transparent
            opacity={0}
            fog={false}
            onBeforeCompile={injectDepthScale}
          />
        </Sphere>

        <mesh
          geometry={ringGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
          renderOrder={4}
        >
          <meshBasicMaterial
            ref={ringMaterialRef}
            map={ringTexture}
            color="#9ab8c6"
            side={THREE.DoubleSide}
            transparent
            opacity={0}
            depthWrite={false}
            fog={false}
            onBeforeCompile={injectDepthScale}
          />
        </mesh>
      </group>

      {/* Terrestrial planet — nearer mid-ground, opposite tilt and spin. */}
      <group
        ref={terrestrialRef}
        position={terrestrial.position}
        rotation={[-0.22, 0, 0.41]}
        visible={false}
      >
        <Sphere
          ref={terrestrialBodyRef}
          args={[terrestrial.radius, segments, segments]}
        >
          <meshStandardMaterial
            ref={terrestrialMaterialRef}
            map={terrestrialTexture}
            emissiveMap={terrestrialTexture}
            roughness={0.95}
            metalness={0}
            emissive="#ffffff"
            emissiveIntensity={0.16}
            transparent
            opacity={0}
            fog={false}
          />
        </Sphere>
      </group>

      {/* Small icy moon — silhouetted against the quasar's outer disk. */}
      <group
        ref={moonRef}
        position={moon.position}
        rotation={[0.6, 0, -0.18]}
        visible={false}
      >
        <Sphere ref={moonBodyRef} args={[moon.radius, 24, 24]}>
          <meshStandardMaterial
            ref={moonMaterialRef}
            color="#9fb4c2"
            roughness={1}
            metalness={0}
            emissive="#0a1620"
            emissiveIntensity={0.5}
            transparent
            opacity={0}
            fog={false}
          />
        </Sphere>
      </group>
    </>
  );
}

"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { GatewayLayerProps, getSoftGlowTexture } from "./orbitalGatewayLayout";

const asteroidVertexShader = /* glsl */ `
  uniform vec3 uLightDir;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;
  varying vec3 vLightView;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    vViewPosition = mvPosition.xyz;
    vNormalView = normalize(normalMatrix * normal);
    vLightView = normalize((viewMatrix * vec4(uLightDir, 0.0)).xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const asteroidFragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uBase;
  uniform vec3 uKey;
  uniform vec3 uRim;
  varying vec3 vNormalView;
  varying vec3 vViewPosition;
  varying vec3 vLightView;

  void main() {
    vec3 normal = normalize(vNormalView);
    vec3 viewDirection = normalize(-vViewPosition);
    float facing = max(dot(normal, viewDirection), 0.0);
    float key = pow(max(dot(normal, vLightView), 0.0), 1.4);
    float rim = pow(1.0 - facing, 3.0);
    vec3 color = uBase + uKey * key * 0.55 + uRim * rim * 0.12;
    // Feathered silhouette edge fakes a shallow depth of field.
    float edge = smoothstep(0.0, 0.5, facing);

    gl_FragColor = vec4(color, edge * uOpacity);
    #include <colorspace_fragment>
  }
`;

function createAsteroidGeometry(seed: number, detail: number) {
  const base = new THREE.IcosahedronGeometry(1, detail);

  base.deleteAttribute("normal");
  base.deleteAttribute("uv");

  const geometry = mergeVertices(base);
  const position = geometry.getAttribute("position");
  const vertex = new THREE.Vector3();

  base.dispose();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index).normalize();

    const displacement =
      1 +
      0.2 *
      Math.sin(vertex.x * 3.1 + seed) *
      Math.sin(vertex.y * 2.6 + seed * 1.7) *
      Math.sin(vertex.z * 3.4 + seed * 0.6) +
      0.07 *
      Math.sin(vertex.x * 8.3 + seed * 2.1) *
      Math.sin(vertex.y * 7.7 + seed) *
      Math.sin(vertex.z * 9.1 + seed * 1.3);

    vertex.multiplyScalar(displacement);
    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();

  return geometry;
}

export default function ForegroundDebris({ layout, visibility }: GatewayLayerProps) {
  const { asteroids, dust, galaxy, isCompact } = layout;
  const rootRef = useRef<THREE.Group>(null);
  const dustRef = useRef<THREE.Points>(null);
  const dustMaterialRef = useRef<THREE.PointsMaterial>(null);
  const asteroidRefs = useRef<(THREE.Mesh | null)[]>([]);

  const geometries = useMemo(
    () =>
      asteroids.map((asteroid) =>
        createAsteroidGeometry(asteroid.seed, isCompact ? 2 : 3)
      ),
    [asteroids, isCompact]
  );
  const asteroidMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: { value: 0 },
          uLightDir: { value: galaxy.direction.clone() },
          uBase: { value: new THREE.Color("#04060b") },
          uKey: { value: new THREE.Color("#ffaa00") },
          uRim: { value: new THREE.Color("#22d3ee") },
        },
        vertexShader: asteroidVertexShader,
        fragmentShader: asteroidFragmentShader,
        transparent: true,
      }),
    [galaxy.direction]
  );
  const glowTexture = useMemo(() => getSoftGlowTexture(), []);

  useEffect(
    () => () => geometries.forEach((geometry) => geometry.dispose()),
    [geometries]
  );

  useEffect(() => () => asteroidMaterial.dispose(), [asteroidMaterial]);

  useFrame(() => {
    const state = visibility.current;
    const opacity = state.debris;

    if (rootRef.current) rootRef.current.visible = opacity > 0.001;
    if (opacity <= 0.001) return;

    const sharedMaterial = asteroidRefs.current[0]?.material;

    if (sharedMaterial instanceof THREE.ShaderMaterial) {
      sharedMaterial.uniforms.uOpacity.value = opacity;
    }

    if (dustMaterialRef.current) dustMaterialRef.current.opacity = opacity;

    asteroids.forEach((asteroid, index) => {
      const mesh = asteroidRefs.current[index];

      if (!mesh) return;

      mesh.rotation.set(
        asteroid.rotation.x + asteroid.spin.x * state.time,
        asteroid.rotation.y + asteroid.spin.y * state.time,
        asteroid.rotation.z + asteroid.spin.z * state.time
      );
      mesh.position.set(
        asteroid.position.x + Math.sin(state.time * 0.11 + asteroid.seed) * 0.12,
        asteroid.position.y + Math.cos(state.time * 0.09 + asteroid.seed) * 0.1,
        asteroid.position.z
      );
    });

    if (dustRef.current) {
      dustRef.current.position.set(
        Math.sin(state.time * 0.07) * 0.18,
        Math.sin(state.time * 0.05 + 1.3) * 0.12,
        0
      );
    }
  });

  return (
    <group ref={rootRef} visible={false}>
      {asteroids.map((asteroid, index) => (
        <mesh
          key={asteroid.seed}
          ref={(mesh) => {
            asteroidRefs.current[index] = mesh;
          }}
          geometry={geometries[index]}
          material={asteroidMaterial}
          position={asteroid.position}
          rotation={asteroid.rotation}
          scale={asteroid.scale}
          renderOrder={10}
        />
      ))}

      <points ref={dustRef} renderOrder={11} frustumCulled={false}>
        <bufferGeometry key={dust.positions.length}>
          <bufferAttribute
            attach="attributes-position"
            args={[dust.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[dust.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={dustMaterialRef}
          map={glowTexture}
          size={dust.size}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          fog={false}
        />
      </points>
    </group>
  );
}

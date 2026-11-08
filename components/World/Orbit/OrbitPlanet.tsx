"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import {
  createPlanetUniforms,
  getPlanetAlbedo,
  planetFragmentShader,
  planetVertexShader,
} from "@/components/World/Planet/planetShader";
import type { OrbitLayerProps } from "./orbitLayout";

// Thin atmosphere seen edge-on: height above the limb is found by ray-sphere
// closest approach, so it hugs the limb exactly and fades with altitude.
const haloVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const haloFragmentShader = /* glsl */ `
  uniform vec3 uCenter;
  uniform float uRadius;
  uniform vec3 uSunDirection;
  uniform vec3 uDust;
  uniform vec3 uBlueHour;
  uniform float uOpacity;
  varying vec3 vWorldPosition;

  void main() {
    vec3 rayDirection = normalize(vWorldPosition - cameraPosition);
    float closestApproach = dot(uCenter - cameraPosition, rayDirection);
    vec3 closestPoint = cameraPosition + rayDirection * closestApproach;
    float height = length(closestPoint - uCenter) - uRadius;

    float altitude = height / uRadius;

    // The planet mesh is inflated slightly (see OrbitPlanet) so its facets
    // always cover the true sphere; nothing to cut here.
    if (height < 0.0) discard;
    float sunFacing = smoothstep(-0.35, 0.85, dot(normalize(closestPoint - uCenter), uSunDirection));
    float glow = exp(-altitude / 0.011) + 0.22 * exp(-altitude / 0.04);
    vec3 color = mix(uDust, uBlueHour, smoothstep(0.0, 0.05, altitude));

    gl_FragColor = vec4(color * glow * sunFacing * uOpacity * 0.85, 1.0);
    #include <colorspace_fragment>
  }
`;

const sunVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Hot disc, soft bloom and a faint horizontal streak. Additive and depth
// tested, so the planet's limb cuts the sun exactly where it should.
const sunFragmentShader = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uCore;
  uniform vec3 uGlow;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float disc = 1.0 - smoothstep(0.036, 0.046, r);
    float corona = exp(-r * 26.0) * 0.9 + exp(-r * 7.0) * 0.18;
    float streak = exp(-abs(p.y) * 70.0) * exp(-abs(p.x) * 6.5) * 0.28;
    vec3 color = uCore * disc * 3.0 + uGlow * (corona + streak);

    color = 1.0 - exp(-color * 1.1);
    gl_FragColor = vec4(color * uOpacity, 1.0);
    #include <colorspace_fragment>
  }
`;

export default function OrbitPlanet({ layout, visibility }: OrbitLayerProps) {
  const { planet, sun, isCompact } = layout;
  const gl = useThree((state) => state.gl);
  const planetRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const sunRef = useRef<THREE.Mesh>(null);
  const planetMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const haloMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const sunMaterialRef = useRef<THREE.ShaderMaterial>(null);

  const planetUniforms = useMemo(() => {
    const uniforms = createPlanetUniforms(
      sun.lightDirection,
      getPlanetAlbedo(gl, isCompact ? 768 : 1024)
    );

    uniforms.uOpacity.value = 0;

    return { ...uniforms, uTime: { value: 0 } };
  }, [gl, isCompact, sun.lightDirection]);
  const haloUniforms = useMemo(
    () => ({
      uCenter: { value: planet.center.clone() },
      uRadius: { value: planet.radius },
      uSunDirection: { value: sun.lightDirection.clone() },
      uDust: { value: new THREE.Color("#d9b79a") },
      uBlueHour: { value: new THREE.Color("#6f8faf") },
      uOpacity: { value: 0 },
    }),
    [planet.center, planet.radius, sun.lightDirection]
  );
  const sunUniforms = useMemo(
    () => ({
      uOpacity: { value: 0 },
      uCore: { value: new THREE.Color("#fff4e2") },
      uGlow: { value: new THREE.Color("#ffd9a0") },
    }),
    []
  );

  useFrame(({ camera }) => {
    const state = visibility.current;
    const opacity = state.scenery * state.intro;
    const isVisible = opacity > 0.001;

    for (const mesh of [planetRef.current, haloRef.current, sunRef.current]) {
      if (mesh) mesh.visible = isVisible;
    }

    if (!isVisible) return;

    if (planetMaterialRef.current) {
      planetMaterialRef.current.uniforms.uOpacity.value = opacity;
      planetMaterialRef.current.uniforms.uTime.value = state.time;
    }

    if (planetRef.current) planetRef.current.rotation.y = state.time * 0.004;

    if (haloMaterialRef.current) {
      haloMaterialRef.current.uniforms.uOpacity.value = opacity;
    }

    if (sunMaterialRef.current) {
      sunMaterialRef.current.uniforms.uOpacity.value = opacity;
    }

    // The sun is a billboard that always faces the camera.
    if (sunRef.current) sunRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <>
      <mesh
        ref={planetRef}
        position={planet.center}
        rotation={[0.5, 1.9, 0.25]}
        scale={1.002}
        visible={false}
      >
        <sphereGeometry
          args={[planet.radius, isCompact ? 96 : 144, isCompact ? 64 : 96]}
        />
        <shaderMaterial
          ref={planetMaterialRef}
          uniforms={planetUniforms}
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          transparent
        />
      </mesh>

      <mesh ref={haloRef} position={planet.center} visible={false}>
        <sphereGeometry args={[planet.radius * 1.08, 96, 64]} />
        <shaderMaterial
          ref={haloMaterialRef}
          uniforms={haloUniforms}
          vertexShader={haloVertexShader}
          fragmentShader={haloFragmentShader}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={sunRef} position={sun.position} visible={false}>
        <planeGeometry args={[sun.radius * 24, sun.radius * 24]} />
        <shaderMaterial
          ref={sunMaterialRef}
          uniforms={sunUniforms}
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

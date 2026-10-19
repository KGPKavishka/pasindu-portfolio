"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { GatewayLayerProps } from "./orbitalGatewayLayout";

const backdropVertexShader = /* glsl */ `
  varying vec3 vDirection;

  void main() {
    vDirection = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const backdropFragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  uniform vec3 uBase;
  uniform float uWeight;
  varying vec3 vDirection;

  void main() {
    vec3 direction = normalize(vDirection);
    // slate-950 overhead, pure black below, and exactly the fog colour in a
    // band around the horizon so fogged scenery never reads as a silhouette.
    vec3 color = direction.y > 0.0
      ? mix(uBase, uTop, smoothstep(0.1, 0.6, direction.y))
      : mix(uBase, uBottom, smoothstep(0.08, 0.5, -direction.y));

    gl_FragColor = vec4(mix(uBase, color, uWeight), 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Camera-following slate-950 → black void for the opening shot. It blends back
 * into the journey's scene background as the planet approach begins.
 */
export default function DeepVoidBackdrop({ visibility }: GatewayLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color("#020617") },
      uBottom: { value: new THREE.Color("#000000") },
      uBase: { value: new THREE.Color("#01040b") },
      uWeight: { value: 1 },
    }),
    []
  );

  useFrame(({ camera, scene }) => {
    const state = visibility.current;
    const mesh = meshRef.current;
    const material = materialRef.current;

    if (!mesh || !material) return;

    mesh.visible = state.backdrop > 0.001;
    if (!mesh.visible) return;

    mesh.position.copy(camera.position);
    material.uniforms.uWeight.value = state.backdrop;

    if (scene.background instanceof THREE.Color) {
      material.uniforms.uBase.value.copy(scene.background);
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={-100} frustumCulled={false}>
      <sphereGeometry args={[400, 32, 16]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={backdropVertexShader}
        fragmentShader={backdropFragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

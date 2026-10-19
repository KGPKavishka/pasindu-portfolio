"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import type { GatewayLayerProps } from "@/components/World/Space/orbitalGatewayLayout";

const rimVertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const rimFragmentShader = /* glsl */ `
  uniform vec3 uLightPosition;
  uniform vec3 uRimColor;
  uniform vec3 uAtmosphereColor;
  uniform float uStrength;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 normal = normalize(vWorldNormal);
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    vec3 lightDirection = normalize(uLightPosition - vWorldPosition);
    // Direction toward the quasar as seen on screen, so the rim forms a
    // crescent on the limb facing it even though the light is behind.
    vec3 screenLight = normalize(
      lightDirection - viewDirection * dot(lightDirection, viewDirection)
    );
    float facing = max(dot(normal, viewDirection), 0.0);
    float limb = 1.0 - facing;
    float towardLight = smoothstep(-0.15, 0.9, dot(normal, screenLight));

    vec3 color = uRimColor * pow(limb, 5.0) * towardLight * 1.5
      + uRimColor * pow(limb, 2.5) * towardLight * 0.1
      + uAtmosphereColor * pow(limb, 3.5) * 0.14;

    gl_FragColor = vec4(color * uStrength, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Back-lit atmospheric rim on the planet, driven by the quasar behind it.
 * A single additive shell instead of extra scene lights keeps it cheap.
 */
export default function PlanetRimLight({ layout, visibility }: GatewayLayerProps) {
  const { size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const segments = size.width < 768 ? 48 : 72;
  const uniforms = useMemo(
    () => ({
      uLightPosition: { value: layout.galaxy.position.clone() },
      uRimColor: { value: new THREE.Color("#ffe6bf") },
      uAtmosphereColor: { value: new THREE.Color("#22d3ee") },
      uStrength: { value: 0 },
    }),
    [layout.galaxy.position]
  );

  useFrame(() => {
    const strength = visibility.current.galaxy;

    if (meshRef.current) meshRef.current.visible = strength > 0.001;
    if (materialRef.current) materialRef.current.uniforms.uStrength.value = strength;
  });

  return (
    <mesh ref={meshRef} position={layout.planet.center} visible={false}>
      <sphereGeometry args={[layout.planet.radius * 1.004, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={rimVertexShader}
        fragmentShader={rimFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

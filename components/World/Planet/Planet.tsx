"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import {
  journeySunDirection,
  journeyWorld,
} from "@/components/Journey/journeyWorldConfig";
import { descent } from "@/components/World/Landing/landingConfig";
import {
  createPlanetUniforms,
  getPlanetAlbedo,
  planetFragmentShader,
  planetVertexShader,
} from "./planetShader";

/**
 * The planet the camera approaches after the orbit shot. Same baked surface and
 * lighting model as the orbit planet; it fades in as the orbit view fades out,
 * so the two read as one planet.
 */
export default function Planet() {
  const { size, gl } = useThree();
  const { progress } = useJourney();
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const isCompact = size.width < 768;
  const segments = isCompact ? 48 : 72;
  const radius = journeyWorld.planetRadius;
  const uniforms = useMemo(() => {
    const planetUniforms = createPlanetUniforms(
      new THREE.Vector3(...journeySunDirection),
      getPlanetAlbedo(gl, isCompact ? 768 : 1024)
    );

    planetUniforms.uOpacity.value = 0;

    return planetUniforms;
  }, [gl, isCompact]);

  useFrame((_, delta) => {
    const journeyProgress = progress.get();
    const fade = THREE.MathUtils.smoothstep(journeyProgress, 0.138, 0.154);
    // The camera has crossed the surface and the landing site has taken over
    // (all under the entry plasma): from here the planet is not drawn at all.
    const isVisible = fade > 0.001 && journeyProgress < descent.planetHidden;

    if (groupRef.current) groupRef.current.visible = isVisible;
    if (!isVisible) return;

    if (materialRef.current) materialRef.current.uniforms.uOpacity.value = fade;
    if (planetRef.current) planetRef.current.rotation.y += delta * 0.018;
  });

  return (
    <group
      ref={groupRef}
      position={[...journeyWorld.planet]}
      visible={false}
    >
      <mesh ref={planetRef} rotation={[0.5, 1.9, 0.25]}>
        <sphereGeometry args={[radius, segments, segments]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          transparent
        />
      </mesh>

      <mesh position={[-7.5, 2.8, -3]}>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshStandardMaterial color="#8a8279" roughness={0.95} />
      </mesh>
    </group>
  );
}

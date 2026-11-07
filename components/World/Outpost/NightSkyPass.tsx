"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { useJourney } from "@/components/Journey/JourneyController";
import { seededRandom } from "@/components/World/Orbit/orbitLayout";

const TRACK_SEGMENTS = 48;

/**
 * Dusk-to-Night sky over the outpost (Acts 13–14, progress 0.90 → 1.0):
 * - Stars emerge above the horizon as twilight deepens into night.
 * - The orbital station Pasindu left in Act 1 passes overhead along a high
 *   orbital arc as a bright moving star (docs/DESIGN_PLAN.md §1 & §2 Act 14).
 */
export default function NightSkyPass() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const isCompact = useThree((state) => state.size.width < 768);
  const starCount = isCompact ? 170 : 340;
  const warmStarCount = isCompact ? 45 : 90;
  const groupRef = useRef<THREE.Group>(null);
  const starsMaterialRef = useRef<THREE.PointsMaterial>(null);
  const warmStarsMaterialRef = useRef<THREE.PointsMaterial>(null);
  const stationGroupRef = useRef<THREE.Group>(null);
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const wingMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const trackMaterialRef = useRef<THREE.LineBasicMaterial>(null);

  const { coolPositions, warmPositions, trackGeometry } = useMemo(() => {
    const cool = new Float32Array(starCount * 3);
    const warm = new Float32Array(warmStarCount * 3);

    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      cool[i3] = (seededRandom(i * 3.1 + 11) - 0.5) * 96;
      cool[i3 + 1] = 0.4 + seededRandom(i * 5.7 + 29) * 32;
      cool[i3 + 2] = -302 - seededRandom(i * 7.3 + 53) * 55;
    }

    for (let i = 0; i < warmStarCount; i += 1) {
      const i3 = i * 3;
      warm[i3] = (seededRandom(i * 4.3 + 101) - 0.5) * 78;
      warm[i3 + 1] = 1.0 + seededRandom(i * 6.1 + 137) * 28;
      warm[i3 + 2] = -306 - seededRandom(i * 8.9 + 173) * 48;
    }

    const trackPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= TRACK_SEGMENTS; i += 1) {
      const u = (i / TRACK_SEGMENTS - 0.5) * 2; // -1 .. +1
      const x = u * 18;
      const y = 5.4 - u * u * 2.1 + u * 0.45;
      const z = -326 - Math.abs(u) * 4;
      trackPoints.push(new THREE.Vector3(x, y, z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(trackPoints);

    return {
      coolPositions: cool,
      warmPositions: warm,
      trackGeometry: geometry,
    };
  }, [starCount, warmStarCount]);

  useFrame(({ clock }) => {
    const p = progress.get();
    const duskStars = THREE.MathUtils.smoothstep(p, 0.9, 0.985);
    const nightPass = THREE.MathUtils.smoothstep(p, 0.955, 0.988);

    if (groupRef.current) {
      groupRef.current.visible = duskStars > 0.002;
    }
    if (duskStars <= 0.002) return;

    if (starsMaterialRef.current) {
      starsMaterialRef.current.opacity = 0.88 * duskStars;
    }
    if (warmStarsMaterialRef.current) {
      warmStarsMaterialRef.current.opacity = 0.72 * duskStars;
    }
    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = nightPass;
    }
    if (haloMaterialRef.current) {
      haloMaterialRef.current.opacity = 0.34 * nightPass;
    }
    if (wingMaterialRef.current) {
      wingMaterialRef.current.opacity = 0.75 * nightPass;
    }
    if (trackMaterialRef.current) {
      trackMaterialRef.current.opacity = 0.22 * nightPass;
    }

    if (stationGroupRef.current) {
      // Glide smoothly across the central orbital arc so it is always visible
      // in the upper visor on both wide desktop and narrow portrait viewports.
      const elapsed = reduceMotion ? 1.8 : clock.getElapsedTime();
      const u = Math.sin(elapsed * 0.22) * 0.18;
      const x = u * 18;
      const y = 5.4 - u * u * 2.1 + u * 0.45;
      const z = -326 - Math.abs(u) * 4;

      stationGroupRef.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      {/* Night sky starfield above the ridge horizon */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[coolPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={starsMaterialRef}
          color="#e9e6df"
          size={0.14}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          fog={false}
        />
      </points>

      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[warmPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={warmStarsMaterialRef}
          color="#fff4e2"
          size={0.22}
          sizeAttenuation
          transparent
          opacity={0}
          depthWrite={false}
          fog={false}
        />
      </points>

      {/* Subtle orbital ground-track arc across the night sky */}
      <lineSegments geometry={trackGeometry} frustumCulled={false}>
        <lineBasicMaterial
          ref={trackMaterialRef}
          color="#e8a33d"
          transparent
          opacity={0}
          depthWrite={false}
          fog={false}
        />
      </lineSegments>

      {/* The Orbital Station passing overhead as a sunlit moving star */}
      <group
        ref={stationGroupRef}
        position={[2.2, 5.3, -326]}
        rotation={[0, 0, -0.18]}
      >
        {/* Bright sunlit core (triggers subtle bloom at night) */}
        <mesh>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial
            ref={coreMaterialRef}
            color="#fff4e2"
            transparent
            opacity={0}
            fog={false}
          />
        </mesh>

        {/* Warm atmospheric glint halo */}
        <mesh>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial
            ref={haloMaterialRef}
            color="#e8a33d"
            transparent
            opacity={0}
            depthWrite={false}
            fog={false}
          />
        </mesh>

        {/* Tiny glinting solar wing silhouette */}
        <mesh>
          <boxGeometry args={[1.15, 0.04, 0.04]} />
          <meshBasicMaterial
            ref={wingMaterialRef}
            color="#fff4e2"
            transparent
            opacity={0}
            fog={false}
          />
        </mesh>
      </group>
    </group>
  );
}


"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { journeyWorld } from "@/components/Journey/journeyWorldConfig";

function seededRandom(seed: number) {
  const value = Math.sin(seed * 91.173) * 43758.5453;

  return value - Math.floor(value);
}

export default function CitySkyline() {
  const { size } = useThree();
  const buildingsRef = useRef<THREE.InstancedMesh>(null);
  const windowsRef = useRef<THREE.InstancedMesh>(null);
  const count = size.width < 768 ? 28 : 52;
  const buildings = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        const lane = Math.floor(index / 2);
        const width = 1.5 + seededRandom(index + 7) * 2.3;
        const height = 3.5 + seededRandom(index + 23) * 10;

        return {
          x: side * (8 + seededRandom(index + 41) * 22),
          y: height / 2,
          z: -lane * 5.8 - seededRandom(index + 61) * 3,
          width,
          height,
          depth: 1.8 + seededRandom(index + 83) * 2.8,
        };
      }),
    [count]
  );

  useEffect(() => {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();

    buildings.forEach((building, index) => {
      position.set(building.x, building.y, building.z);
      scale.set(building.width, building.height, building.depth);
      matrix.compose(position, quaternion, scale);
      buildingsRef.current?.setMatrixAt(index, matrix);

      position.set(
        building.x,
        building.y + building.height * 0.12,
        building.z + building.depth * 0.51
      );
      scale.set(building.width * 0.55, building.height * 0.38, 0.04);
      matrix.compose(position, quaternion, scale);
      windowsRef.current?.setMatrixAt(index, matrix);
    });

    if (buildingsRef.current) buildingsRef.current.instanceMatrix.needsUpdate = true;
    if (windowsRef.current) windowsRef.current.instanceMatrix.needsUpdate = true;
  }, [buildings]);

  return (
    <group position={[0, journeyWorld.groundY, -88]}>
      <instancedMesh ref={buildingsRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#050d14"
          roughness={0.64}
          metalness={0.55}
          emissive="#071d26"
          emissiveIntensity={0.22}
        />
      </instancedMesh>

      <instancedMesh ref={windowsRef} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.24} />
      </instancedMesh>
    </group>
  );
}
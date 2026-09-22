"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { scrollState } from "../Shared/ScrollController";

const rackPositions = [
  [-1.6, 0, -0.7],
  [0, 0, -0.7],
  [1.6, 0, -0.7],
  [-0.8, 0, 1.1],
  [0.8, 0, 1.1],
] as const;

export default function DataCenter() {
  const groupRef = useRef<THREE.Group>(null);
  const streamRef = useRef<THREE.Mesh>(null);
  const streamTarget = useRef(new THREE.Vector3());
  const connection = useMemo(
    () =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.1, 2.3, 0),
        new THREE.Vector3(0, 3.6, 0),
        new THREE.Vector3(2.1, 2.3, 0),
      ]),
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }

    const activation = THREE.MathUtils.smoothstep(
      scrollState.current,
      0.64,
      0.72,
    );
    const scale = THREE.MathUtils.lerp(0.16, 1, activation);
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.05),
    );

    if (streamRef.current) {
      const journey = (clock.getElapsedTime() * 0.22) % 1;
      streamTarget.current.set(
        -2.1 + journey * 4.2,
        2.3 + Math.sin(journey * Math.PI) * 1.3,
        0,
      );
      streamRef.current.position.copy(streamTarget.current);
      streamRef.current.visible = activation > 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[-4, 0, -48]}>
      <mesh>
        <boxGeometry args={[6.2, 0.35, 4.4]} />
        <meshStandardMaterial
          color="#061018"
          metalness={0.72}
          roughness={0.3}
        />
      </mesh>
      {rackPositions.map(([x, y, z]) => (
        <group key={`${x}-${z}`} position={[x, y, z]}>
          <mesh position={[0, 1.45, 0]}>
            <boxGeometry args={[0.72, 2.9, 0.85]} />
            <meshStandardMaterial
              color="#07141d"
              metalness={0.8}
              roughness={0.22}
            />
          </mesh>
          {[0.55, 1.15, 1.75, 2.35].map((height) => (
            <mesh key={height} position={[0, height, 0.44]}>
              <boxGeometry args={[0.5, 0.09, 0.03]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
            </mesh>
          ))}
        </group>
      ))}
      <primitive
        object={
          new THREE.Line(
            connection,
            new THREE.LineBasicMaterial({
              color: "#22d3ee",
              transparent: true,
              opacity: 0.5,
            }),
          )
        }
      />
      <mesh ref={streamRef}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial color="#67e8f9" />
      </mesh>
    </group>
  );
}

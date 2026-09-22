"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { scrollState } from "../Shared/ScrollController";

type SignalProps = {
  color: string;
  start: [number, number, number];
  end: [number, number, number];
  startProgress: number;
  speed: number;
};

function RouteSignal({ color, start, end, startProgress, speed }: SignalProps) {
  const signalRef = useRef<THREE.Mesh>(null);
  const target = useRef(new THREE.Vector3());

  useFrame(({ clock }) => {
    if (!signalRef.current) {
      return;
    }

    const activation = THREE.MathUtils.smoothstep(
      scrollState.current,
      startProgress,
      startProgress + 0.08,
    );
    const journey = (clock.getElapsedTime() * speed) % 1;

    target.current
      .set(start[0], start[1], start[2])
      .lerp(new THREE.Vector3(end[0], end[1], end[2]), journey);

    signalRef.current.position.copy(target.current);
    signalRef.current.visible = activation > 0.01;
    signalRef.current.scale.setScalar(THREE.MathUtils.lerp(0.1, 1, activation));
  });

  return (
    <mesh ref={signalRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function Route({
  color,
  points,
  startProgress,
}: {
  color: string;
  points: [number, number, number][];
  startProgress: number;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const line = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    );
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
    });

    return new THREE.Line(geometry, material);
  }, [color, points]);

  useFrame(() => {
    const activation = THREE.MathUtils.smoothstep(
      scrollState.current,
      startProgress,
      startProgress + 0.08,
    );

    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = activation * 0.65;
      lineRef.current.visible = activation > 0.01;
    }
  });

  return <primitive ref={lineRef} object={line} />;
}

export default function CityEnergyRoutes() {
  return (
    <group position={[0, 0.2, 0]}>
      <Route
        color="#22d3ee"
        points={[
          [0, 0, 0],
          [-0.2, 0, 2.1],
        ]}
        startProgress={0.28}
      />
      <Route
        color="#fbbf24"
        points={[
          [0, 0, 0],
          [-2.7, 0, 0.1],
        ]}
        startProgress={0.34}
      />
      <Route
        color="#a855f7"
        points={[
          [0, 0, 0],
          [2.7, 0, 0.1],
        ]}
        startProgress={0.38}
      />
      <Route
        color="#10b981"
        points={[
          [0, 0, 0],
          [1, 0, 1.55],
        ]}
        startProgress={0.42}
      />

      <RouteSignal
        color="#22d3ee"
        start={[0, 0.03, 0]}
        end={[-0.2, 0.03, 2.1]}
        startProgress={0.28}
        speed={0.24}
      />
      <RouteSignal
        color="#fbbf24"
        start={[0, 0.03, 0]}
        end={[-2.7, 0.03, 0.1]}
        startProgress={0.34}
        speed={0.4}
      />
      <RouteSignal
        color="#a855f7"
        start={[0, 0.03, 0]}
        end={[2.7, 0.03, 0.1]}
        startProgress={0.38}
        speed={0.32}
      />
      <RouteSignal
        color="#10b981"
        start={[0, 0.03, 0]}
        end={[1, 0.03, 1.55]}
        startProgress={0.42}
        speed={0.2}
      />
    </group>
  );
}

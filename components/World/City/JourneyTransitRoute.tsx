"use client";

import {
  journeyLandmarkBranches,
  journeyTransitPoints,
  journeyWorld,
} from "@/components/Journey/journeyWorldConfig";

const routeStartZ = journeyTransitPoints[0][2];
const routeEndZ = journeyTransitPoints[journeyTransitPoints.length - 1][2];
const routeLength = Math.abs(routeEndZ - routeStartZ);
const routeCenterZ = (routeStartZ + routeEndZ) / 2;

function DistrictBranch({ point }: { point: readonly [number, number, number] }) {
  const length = Math.abs(point[0]);

  return (
    <group position={[point[0] / 2, journeyWorld.groundY + 0.06, point[2]]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[3.2, 0.1, length]} />
        <meshStandardMaterial color="#040d13" metalness={0.42} roughness={0.68} />
      </mesh>
      <mesh position={[0, 0.07, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.06, 0.025, length * 0.9]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.38} />
      </mesh>
    </group>
  );
}

export default function JourneyTransitRoute() {
  return (
    <group>
      <mesh position={[0, journeyWorld.groundY + 0.06, routeCenterZ]}>
        <boxGeometry args={[6.4, 0.12, routeLength]} />
        <meshStandardMaterial color="#030a10" metalness={0.38} roughness={0.74} />
      </mesh>

      {[-3.12, 3.12].map((x) => (
        <mesh key={x} position={[x, journeyWorld.groundY + 0.14, routeCenterZ]}>
          <boxGeometry args={[0.07, 0.035, routeLength]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.48} />
        </mesh>
      ))}

      <mesh position={[0, journeyWorld.groundY + 0.14, routeCenterZ]}>
        <boxGeometry args={[0.045, 0.025, routeLength]} />
        <meshBasicMaterial color="#0e7490" transparent opacity={0.34} />
      </mesh>

      {journeyLandmarkBranches.map(({ id, point }) => (
        <group key={id}>
          <DistrictBranch point={point} />
          <mesh
            position={[0, journeyWorld.groundY + 0.16, point[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[1.05, 1.12, 24]} />
            <meshBasicMaterial color="#67e8f9" transparent opacity={0.34} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
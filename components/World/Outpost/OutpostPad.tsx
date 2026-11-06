import { m } from "./outpostMaterials";

/** Compacted landing slab every structure stands on, with a painted edge line. */
export default function OutpostPad({ radius = 7.5 }: { radius?: number }) {
  return (
    <group>
      <mesh position={[0, 0.075, 0]} material={m.pad}>
        <cylinderGeometry args={[radius, radius + 0.35, 0.15, 40]} />
      </mesh>
      <mesh
        position={[0, 0.16, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={m.amber}
      >
        <ringGeometry args={[radius - 0.85, radius - 0.72, 64]} />
      </mesh>
    </group>
  );
}

/** Simple mast with a work-light head (the lamp stays dark in daylight). */
export function WorkLightMast({
  position,
  height = 3.6,
}: {
  position: readonly [number, number, number];
  height?: number;
}) {
  return (
    <group position={[position[0], position[1], position[2]]}>
      <mesh position={[0, height / 2, 0]} material={m.aluminium}>
        <cylinderGeometry args={[0.07, 0.1, height, 8]} />
      </mesh>
      <mesh position={[0, height + 0.1, 0.1]} material={m.darkPanel}>
        <boxGeometry args={[0.55, 0.3, 0.3]} />
      </mesh>
      <mesh position={[0, height + 0.1, 0.27]} material={m.panelShade}>
        <boxGeometry args={[0.42, 0.2, 0.04]} />
      </mesh>
    </group>
  );
}


import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;
const ARCH_R = 3.9;

function SpeakerCabinet({
  position,
  size = [1.2, 1.6, 1.1],
}: {
  position: readonly [number, number, number];
  size?: readonly [number, number, number];
}) {
  const faceZ = size[2] / 2 + 0.02;

  return (
    <group position={[position[0], position[1], position[2]]}>
      <mesh material={m.darkPanel}>
        <boxGeometry args={[size[0], size[1], size[2]]} />
      </mesh>
      <mesh position={[0, -size[1] * 0.12, faceZ]} rotation={[HALF_PI, 0, 0]} material={m.rubber}>
        <cylinderGeometry args={[size[0] * 0.34, size[0] * 0.28, 0.1, 20]} />
      </mesh>
      <mesh position={[0, -size[1] * 0.12, faceZ + 0.03]} material={m.aluminium}>
        <torusGeometry args={[size[0] * 0.34, 0.03, 8, 28]} />
      </mesh>
      <mesh position={[0, size[1] * 0.28, faceZ + 0.02]} material={m.foilGold}>
        <torusGeometry args={[size[0] * 0.13, 0.022, 8, 20]} />
      </mesh>
      <mesh position={[0, size[1] * 0.28, faceZ]} rotation={[HALF_PI, 0, 0]} material={m.rubber}>
        <cylinderGeometry args={[size[0] * 0.13, size[0] * 0.09, 0.08, 14]} />
      </mesh>
    </group>
  );
}

/** HGR-03 — KV Audio Equipment Hangar: an arched hangar housing audio gear, PA towers outside. */
export default function EquipmentHangar() {
  return (
    <group>
      <OutpostPad radius={6.8} />

      {/* Arched shell, open at both ends */}
      <mesh position={[0, 0.15, -1]} rotation={[HALF_PI, 0, 0]} material={m.aluminium}>
        <cylinderGeometry args={[ARCH_R, ARCH_R, 8, 36, 1, true, HALF_PI, Math.PI]} />
      </mesh>
      {/* Ribs and front frame */}
      {[-4.4, -2.4, -0.4, 1.6].map((z) => (
        <mesh key={z} position={[0, 0.15, z]} material={m.panelWhite}>
          <torusGeometry args={[ARCH_R + 0.03, 0.09, 8, 36, Math.PI]} />
        </mesh>
      ))}
      <mesh position={[0, 0.15, 3]} material={m.foilGold}>
        <torusGeometry args={[ARCH_R + 0.05, 0.24, 10, 40, Math.PI]} />
      </mesh>
      {/* Back wall and floor */}
      <mesh position={[0, 0.15, -5]} material={m.panelShade}>
        <circleGeometry args={[ARCH_R, 36, 0, Math.PI]} />
      </mesh>
      <mesh position={[0, 0.17, -1]} rotation={[-HALF_PI, 0, 0]} material={m.darkPanel}>
        <planeGeometry args={[7.4, 7.8]} />
      </mesh>
      {/* Orange base markings at the door posts */}
      {[-ARCH_R, ARCH_R].map((x) => (
        <mesh key={x} position={[x, 0.55, 3]} material={m.orange}>
          <boxGeometry args={[0.5, 0.8, 0.5]} />
        </mesh>
      ))}

      {/* Rental inventory inside: speaker stacks and a mixing console */}
      <SpeakerCabinet position={[-2.4, 1, -3.4]} size={[1.4, 1.8, 1.2]} />
      <SpeakerCabinet position={[-0.8, 1, -3.4]} size={[1.4, 1.8, 1.2]} />
      <SpeakerCabinet position={[0.8, 1, -3.4]} size={[1.4, 1.8, 1.2]} />
      <SpeakerCabinet position={[2.4, 1, -3.4]} size={[1.4, 1.8, 1.2]} />
      <SpeakerCabinet position={[-1.6, 2.7, -3.4]} size={[1.4, 1.5, 1.2]} />
      <SpeakerCabinet position={[1.6, 2.7, -3.4]} size={[1.4, 1.5, 1.2]} />
      <mesh position={[0, 0.65, -0.9]} rotation={[0.2, 0, 0]} material={m.aluminiumDark}>
        <boxGeometry args={[2.4, 0.7, 1]} />
      </mesh>
      <mesh position={[0, 1.02, -0.85]} rotation={[0.2, 0, 0]} material={m.darkPanel}>
        <boxGeometry args={[2.2, 0.06, 0.8]} />
      </mesh>
      {[-0.8, -0.4, 0, 0.4, 0.8].map((x) => (
        <mesh key={x} position={[x, 1.07, -0.85]} material={m.amber}>
          <boxGeometry args={[0.08, 0.06, 0.4]} />
        </mesh>
      ))}

      {/* PA towers flanking the entrance */}
      {[-4.7, 4.7].map((x) => (
        <group key={x} position={[x, 0.15, 2.8]} rotation={[0, x < 0 ? 0.22 : -0.22, 0]}>
          <SpeakerCabinet position={[0, 0.9, 0]} />
          <SpeakerCabinet position={[0, 2.55, 0]} size={[1.1, 1.5, 1]} />
        </group>
      ))}

      <WorkLightMast position={[-5.5, 0.15, -1.2]} height={4} />
    </group>
  );
}


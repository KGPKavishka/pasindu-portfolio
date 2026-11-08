import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;
const RING_X = [-2.4, -0.8, 0.8, 2.4] as const;
const CYL_Y = 2.45;
const CYL_Z = -0.5;

/** MOD-01 — HealthBridge Med-Lab: a pressurised research module with an airlock. */
export default function MedLab() {
  return (
    <group>
      <OutpostPad radius={7.5} />

      {/* Cradles under the module */}
      {[-2.6, 2.6].map((x) => (
        <mesh key={x} position={[x, 0.55, CYL_Z]} material={m.darkPanel}>
          <boxGeometry args={[0.8, 0.8, 3]} />
        </mesh>
      ))}

      {/* Pressure hull + end domes */}
      <mesh position={[0, CYL_Y, CYL_Z]} rotation={[0, 0, HALF_PI]} material={m.panelWhite}>
        <cylinderGeometry args={[1.9, 1.9, 7.4, 36]} />
      </mesh>
      <mesh position={[3.7, CYL_Y, CYL_Z]} rotation={[0, 0, -HALF_PI]} material={m.panelWhite}>
        <sphereGeometry args={[1.9, 28, 14, 0, Math.PI * 2, 0, HALF_PI]} />
      </mesh>
      <mesh position={[-3.7, CYL_Y, CYL_Z]} rotation={[0, 0, HALF_PI]} material={m.panelWhite}>
        <sphereGeometry args={[1.9, 28, 14, 0, Math.PI * 2, 0, HALF_PI]} />
      </mesh>

      {/* Structural bands */}
      {RING_X.map((x) => (
        <mesh key={x} position={[x, CYL_Y, CYL_Z]} rotation={[0, 0, HALF_PI]} material={m.aluminium}>
          <cylinderGeometry args={[1.94, 1.94, 0.14, 36]} />
        </mesh>
      ))}

      {/* Observation windows along the hull */}
      {[-1.6, 0, 1.6].map((x) => (
        <mesh key={x} position={[x, CYL_Y + 0.55, CYL_Z + 1.78]} rotation={[0.3, 0, 0]} material={m.windowGlass}>
          <boxGeometry args={[0.9, 0.5, 0.08]} />
        </mesh>
      ))}

      {/* Airlock */}
      <mesh position={[0, 1.35, 2.4]} material={m.panelShade}>
        <boxGeometry args={[2.5, 2.4, 2.4]} />
      </mesh>
      <mesh position={[0, 1.2, 3.62]} material={m.darkPanel}>
        <boxGeometry args={[1.2, 1.8, 0.08]} />
      </mesh>
      <mesh position={[0, 2.2, 3.64]} material={m.orange}>
        <boxGeometry args={[1.5, 0.14, 0.08]} />
      </mesh>
      <mesh position={[0, 2.62, 2.4]} material={m.aluminium}>
        <boxGeometry args={[2.7, 0.14, 2.6]} />
      </mesh>

      {/* Sample-return antenna on the hull */}
      <mesh position={[-1.5, 4.5, CYL_Z]} material={m.aluminium}>
        <cylinderGeometry args={[0.07, 0.07, 1.3, 8]} />
      </mesh>
      <mesh position={[-1.5, 5.25, CYL_Z + 0.1]} rotation={[0.6, 0, 0]} material={m.foilGold}>
        <sphereGeometry args={[1.1, 28, 10, 0, Math.PI * 2, 0, Math.PI / 3]} />
      </mesh>

      {/* Medical sign board: white panel, orange cross */}
      <group position={[5, 0, 3.4]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 1.2, 0]} material={m.aluminium}>
          <cylinderGeometry args={[0.07, 0.07, 2.4, 8]} />
        </mesh>
        <mesh position={[0, 2.6, 0]} material={m.panelWhite}>
          <boxGeometry args={[1.8, 1.8, 0.1]} />
        </mesh>
        <mesh position={[0, 2.6, 0.07]} material={m.orange}>
          <boxGeometry args={[1.1, 0.34, 0.06]} />
        </mesh>
        <mesh position={[0, 2.6, 0.07]} material={m.orange}>
          <boxGeometry args={[0.34, 1.1, 0.06]} />
        </mesh>
      </group>

      {/* Supply tanks behind the module */}
      {[3.2, 4.6].map((x) => (
        <mesh key={x} position={[x, 1.35, -3.6]} material={m.panelWhite}>
          <cylinderGeometry args={[0.7, 0.7, 2.4, 20]} />
        </mesh>
      ))}
      <mesh position={[3.9, 2.7, -3.6]} rotation={[0, 0, HALF_PI]} material={m.aluminium}>
        <cylinderGeometry args={[0.1, 0.1, 1.8, 8]} />
      </mesh>

      <WorkLightMast position={[-5.2, 0.15, 1.6]} />
    </group>
  );
}


import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;
const DOME_R = 4.2;
const DOME_Z = -0.5;
const ROWS = [-2.4, -0.7, 1];
const PLANT_X = [-3, -1.8, -0.6, 0.6, 1.8, 3];

/** BIO-04 — StoryBloom Greenhouse: a glazed dome of growing beds under warm grow lights. */
export default function Greenhouse() {
  return (
    <group>
      <OutpostPad radius={7.2} />

      {/* Dome: glazing plus an aluminium lattice, on a base ring */}
      <mesh position={[0, 0.3, DOME_Z]} material={m.aluminium}>
        <cylinderGeometry args={[DOME_R + 0.1, DOME_R + 0.2, 0.3, 40]} />
      </mesh>
      <mesh position={[0, 0.4, DOME_Z]} material={m.glassDome}>
        <sphereGeometry args={[DOME_R, 40, 20, 0, Math.PI * 2, 0, HALF_PI]} />
      </mesh>
      <mesh position={[0, 0.4, DOME_Z]} material={m.domeFrame}>
        <sphereGeometry args={[DOME_R + 0.03, 14, 7, 0, Math.PI * 2, 0, HALF_PI]} />
      </mesh>

      {/* Growing beds with plants */}
      {ROWS.map((z, row) => (
        <group key={z} position={[0, 0.45, z]}>
          <mesh position={[0, 0.2, 0]} material={m.panelShade}>
            <boxGeometry args={[7, 0.5, 0.95]} />
          </mesh>
          <mesh position={[0, 0.48, 0]} material={m.soil}>
            <boxGeometry args={[6.8, 0.08, 0.8]} />
          </mesh>
          {PLANT_X.map((x, index) => {
            const scale = 0.85 + ((index * 3 + row * 2) % 5) * 0.12;

            return (
              <mesh
                key={x}
                position={[x, 0.5 + 0.42 * scale, 0]}
                scale={[1, 1.3 * scale, 1]}
                material={(index + row) % 2 === 0 ? m.plantLight : m.plantDark}
              >
                <sphereGeometry args={[0.38, 10, 8]} />
              </mesh>
            );
          })}
          {/* Grow-light bar overhead */}
          <mesh position={[0, 2.6 - row * 0.15, 0]} material={m.growLight}>
            <boxGeometry args={[6.2, 0.07, 0.22]} />
          </mesh>
        </group>
      ))}

      {/* Airlock vestibule */}
      <mesh position={[0, 1.35, 4.4]} material={m.panelWhite}>
        <boxGeometry args={[2.2, 2.4, 2]} />
      </mesh>
      <mesh position={[0, 1.2, 5.42]} material={m.darkPanel}>
        <boxGeometry args={[1.1, 1.8, 0.08]} />
      </mesh>
      <mesh position={[0, 2.25, 5.44]} material={m.orange}>
        <boxGeometry args={[1.4, 0.14, 0.08]} />
      </mesh>

      {/* Water tank and folding solar panel */}
      <mesh position={[-5.4, 1.35, -1.4]} material={m.panelWhite}>
        <cylinderGeometry args={[0.9, 0.9, 2.4, 24]} />
      </mesh>
      <mesh position={[-4.4, 0.8, -1.4]} rotation={[0, 0, HALF_PI]} material={m.aluminium}>
        <cylinderGeometry args={[0.09, 0.09, 1.6, 8]} />
      </mesh>
      <group position={[5.4, 1.3, -1.2]} rotation={[-0.5, -0.2, 0]}>
        <mesh material={m.aluminium}>
          <boxGeometry args={[2.4, 0.1, 1.5]} />
        </mesh>
        <mesh position={[0, 0.06, 0]} material={m.solarCell}>
          <boxGeometry args={[2.25, 0.04, 1.35]} />
        </mesh>
      </group>
      <mesh position={[5.4, 0.65, -1.2]} material={m.aluminium}>
        <cylinderGeometry args={[0.07, 0.07, 1.3, 8]} />
      </mesh>

      <WorkLightMast position={[5.2, 0.15, 3.2]} height={3.4} />
    </group>
  );
}


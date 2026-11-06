import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;
const WHEEL_Z = [-0.42, 0, 0.42] as const;

function Rover() {
  return (
    <group position={[0, 0, 5.4]} rotation={[0, 0.06, 0]}>
      <mesh position={[0, 0.78, 0]} material={m.panelWhite}>
        <boxGeometry args={[1.5, 0.5, 1.4]} />
      </mesh>
      <mesh position={[0, 1.2, 0.3]} material={m.windowGlass}>
        <boxGeometry args={[1.1, 0.4, 0.6]} />
      </mesh>
      <mesh position={[0, 0.58, 0.72]} material={m.orange}>
        <boxGeometry args={[1.5, 0.1, 0.06]} />
      </mesh>
      {[-0.95, 0.95].flatMap((x) =>
        WHEEL_Z.map((z) => (
          <mesh
            key={`${x}-${z}`}
            position={[x, 0.36, z]}
            rotation={[0, 0, HALF_PI]}
            material={m.rubber}
          >
            <cylinderGeometry args={[0.36, 0.36, 0.3, 14]} />
          </mesh>
        ))
      )}
      <mesh position={[-0.4, 1.7, -0.4]} material={m.aluminium}>
        <cylinderGeometry args={[0.03, 0.03, 1, 6]} />
      </mesh>
      <mesh position={[0.4, 1.55, -0.45]} rotation={[0.5, 0, 0]} material={m.foilGold}>
        <sphereGeometry args={[0.32, 14, 6, 0, Math.PI * 2, 0, Math.PI / 3]} />
      </mesh>
    </group>
  );
}

/** DEP-02 — Ezy Map Logistics Depot: a cargo warehouse with rover tracks leading out. */
export default function LogisticsDepot() {
  return (
    <group>
      <OutpostPad radius={6.8} />

      {/* Warehouse shell */}
      <mesh position={[0, 1.75, -1]} material={m.aluminium}>
        <boxGeometry args={[7.8, 3.2, 5.2]} />
      </mesh>
      <mesh position={[0, 3.5, -1]} material={m.panelWhite}>
        <boxGeometry args={[8.1, 0.25, 5.5]} />
      </mesh>
      {/* Corrugation ribs either side of the door */}
      {[-3.4, -2.8, -2.2, 2.2, 2.8, 3.4].map((x) => (
        <mesh key={x} position={[x, 1.75, 1.64]} material={m.aluminiumDark}>
          <boxGeometry args={[0.14, 3.1, 0.08]} />
        </mesh>
      ))}

      {/* Roll-up cargo door with hazard markings */}
      <mesh position={[0, 1.4, 1.64]} material={m.darkPanel}>
        <boxGeometry args={[3.4, 2.5, 0.1]} />
      </mesh>
      <mesh position={[0, 2.78, 1.68]} material={m.orange}>
        <boxGeometry args={[3.7, 0.2, 0.1]} />
      </mesh>
      {[-1.8, 1.8].map((x) => (
        <mesh key={x} position={[x, 1.5, 1.68]} material={m.orange}>
          <boxGeometry args={[0.14, 2.6, 0.1]} />
        </mesh>
      ))}

      {/* Loading ramp */}
      <mesh position={[0, 0.3, 3.0]} rotation={[0.09, 0, 0]} material={m.aluminiumDark}>
        <boxGeometry args={[3.4, 0.14, 2.5]} />
      </mesh>

      {/* Stacked cargo containers */}
      <mesh position={[-5.1, 0.8, 0.6]} material={m.panelShade}>
        <boxGeometry args={[2.2, 1.3, 1.2]} />
      </mesh>
      <mesh position={[-5.1, 2.1, 0.6]} material={m.amber}>
        <boxGeometry args={[2.2, 1.3, 1.2]} />
      </mesh>
      <mesh position={[-5.1, 0.8, 2.0]} material={m.panelWhite}>
        <boxGeometry args={[2.2, 1.3, 1.2]} />
      </mesh>
      <mesh position={[-5.2, 0.8, 3.3]} rotation={[0, 0.2, 0]} material={m.aluminium}>
        <boxGeometry args={[1.3, 1.3, 1.2]} />
      </mesh>

      {/* Fuel tanks */}
      {[-0.65, 0.65].map((z) => (
        <mesh key={z} position={[5.2, 0.85, z - 1]} rotation={[HALF_PI, 0, 0]} material={m.panelWhite}>
          <cylinderGeometry args={[0.65, 0.65, 2.1, 20]} />
        </mesh>
      ))}

      <Rover />

      {/* Rover tracks: on the slab, then out across the regolith */}
      {[-0.95, 0.95].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.165, 4.9]} rotation={[-HALF_PI, 0, 0]} material={m.trackMark}>
            <planeGeometry args={[0.3, 6.2]} />
          </mesh>
          <mesh position={[x + 0.4, 0.035, 19]} rotation={[-HALF_PI, 0, -0.03]} material={m.trackMark}>
            <planeGeometry args={[0.3, 24]} />
          </mesh>
        </group>
      ))}

      <WorkLightMast position={[4.8, 0.15, 3.8]} height={4} />
    </group>
  );
}


import { contactItems } from "@/data/contactData";
import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;
const MAST_RINGS = [2.2, 3.4, 4.6, 5.8, 7.0];

/**
 * COM-09 — Long-Range Comms Mast: a deep-space uplink tower and transceiver
 * bunker at dusk, with a high-gain parabolic dish aimed toward orbit and 5
 * channel terminals driven by `contactItems` from `data/contactData.ts`.
 */
export default function CommsMast() {
  return (
    <group>
      <OutpostPad radius={7.0} />

      {/* Dusk fill light on the mast and transceiver shelter */}
      <pointLight
        position={[1.8, 3.8, 2.6]}
        color="#ffd9a6"
        intensity={3.6}
        distance={11}
        decay={1.6}
      />

      {/* Base transceiver bunker & equipment shelter */}
      <mesh position={[0, 0.95, -0.2]} material={m.panelWhite}>
        <boxGeometry args={[3.4, 1.6, 2.6]} />
      </mesh>
      <mesh position={[0, 0.25, -0.2]} material={m.foilGold}>
        <boxGeometry args={[3.52, 0.24, 2.72]} />
      </mesh>
      <mesh position={[0, 1.8, -0.2]} material={m.aluminiumDark}>
        <boxGeometry args={[3.56, 0.14, 2.76]} />
      </mesh>

      {/* Bunker service hatch & International Orange safety header */}
      <mesh position={[0, 0.82, 1.12]} material={m.darkPanel}>
        <boxGeometry args={[0.92, 1.24, 0.06]} />
      </mesh>
      <mesh position={[0, 1.54, 1.13]} material={m.orange}>
        <boxGeometry args={[1.25, 0.12, 0.08]} />
      </mesh>

      {/* Warm illuminated status strip on the shelter front */}
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 1.22, 1.12]} material={m.growLight}>
          <boxGeometry args={[0.52, 0.14, 0.05]} />
        </mesh>
      ))}

      {/* Main vertical lattice comms mast (4 corner legs + horizontal collar rings) */}
      {[
        [-0.38, -0.38],
        [0.38, -0.38],
        [-0.38, 0.38],
        [0.38, 0.38],
      ].map(([x, z], index) => (
        <mesh
          key={index}
          position={[x, 4.6, z - 0.2]}
          material={m.aluminium}
        >
          <cylinderGeometry args={[0.055, 0.075, 5.8, 8]} />
        </mesh>
      ))}

      {/* Central waveguide core conduit */}
      <mesh position={[0, 4.7, -0.2]} material={m.aluminiumDark}>
        <cylinderGeometry args={[0.14, 0.18, 6.0, 16]} />
      </mesh>

      {/* Horizontal structural mast rings */}
      {MAST_RINGS.map((y) => (
        <mesh key={y} position={[0, y, -0.2]} material={m.aluminiumDark}>
          <boxGeometry args={[0.88, 0.07, 0.88]} />
        </mesh>
      ))}

      {/* Primary High-Gain Parabolic Dish Antenna aimed up toward orbit */}
      <group position={[0, 4.35, 0.55]} rotation={[-0.62, 0.18, 0]}>
        {/* Rear gold thermal hub */}
        <mesh position={[0, -0.18, 0]} material={m.foilGold}>
          <cylinderGeometry args={[0.52, 0.42, 0.36, 20]} />
        </mesh>
        {/* Main parabolic dish reflector */}
        <mesh material={m.panelWhite}>
          <cylinderGeometry args={[1.65, 0.48, 0.42, 32]} />
        </mesh>
        {/* Dish rim ring */}
        <mesh
          position={[0, 0.2, 0]}
          rotation={[HALF_PI, 0, 0]}
          material={m.aluminiumDark}
        >
          <torusGeometry args={[1.65, 0.045, 8, 32]} />
        </mesh>
        {/* Sub-reflector feed horn & quadruped struts */}
        <mesh position={[0, 0.88, 0]} material={m.aluminiumDark}>
          <cylinderGeometry args={[0.04, 0.08, 1.35, 12]} />
        </mesh>
        <mesh position={[0, 1.56, 0]} material={m.orange}>
          <cylinderGeometry args={[0.18, 0.14, 0.14, 16]} />
        </mesh>
      </group>

      {/* Secondary medium-gain dish on the upper-left flank */}
      <group position={[-0.85, 6.1, -0.2]} rotation={[-0.48, -0.35, 0]}>
        <mesh material={m.panelWhite}>
          <cylinderGeometry args={[0.78, 0.22, 0.24, 24]} />
        </mesh>
        <mesh position={[0, 0.45, 0]} material={m.amber}>
          <sphereGeometry args={[0.09, 10, 10]} />
        </mesh>
      </group>

      {/* Masthead omni-directional array & aviation warning beacon */}
      <mesh position={[0, 7.65, -0.2]} material={m.orange}>
        <cylinderGeometry args={[0.22, 0.22, 0.28, 16]} />
      </mesh>
      <mesh position={[0, 8.35, -0.2]} material={m.aluminium}>
        <cylinderGeometry args={[0.025, 0.04, 1.25, 8]} />
      </mesh>
      <mesh position={[0, 8.98, -0.2]} material={m.growLight}>
        <sphereGeometry args={[0.11, 12, 12]} />
      </mesh>

      {/* 5 Uplink Channel Terminal Pedestals around the forward apron (from data/contactData.ts) */}
      {contactItems.map((item, index) => {
        const t = index / (contactItems.length - 1);
        const angle = -1.1 + t * 2.2;
        const radius = 4.6;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - 0.1;

        return (
          <group
            key={item.id}
            position={[x, 0.15, z]}
            rotation={[0, -angle * 0.6, 0]}
          >
            {/* Pedestal cabinet */}
            <mesh position={[0, 0.52, 0]} material={m.darkPanel}>
              <boxGeometry args={[0.54, 1.04, 0.44]} />
            </mesh>
            {/* Brushed aluminium top cap */}
            <mesh position={[0, 1.06, 0]} material={m.aluminium}>
              <boxGeometry args={[0.58, 0.08, 0.48]} />
            </mesh>
            {/* Active channel indicator bar */}
            <mesh
              position={[0, 0.62, 0.23]}
              material={item.id === "resume" ? m.orange : m.amber}
            >
              <boxGeometry args={[0.32, 0.42, 0.03]} />
            </mesh>
            {/* Short helical uplink antenna */}
            <mesh position={[0, 1.32, 0]} material={m.aluminiumDark}>
              <cylinderGeometry args={[0.035, 0.045, 0.45, 8]} />
            </mesh>
          </group>
        );
      })}

      <WorkLightMast position={[-4.4, 0.15, 2.7]} height={3.8} />
    </group>
  );
}


import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;
const WINDOW_ANGLES = [-0.55, -0.18, 0.18, 0.55] as const;

/**
 * HAB-05 — Crew Habitat (Act 9: Pure Heart Family internship).
 * A two-deck pressurised surface habitat module with an airlock tunnel,
 * ECLSS life-support tanks, radiator wings, and warm crew viewports.
 */
export default function CrewHabitat() {
  return (
    <group>
      <OutpostPad radius={6.8} />

      {/* Gold thermal blanket skirt around the base ring */}
      <mesh position={[0, 0.42, -0.6]} material={m.foilGold}>
        <cylinderGeometry args={[2.95, 3.1, 0.55, 36]} />
      </mesh>

      {/* Main lower pressure hull */}
      <mesh position={[0, 1.95, -0.6]} material={m.panelWhite}>
        <cylinderGeometry args={[2.85, 2.85, 2.6, 36]} />
      </mesh>

      {/* Mid-deck structural stiffening ring */}
      <mesh position={[0, 3.28, -0.6]} material={m.aluminium}>
        <cylinderGeometry args={[2.94, 2.94, 0.18, 36]} />
      </mesh>

      {/* Upper crew deck + shallow dome roof */}
      <mesh position={[0, 4.05, -0.6]} material={m.panelShade}>
        <cylinderGeometry args={[2.45, 2.8, 1.35, 36]} />
      </mesh>
      <mesh position={[0, 4.72, -0.6]} material={m.panelWhite}>
        <cylinderGeometry args={[1.65, 2.45, 0.35, 36]} />
      </mesh>

      {/* Warm interior crew viewports along the upper deck */}
      {WINDOW_ANGLES.map((angle) => {
        const radius = 2.64;
        const x = Math.sin(angle) * radius;
        const z = -0.6 + Math.cos(angle) * radius;

        return (
          <group key={angle} position={[x, 4.02, z]} rotation={[0, angle, 0]}>
            <mesh material={m.darkPanel}>
              <boxGeometry args={[0.68, 0.42, 0.08]} />
            </mesh>
            <mesh position={[0, 0, 0.03]} material={m.growLight}>
              <boxGeometry args={[0.54, 0.28, 0.04]} />
            </mesh>
          </group>
        );
      })}

      {/* Forward pressurised airlock tunnel */}
      <mesh position={[0, 1.45, 2.55]} rotation={[HALF_PI, 0, 0]} material={m.aluminium}>
        <cylinderGeometry args={[1.15, 1.15, 1.8, 24]} />
      </mesh>
      <mesh position={[0, 1.4, 3.65]} material={m.panelWhite}>
        <boxGeometry args={[2.3, 2.45, 1.1]} />
      </mesh>
      {/* Hatch door + International Orange safety header */}
      <mesh position={[0, 1.25, 4.22]} material={m.darkPanel}>
        <boxGeometry args={[1.15, 1.85, 0.08]} />
      </mesh>
      <mesh position={[0, 2.32, 4.24]} material={m.orange}>
        <boxGeometry args={[1.55, 0.16, 0.08]} />
      </mesh>
      {/* Boarding ramp */}
      <mesh position={[0, 0.24, 4.85]} rotation={[0.14, 0, 0]} material={m.aluminiumDark}>
        <boxGeometry args={[1.6, 0.12, 1.4]} />
      </mesh>

      {/* Left flank: ECLSS oxygen & water spherical tanks */}
      {[-1.3, 0.1].map((z) => (
        <group key={z} position={[-3.75, 1.15, z]}>
          <mesh material={m.panelWhite}>
            <sphereGeometry args={[0.78, 20, 16]} />
          </mesh>
          <mesh rotation={[HALF_PI, 0, 0]} material={m.orange}>
            <torusGeometry args={[0.79, 0.03, 8, 24]} />
          </mesh>
          <mesh position={[0, -0.65, 0]} material={m.aluminiumDark}>
            <cylinderGeometry args={[0.14, 0.18, 0.7, 8]} />
          </mesh>
        </group>
      ))}

      {/* Right flank: thermal rejection radiator panels */}
      {[-1.4, -0.1].map((z) => (
        <mesh
          key={z}
          position={[3.75, 1.55, z]}
          rotation={[0, 0, -0.18]}
          material={m.panelShade}
        >
          <boxGeometry args={[1.4, 2.1, 0.1]} />
        </mesh>
      ))}

      {/* Rooftop comms mast & telemetry dome */}
      <mesh position={[0.6, 5.1, -0.8]} material={m.aluminium}>
        <cylinderGeometry args={[0.42, 0.48, 0.45, 16]} />
      </mesh>
      <mesh position={[0.6, 5.35, -0.8]} material={m.panelWhite}>
        <sphereGeometry args={[0.42, 18, 12, 0, Math.PI * 2, 0, HALF_PI]} />
      </mesh>
      <mesh position={[-0.7, 5.55, -0.5]} material={m.aluminium}>
        <cylinderGeometry args={[0.04, 0.06, 1.4, 8]} />
      </mesh>

      <WorkLightMast position={[-4.8, 0.15, 2.6]} height={3.8} />
    </group>
  );
}


import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;
const RIBS = [-3.4, -1.7, 0, 1.7, 3.4];

/**
 * QTR-07 — Off-Shift Quarters: a warm-lit habitat interior annex with a wide
 * cutaway observation bay displaying Pasindu's pinned sketches, paintings,
 * UI wireframes, logos, and the HealthBridge research poster from data/creativeData.ts.
 */
export default function OffShiftQuarters() {
  return (
    <group>
      <OutpostPad radius={6.8} />

      {/* Support pedestals */}
      {[-3.0, -1.0, 1.0, 3.0].map((x) => (
        <mesh key={x} position={[x, 0.35, 0.1]} material={m.rubber}>
          <boxGeometry args={[0.55, 0.5, 2.8]} />
        </mesh>
      ))}

      {/* Outer cylindrical thermal shell (rear module behind the bay bulkhead) */}
      <mesh
        position={[0, 2.15, -1.25]}
        rotation={[0, 0, HALF_PI]}
        material={m.panelWhite}
      >
        <cylinderGeometry args={[1.65, 1.65, 7.6, 28]} />
      </mesh>

      {/* Gold Kapton thermal insulation end-caps */}
      {[-3.82, 3.82].map((x) => (
        <mesh
          key={x}
          position={[x, 2.15, -1.25]}
          rotation={[0, 0, HALF_PI]}
          material={m.foilGold}
        >
          <cylinderGeometry args={[1.58, 1.58, 0.08, 28]} />
        </mesh>
      ))}

      {/* Structural pressure ribs */}
      {RIBS.map((x) => (
        <mesh
          key={x}
          position={[x, 2.15, -1.25]}
          rotation={[0, HALF_PI, 0]}
          material={m.aluminiumDark}
        >
          <torusGeometry args={[1.67, 0.045, 8, 28]} />
        </mesh>
      ))}

      {/* Hollow panoramic interior bay frame (top, bottom, left, right walls) */}
      {/* Rear backing wall of the bay */}
      <mesh position={[0, 2.08, 0.42]} material={m.panelWhite}>
        <boxGeometry args={[6.6, 3.05, 0.35]} />
      </mesh>
      {/* Warm interior bulkhead lining on the rear wall (front face at z = 0.68) */}
      <mesh position={[0, 2.08, 0.64]} material={m.warmBulkhead}>
        <boxGeometry args={[6.0, 2.55, 0.08]} />
      </mesh>
      {/* Top roof overhang of the bay */}
      <mesh position={[0, 3.45, 0.92]} material={m.panelWhite}>
        <boxGeometry args={[6.6, 0.32, 1.1]} />
      </mesh>
      {/* International Orange safety fascia along the top header */}
      <mesh position={[0, 3.46, 1.49]} material={m.orange}>
        <boxGeometry args={[6.5, 0.14, 0.06]} />
      </mesh>
      {/* Bottom floor deck of the bay */}
      <mesh position={[0, 0.72, 0.95]} material={m.panelShade}>
        <boxGeometry args={[6.6, 0.28, 1.15]} />
      </mesh>
      {/* Left and right side walls of the bay */}
      {[-3.14, 3.14].map((x) => (
        <mesh key={x} position={[x, 2.08, 0.92]} material={m.panelWhite}>
          <boxGeometry args={[0.32, 2.45, 1.08]} />
        </mesh>
      ))}

      {/* Warm overhead interior luminaire bars & interior point light */}
      {[-1.5, 1.5].map((x) => (
        <mesh key={x} position={[x, 3.24, 1.12]} material={m.growLight}>
          <boxGeometry args={[2.5, 0.09, 0.24]} />
        </mesh>
      ))}
      <pointLight
        position={[0, 2.85, 1.55]}
        color="#ffe2b5"
        intensity={4.5}
        distance={8.5}
        decay={1.6}
      />

      {/* Pinned Creative Works on the interior bulkhead wall (z = 0.72) */}
      <group position={[0, 2.12, 0.72]}>
        {/* 1. HealthBridge Research Poster (large left-center board) */}
        <group position={[-1.92, 0.04, 0]}>
          <mesh material={m.paperSheet}>
            <boxGeometry args={[1.42, 1.72, 0.04]} />
          </mesh>
          <mesh position={[0, 0.7, 0.025]} material={m.orange}>
            <boxGeometry args={[1.28, 0.16, 0.02]} />
          </mesh>
          <mesh position={[-0.3, 0.18, 0.025]} material={m.darkPanel}>
            <boxGeometry args={[0.56, 0.6, 0.02]} />
          </mesh>
          <mesh position={[0.32, 0.24, 0.025]} material={m.amber}>
            <boxGeometry args={[0.52, 0.44, 0.02]} />
          </mesh>
          <mesh position={[0, -0.44, 0.025]} material={m.aluminiumDark}>
            <boxGeometry args={[1.24, 0.4, 0.02]} />
          </mesh>
        </group>

        {/* 2. Digital Artwork I & II (upper center canvas) */}
        <group position={[-0.18, 0.44, 0]} rotation={[0, 0, 0.03]}>
          <mesh material={m.paperSheet}>
            <boxGeometry args={[1.22, 0.86, 0.04]} />
          </mesh>
          <mesh position={[0, 0.02, 0.025]} material={m.darkPanel}>
            <boxGeometry args={[1.04, 0.66, 0.02]} />
          </mesh>
          <mesh position={[-0.18, 0.06, 0.035]} material={m.amber}>
            <boxGeometry args={[0.44, 0.36, 0.02]} />
          </mesh>
          <mesh position={[0.22, -0.08, 0.035]} material={m.foilGold}>
            <boxGeometry args={[0.34, 0.3, 0.02]} />
          </mesh>
        </group>

        {/* 3. Pencil Portrait & Sketch (lower center sheet with orange pin) */}
        <group position={[-0.2, -0.48, 0]} rotation={[0, 0, -0.025]}>
          <mesh material={m.paperSheet}>
            <boxGeometry args={[1.12, 0.76, 0.04]} />
          </mesh>
          <mesh position={[0, -0.02, 0.025]} material={m.aluminiumDark}>
            <boxGeometry args={[0.86, 0.54, 0.02]} />
          </mesh>
          <mesh position={[0, 0.32, 0.03]} material={m.orange}>
            <boxGeometry args={[0.22, 0.07, 0.02]} />
          </mesh>
        </group>

        {/* 4. UI Design Wireframes (upper right board) */}
        <group position={[1.24, 0.45, 0]}>
          <mesh material={m.paperSheet}>
            <boxGeometry args={[1.26, 0.84, 0.04]} />
          </mesh>
          <mesh position={[-0.26, 0.14, 0.025]} material={m.darkPanel}>
            <boxGeometry args={[0.52, 0.32, 0.02]} />
          </mesh>
          <mesh position={[0.28, 0.14, 0.025]} material={m.aluminium}>
            <boxGeometry args={[0.48, 0.32, 0.02]} />
          </mesh>
          <mesh position={[0, -0.22, 0.025]} material={m.aluminiumDark}>
            <boxGeometry args={[1.06, 0.22, 0.02]} />
          </mesh>
        </group>

        {/* 5. Traditional Painting (lower right canvas) */}
        <group position={[1.14, -0.46, 0]} rotation={[0, 0, 0.02]}>
          <mesh material={m.paperSheet}>
            <boxGeometry args={[1.02, 0.76, 0.04]} />
          </mesh>
          <mesh position={[0, 0, 0.025]} material={m.plantLight}>
            <boxGeometry args={[0.84, 0.58, 0.02]} />
          </mesh>
          <mesh position={[0.14, 0.08, 0.035]} material={m.amber}>
            <boxGeometry args={[0.36, 0.26, 0.02]} />
          </mesh>
        </group>

        {/* 6. Logo Design Cards (far right vertical strip) */}
        {[0.5, 0.0, -0.5].map((y, index) => (
          <group key={y} position={[2.36, y, 0]}>
            <mesh material={m.paperSheet}>
              <boxGeometry args={[0.54, 0.4, 0.04]} />
            </mesh>
            <mesh
              position={[0, 0, 0.025]}
              material={index === 0 ? m.orange : index === 1 ? m.darkPanel : m.amber}
            >
              <boxGeometry args={[0.24, 0.2, 0.02]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Foreground drafting desk & task lamp inside the open alcove */}
      <group position={[0.35, 0.86, 1.18]}>
        <mesh position={[0, 0.34, 0]} material={m.aluminium}>
          <boxGeometry args={[2.2, 0.08, 0.46]} />
        </mesh>
        <mesh position={[-0.95, 0.17, 0]} material={m.aluminiumDark}>
          <boxGeometry args={[0.08, 0.34, 0.4]} />
        </mesh>
        <mesh position={[0.95, 0.17, 0]} material={m.aluminiumDark}>
          <boxGeometry args={[0.08, 0.34, 0.4]} />
        </mesh>
        {/* Angled sketchpad on the desk */}
        <mesh
          position={[-0.25, 0.44, 0]}
          rotation={[0.35, 0, 0]}
          material={m.paperSheet}
        >
          <boxGeometry args={[0.68, 0.04, 0.34]} />
        </mesh>
        {/* Desk lamp */}
        <mesh position={[0.72, 0.58, 0]} material={m.growLight}>
          <boxGeometry args={[0.34, 0.08, 0.16]} />
        </mesh>
      </group>

      {/* Rooftop ventilation unit & Whip Antenna */}
      <mesh position={[-1.4, 4.02, -0.55]} material={m.aluminium}>
        <boxGeometry args={[1.5, 0.36, 1.1]} />
      </mesh>
      <mesh position={[1.8, 4.45, -0.55]} material={m.aluminiumDark}>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 8]} />
      </mesh>

      <WorkLightMast position={[4.5, 0.15, 2.8]} height={3.5} />
    </group>
  );
}

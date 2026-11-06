import { skills } from "@/data/skillsData";
import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;

/**
 * PWR-06 — Power Grid / Solar Array Field (Act 10: Skills telemetry).
 * Five sun-tracking photovoltaic wings — one per skill group in skillsData.ts —
 * feeding a transformer and battery inverter station. Each wing's span and
 * charge bar reflect its skill level percentage.
 */
export default function PowerGrid() {
  return (
    <group>
      <OutpostPad radius={7.2} />

      {/* Central busbar conduit running across the array line */}
      <mesh position={[-0.3, 0.24, -0.4]} rotation={[0, 0, HALF_PI]} material={m.aluminiumDark}>
        <cylinderGeometry args={[0.09, 0.09, 9.2, 10]} />
      </mesh>

      {/* Five solar array wings driven by skillsData.ts */}
      {skills.map((skill, index) => {
        const x = -4.2 + index * 1.95;
        const z = -1.2 + (index % 2) * 1.15;
        const ratio = skill.level / 100;
        const wingHeight = 2.5 + ratio * 1.15;
        const wingWidth = 1.48;

        return (
          <group
            key={skill.id}
            position={[x, 0.15, z]}
            userData={{ skillId: skill.id, level: skill.level }}
          >
            {/* Pedestal base + level charge indicator */}
            <mesh position={[0, 0.35, 0]} material={m.darkPanel}>
              <boxGeometry args={[0.52, 0.7, 0.52]} />
            </mesh>
            <mesh
              position={[0, 0.12 + ratio * 0.22, 0.27]}
              material={m.amber}
            >
              <boxGeometry args={[0.32, Math.max(0.12, ratio * 0.44), 0.04]} />
            </mesh>

            {/* Support mast */}
            <mesh position={[0, 1.45, 0]} material={m.aluminium}>
              <cylinderGeometry args={[0.09, 0.11, 1.8, 10]} />
            </mesh>

            {/* Sun-tilted photovoltaic wing */}
            <group position={[0, 2.35, 0]} rotation={[0.42, 0.12, 0]}>
              {/* Aluminium frame backing */}
              <mesh material={m.aluminium}>
                <boxGeometry args={[wingWidth, wingHeight, 0.08]} />
              </mesh>
              {/* Dark photovoltaic cell surface */}
              <mesh position={[0, 0, 0.045]} material={m.solarCell}>
                <boxGeometry args={[wingWidth - 0.14, wingHeight - 0.16, 0.02]} />
              </mesh>
              {/* Gold-foil central busbar strip */}
              <mesh position={[0, 0, 0.06]} material={m.foilGold}>
                <boxGeometry args={[0.05, wingHeight - 0.18, 0.015]} />
              </mesh>
              {/* Horizontal cell division ribs */}
              {[-0.3, 0, 0.3].map((offset) => (
                <mesh
                  key={offset}
                  position={[0, offset * wingHeight, 0.06]}
                  material={m.aluminiumDark}
                >
                  <boxGeometry args={[wingWidth - 0.16, 0.03, 0.015]} />
                </mesh>
              ))}
            </group>
          </group>
        );
      })}

      {/* Transformer & battery inverter station on the right side of the pad */}
      <group position={[4.5, 0.15, 1.3]}>
        <mesh position={[0, 0.95, 0]} material={m.panelWhite}>
          <boxGeometry args={[2.2, 1.9, 1.7]} />
        </mesh>
        <mesh position={[0, 1.96, 0]} material={m.aluminium}>
          <boxGeometry args={[2.36, 0.14, 1.86]} />
        </mesh>
        <mesh position={[0, 1.55, 0.86]} material={m.orange}>
          <boxGeometry args={[1.9, 0.14, 0.04]} />
        </mesh>
        {[-0.55, 0.55].map((x) => (
          <mesh key={x} position={[x, 0.85, 0.86]} material={m.darkPanel}>
            <boxGeometry args={[0.68, 1.05, 0.05]} />
          </mesh>
        ))}
      </group>

      <WorkLightMast position={[-5.5, 0.15, 2.4]} height={3.8} />
    </group>
  );
}


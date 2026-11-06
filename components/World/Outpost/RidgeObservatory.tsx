import { futureSkills } from "@/data/futureData";
import OutpostPad, { WorkLightMast } from "./OutpostPad";
import { m } from "./outpostMaterials";

const HALF_PI = Math.PI / 2;

/**
 * OBS-08 — Ridge Observatory: an elevated deep-sky optical & radio observatory
 * dome on a stepped rocky plinth, with 8 tracking transceiver units whose signal-lock
 * telemetry bars are driven by `futureSkills` from `data/futureData.ts`.
 */
export default function RidgeObservatory() {
  return (
    <group>
      <OutpostPad radius={6.8} />

      {/* Elevated rocky ridge plinth */}
      <mesh position={[0, 0.35, -0.3]} material={m.soil}>
        <cylinderGeometry args={[4.6, 5.4, 0.55, 28]} />
      </mesh>
      <mesh position={[0, 0.68, -0.3]} material={m.aluminiumDark}>
        <cylinderGeometry args={[3.8, 4.1, 0.18, 28]} />
      </mesh>

      {/* Observatory cylindrical drum */}
      <mesh position={[0, 1.72, -0.3]} material={m.panelWhite}>
        <cylinderGeometry args={[2.35, 2.45, 1.9, 32]} />
      </mesh>

      {/* Gold Kapton thermal base collar */}
      <mesh position={[0, 0.96, -0.3]} material={m.foilGold}>
        <cylinderGeometry args={[2.42, 2.48, 0.38, 32]} />
      </mesh>

      {/* Upper rotation ring */}
      <mesh
        position={[0, 2.68, -0.3]}
        rotation={[HALF_PI, 0, 0]}
        material={m.aluminiumDark}
      >
        <torusGeometry args={[2.38, 0.07, 10, 36]} />
      </mesh>

      {/* Hemispherical observatory dome */}
      <mesh position={[0, 2.68, -0.3]} material={m.panelShade}>
        <sphereGeometry args={[2.32, 32, 18, 0, Math.PI * 2, 0, HALF_PI]} />
      </mesh>

      {/* Dome shutter arches & open observing slot */}
      {[-0.52, 0.52].map((x) => (
        <mesh
          key={x}
          position={[x, 2.68, -0.3]}
          rotation={[0, HALF_PI, 0]}
          material={m.aluminiumDark}
        >
          <torusGeometry args={[2.34, 0.05, 8, 24, Math.PI]} />
        </mesh>
      ))}
      <mesh
        position={[0, 3.65, 0.95]}
        rotation={[-0.55, 0, 0]}
        material={m.darkPanel}
      >
        <boxGeometry args={[0.92, 1.95, 0.25]} />
      </mesh>

      {/* Deep-sky Cassegrain telescope barrel aimed into the Martian blue sunset */}
      <group position={[0, 3.35, 0.55]} rotation={[0.72, -0.24, 0]}>
        {/* Rear instrument & cryo-camera package */}
        <mesh position={[0, -0.45, 0]} material={m.foilGold}>
          <cylinderGeometry args={[0.48, 0.5, 0.55, 20]} />
        </mesh>
        {/* Main optical tube emerging through the dome shutter */}
        <mesh position={[0, 0.85, 0]} material={m.panelWhite}>
          <cylinderGeometry args={[0.44, 0.46, 2.25, 24]} />
        </mesh>
        {/* Collar rings */}
        {[0.1, 0.95, 1.8].map((y) => (
          <mesh
            key={y}
            position={[0, y, 0]}
            rotation={[HALF_PI, 0, 0]}
            material={m.aluminiumDark}
          >
            <torusGeometry args={[0.46, 0.038, 8, 24]} />
          </mesh>
        ))}
        {/* Dark aperture baffle & secondary mirror spider */}
        <mesh position={[0, 1.99, 0]} material={m.darkPanel}>
          <cylinderGeometry args={[0.4, 0.4, 0.06, 20]} />
        </mesh>
        {/* Auxiliary guide scope */}
        <mesh position={[0.56, 0.75, 0]} material={m.aluminium}>
          <cylinderGeometry args={[0.11, 0.11, 1.55, 12]} />
        </mesh>
      </group>

      {/* Forward entrance vestibule & International Orange safety header */}
      <mesh position={[0, 1.5, 2.05]} material={m.panelWhite}>
        <boxGeometry args={[1.55, 1.65, 0.7]} />
      </mesh>
      <mesh position={[0, 1.38, 2.41]} material={m.darkPanel}>
        <boxGeometry args={[0.88, 1.32, 0.06]} />
      </mesh>
      <mesh position={[0, 2.16, 2.42]} material={m.orange}>
        <boxGeometry args={[1.15, 0.12, 0.08]} />
      </mesh>

      {/* 8 Target-Tracking Transceiver Units around the apron (from data/futureData.ts) */}
      {futureSkills.map((skill, index) => {
        const lockRatio = skill.progress / 100;
        // Arrange the 8 tracking pedestals in a forward-facing arc around the ridge
        const t = index / (futureSkills.length - 1);
        const angle = -1.25 + t * 2.5;
        const radius = 4.65;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - 0.3;

        return (
          <group key={skill.id} position={[x, 0.15, z]} rotation={[0, -angle * 0.5, 0]}>
            {/* Transceiver pedestal */}
            <mesh position={[0, 0.42, 0]} material={m.darkPanel}>
              <boxGeometry args={[0.46, 0.84, 0.42]} />
            </mesh>
            {/* Amber signal-lock bar scaled by skill.progress */}
            <mesh
              position={[0, 0.16 + lockRatio * 0.24, 0.22]}
              material={m.amber}
            >
              <boxGeometry args={[0.26, Math.max(0.1, lockRatio * 0.48), 0.04]} />
            </mesh>
            {/* Mast & tracking dish aimed toward the sunset sky */}
            <mesh position={[0, 1.02, 0]} material={m.aluminiumDark}>
              <cylinderGeometry args={[0.05, 0.06, 0.42, 8]} />
            </mesh>
            <group
              position={[0, 1.28, 0]}
              rotation={[-0.55 - lockRatio * 0.25, -0.2, 0]}
            >
              <mesh material={m.panelWhite}>
                <cylinderGeometry args={[0.42, 0.12, 0.18, 16]} />
              </mesh>
              <mesh position={[0, 0.22, 0]} material={m.foilGold}>
                <sphereGeometry args={[0.06, 8, 8]} />
              </mesh>
            </group>
          </group>
        );
      })}

      <WorkLightMast position={[-4.1, 0.15, 2.8]} height={3.6} />
    </group>
  );
}


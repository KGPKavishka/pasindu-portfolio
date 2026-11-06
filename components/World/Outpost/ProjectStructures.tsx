"use client";

import { journeyWorld } from "@/components/Journey/journeyWorldConfig";
import CrewHabitat from "./CrewHabitat";
import EquipmentHangar from "./EquipmentHangar";
import Greenhouse from "./Greenhouse";
import LogisticsDepot from "./LogisticsDepot";
import MedLab from "./MedLab";
import OffShiftQuarters from "./OffShiftQuarters";
import PowerGrid from "./PowerGrid";
import RidgeObservatory from "./RidgeObservatory";

/** Turn each structure slightly toward the walking corridor (x = 0). */
function yawToCorridor(x: number) {
  return Math.atan2(-x, 34);
}

/**
 * Outpost surface structures built across Acts 5–12. Positions come from
 * journeyWorld; the pads stand on the ground plane (journeyWorld.groundY).
 */
export default function ProjectStructures() {
  const y = journeyWorld.groundY;

  return (
    <group>
      <group
        position={[journeyWorld.healthbridge[0], y, journeyWorld.healthbridge[2]]}
        rotation={[0, yawToCorridor(journeyWorld.healthbridge[0]), 0]}
      >
        <MedLab />
      </group>
      <group
        position={[journeyWorld.ezymap[0], y, journeyWorld.ezymap[2]]}
        rotation={[0, yawToCorridor(journeyWorld.ezymap[0]), 0]}
      >
        <LogisticsDepot />
      </group>
      <group
        position={[journeyWorld.kvaudio[0], y, journeyWorld.kvaudio[2]]}
        rotation={[0, yawToCorridor(journeyWorld.kvaudio[0]), 0]}
      >
        <EquipmentHangar />
      </group>
      <group
        position={[journeyWorld.storybloom[0], y, journeyWorld.storybloom[2]]}
        rotation={[0, yawToCorridor(journeyWorld.storybloom[0]), 0]}
      >
        <Greenhouse />
      </group>
      <group
        position={[journeyWorld.experience[0], y, journeyWorld.experience[2]]}
        rotation={[0, 0.08, 0]}
      >
        <CrewHabitat />
      </group>
      <group
        position={[journeyWorld.data[0], y, journeyWorld.data[2]]}
        rotation={[0, yawToCorridor(journeyWorld.data[0]), 0]}
      >
        <PowerGrid />
      </group>
      <group
        position={[journeyWorld.creative[0], y, journeyWorld.creative[2]]}
        rotation={[0, yawToCorridor(journeyWorld.creative[0]), 0]}
      >
        <OffShiftQuarters />
      </group>
      <group
        position={[journeyWorld.future[0], y, journeyWorld.future[2]]}
        rotation={[0, yawToCorridor(journeyWorld.future[0]), 0]}
      >
        <RidgeObservatory />
      </group>
    </group>
  );
}


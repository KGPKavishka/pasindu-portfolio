"use client";

import { journeyWorld } from "@/components/Journey/journeyWorldConfig";
import EquipmentHangar from "./EquipmentHangar";
import Greenhouse from "./Greenhouse";
import LogisticsDepot from "./LogisticsDepot";
import MedLab from "./MedLab";

/** Turn each structure slightly toward the walking corridor (x = 0). */
function yawToCorridor(x: number) {
  return Math.atan2(-x, 34);
}

/**
 * The four project structures of the outpost (Acts 5–8). Positions come from
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
    </group>
  );
}


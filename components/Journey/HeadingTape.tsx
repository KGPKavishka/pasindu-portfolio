"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useMemo, useState } from "react";

import { useJourney } from "./JourneyController";
import {
  journeyCameraKeyframes,
  type JourneyVector,
} from "./journeyCameraConfig";
import { outpostStructures } from "./journeyWorldConfig";

interface WaypointTelemetry {
  headingDeg: number;
  waypointBearingDeg: number;
  distanceMeters: number;
  code: string;
  name: string;
  structure: string;
}

const COMPASS_TICKS = Array.from({ length: 36 }, (_, index) => index * 10);

function cardinalLabel(deg: number): string | null {
  const normalized = ((deg % 360) + 360) % 360;
  if (normalized === 0) return "N";
  if (normalized === 90) return "E";
  if (normalized === 180) return "S";
  if (normalized === 270) return "W";
  if (normalized % 30 === 0) return String(normalized).padStart(3, "0");
  return null;
}

function samplePose(progress: number): {
  position: JourneyVector;
  target: JourneyVector;
} {
  const frames = journeyCameraKeyframes;
  if (progress <= frames[0].progress) {
    return { position: frames[0].position, target: frames[0].target };
  }
  const last = frames[frames.length - 1];
  if (progress >= last.progress) {
    return { position: last.position, target: last.target };
  }

  let index = 0;
  while (index < frames.length - 2 && progress > frames[index + 1].progress) {
    index += 1;
  }
  const start = frames[index];
  const end = frames[index + 1];
  const span = end.progress - start.progress;
  const t = span <= 0 ? 1 : (progress - start.progress) / span;

  return {
    position: [
      start.position[0] + (end.position[0] - start.position[0]) * t,
      start.position[1] + (end.position[1] - start.position[1]) * t,
      start.position[2] + (end.position[2] - start.position[2]) * t,
    ],
    target: [
      start.target[0] + (end.target[0] - start.target[0]) * t,
      start.target[1] + (end.target[1] - start.target[1]) * t,
      start.target[2] + (end.target[2] - start.target[2]) * t,
    ],
  };
}

function toCompassDeg(dx: number, dz: number): number {
  // Forward (-Z) is 0° North, +X is 90° East.
  const rad = Math.atan2(dx, -dz);
  const deg = (rad * 180) / Math.PI;
  return ((deg % 360) + 360) % 360;
}

function shortestAngleDiff(fromDeg: number, toDeg: number): number {
  return ((((toDeg - fromDeg) % 360) + 540) % 360) - 180;
}

function computeTelemetry(progress: number): WaypointTelemetry {
  const { position, target } = samplePose(progress);
  const headingDeg = toCompassDeg(
    target[0] - position[0],
    target[2] - position[2]
  );

  // Pick the active or next upcoming outpost structure.
  const active =
    outpostStructures.find(
      (item) => progress <= item.targetProgress + 0.025
    ) ?? outpostStructures[outpostStructures.length - 1];

  const dx = active.position[0] - position[0];
  const dz = active.position[2] - position[2];
  const waypointBearingDeg = toCompassDeg(dx, dz);
  const worldDist = Math.hypot(dx, dz);

  return {
    headingDeg: Math.round(headingDeg),
    waypointBearingDeg: Math.round(waypointBearingDeg),
    distanceMeters: Math.max(4, Math.round(worldDist * 2.5)),
    code: active.code,
    name: active.name,
    structure: active.structure,
  };
}

/**
 * Visor Heading Tape & Waypoint Marker (DESIGN_PLAN.md §5.3).
 *
 * Appears once the astronaut steps onto the surface at Landfall (progress ≥ 0.255).
 * Displays a realistic aviation/EVA compass strip, bearing caret, and distance
 * readout to the next outpost structure.
 */
export default function HeadingTape() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const [telemetry, setTelemetry] = useState<WaypointTelemetry>(() =>
    computeTelemetry(0.26)
  );

  // Fade in as the lander hatch opens at landfall; stay up across the outpost walk.
  const opacity = useTransform(
    progress,
    [0.254, 0.272, 0.975, 0.992],
    [0, 1, 1, 0]
  );

  useMotionValueEvent(progress, "change", (latest) => {
    if (latest < 0.245) return;
    setTelemetry(computeTelemetry(latest));
  });

  const bearingDelta = useMemo(
    () =>
      shortestAngleDiff(telemetry.headingDeg, telemetry.waypointBearingDeg),
    [telemetry.headingDeg, telemetry.waypointBearingDeg]
  );
  // Clamp marker offset within the visible ±48° window of the tape.
  const markerPercent = Math.max(-44, Math.min(44, (bearingDelta / 50) * 44));

  return (
    <motion.div
      aria-hidden="true"
      data-layer="heading-tape"
      style={{ opacity }}
      className="pointer-events-none fixed inset-x-0 top-16 z-[44] flex flex-col items-center px-4 sm:top-[74px]"
    >
      <div className="relative w-full max-w-md">
        {/* Centerlubber line (current heading caret) */}
        <div className="flex justify-center">
          <span className="font-hud text-[9px] tracking-[0.2em] text-caution">
            {String(telemetry.headingDeg).padStart(3, "0")}°
          </span>
        </div>

        {/* Compass strip window */}
        <div
          className="relative mt-0.5 h-6 overflow-hidden border-y border-suit/20 bg-void/65"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent)",
          }}
        >
          {/* Center index notch */}
          <span className="absolute left-1/2 top-0 z-10 h-1.5 w-px -translate-x-1/2 bg-caution" />
          <span className="absolute bottom-0 left-1/2 z-10 h-1.5 w-px -translate-x-1/2 bg-caution" />

          {/* Ticks positioned relative to current heading */}
          <div className="relative h-full w-full">
            {COMPASS_TICKS.map((tickDeg) => {
              const diff = shortestAngleDiff(telemetry.headingDeg, tickDeg);
              if (Math.abs(diff) > 55) return null;
              const leftPercent = 50 + (diff / 50) * 44;
              const label = cardinalLabel(tickDeg);
              const isMajor = tickDeg % 30 === 0;

              return (
                <div
                  key={tickDeg}
                  style={{ left: `${leftPercent}%` }}
                  className="absolute inset-y-0 flex -translate-x-1/2 flex-col items-center justify-between py-0.5"
                >
                  <span
                    className={`w-px ${
                      isMajor ? "h-1.5 bg-suit/65" : "h-1 bg-suit/30"
                    }`}
                  />
                  {label && (
                    <span
                      className={`font-hud text-[8px] leading-none tracking-[0.14em] ${
                        label.length <= 2
                          ? "font-semibold text-sunlight"
                          : "text-suit/55"
                      }`}
                    >
                      {label}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Waypoint diamond marker on the tape */}
            <motion.span
              animate={{ left: `${50 + markerPercent}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
              className="absolute top-1/2 z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-caution bg-caution/40"
            />
          </div>
        </div>

        {/* Active waypoint callout bar */}
        <div className="mt-1 flex items-center justify-between gap-3 px-2 font-hud text-[9px] uppercase tracking-[0.18em] text-suit/75 [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
          <span className=" truncate">
            <span className="text-caution">{telemetry.code}</span>
            {" // "}
            <span className="text-sunlight">{telemetry.name}</span>
            <span className="hidden text-suit/55 sm:inline">
              {" · "}
              {telemetry.structure}
            </span>
          </span>
          <span className="shrink-0 tabular-nums text-caution">
            RNG {telemetry.distanceMeters} M
          </span>
        </div>
      </div>
    </motion.div>
  );
}


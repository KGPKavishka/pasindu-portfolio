"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

import { useJourney } from "./JourneyController";
import {
  descentAltitude,
  descentSpeed,
} from "@/components/World/Landing/landingConfig";

const BAR_BASE = "#17181b";
const RIVETS =
  "radial-gradient(circle, rgba(233,230,223,0.17) 1.2px, transparent 1.7px) 0 0 / 46px 46px";
const SHEEN = "linear-gradient(180deg, rgba(233,230,223,0.07), transparent 34%)";
const SEAMS_H =
  "repeating-linear-gradient(90deg, transparent 0 143px, rgba(0,0,0,0.55) 143px 145px)";
const SEAMS_V =
  "repeating-linear-gradient(0deg, transparent 0 143px, rgba(0,0,0,0.55) 143px 145px)";

const topBar = {
  clipPath: "polygon(0 0, 100% 0, calc(100% - var(--sw)) 100%, var(--sw) 100%)",
  background: `${SHEEN}, ${SEAMS_H}, ${RIVETS}, ${BAR_BASE}`,
};
const bottomBar = {
  clipPath: "polygon(var(--sw) 0, calc(100% - var(--sw)) 0, 100% 100%, 0 100%)",
  background: `${SEAMS_H}, ${RIVETS}, linear-gradient(0deg, rgba(255,79,0,0.05), transparent 40%), ${BAR_BASE}`,
};
const leftBar = {
  clipPath: "polygon(0 0, 100% var(--th), 100% calc(100% - var(--bh)), 0 100%)",
  background: `linear-gradient(90deg, rgba(233,230,223,0.06), transparent 50%), ${SEAMS_V}, ${RIVETS}, ${BAR_BASE}`,
};
const rightBar = {
  clipPath: "polygon(0 var(--th), 100% 0, 100% 100%, 0 calc(100% - var(--bh)))",
  background: `linear-gradient(270deg, rgba(233,230,223,0.06), transparent 50%), ${SEAMS_V}, ${RIVETS}, ${BAR_BASE}`,
};

function formatAltitude(progress: number) {
  const t = Math.min(1, Math.max(0, (progress - 0.14) / (0.196 - 0.14)));
  // High above the planet until the entry burn, then the final fall.
  const kilometres =
    progress < 0.196
      ? 1.2 + 178.8 * Math.pow(1 - t, 2)
      : (descentAltitude(progress) * 8) / 1000;

  if (kilometres >= 10) return `${kilometres.toFixed(1)} KM`;
  if (kilometres >= 1) return `${kilometres.toFixed(2)} KM`;

  return `${Math.round(kilometres * 1000)} M`;
}

function formatSpeed(progress: number) {
  const t = Math.min(1, Math.max(0, (progress - 0.14) / (0.196 - 0.14)));
  const speed =
    progress < 0.196
      ? 86 + 7514 * Math.pow(1 - t, 1.6)
      : descentSpeed(progress);

  return `${Math.round(speed)} M/S`;
}

function Readout({ label, value }: { label: string; value: MotionValue<string> }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-hud text-[9px] uppercase tracking-[0.3em] text-suit/45">
        {label}
      </span>
      <motion.span className="font-hud text-sm font-medium tracking-[0.12em] text-caution tabular-nums sm:text-base">
        {value}
      </motion.span>
    </div>
  );
}

/**
 * The lander's window and console. It closes around the visitor as they leave
 * the station (a thick riveted frame with the live altitude, speed and G-load
 * readouts) and its hatch opens at landfall: the frame retracts to the edges of
 * the screen while a flood of daylight washes in. Everything is driven by
 * journey progress.
 */
export default function LanderCabin() {
  const { progress } = useJourney();

  const presence = useTransform(progress, [0.14, 0.168], [0, 1]);
  const open = useTransform(progress, [0.25, 0.264, 0.278], [0, 0.3, 1]);
  const topY = useTransform(open, [0, 1], ["0%", "-104%"]);
  const bottomY = useTransform(open, [0, 1], ["0%", "104%"]);
  const leftX = useTransform(open, [0, 1], ["0%", "-104%"]);
  const rightX = useTransform(open, [0, 1], ["0%", "104%"]);
  const windowOpacity = useTransform(open, [0, 0.35], [1, 0]);
  const flood = useTransform(progress, [0.249, 0.258, 0.268, 0.282], [0, 0.55, 0.28, 0]);
  const plasmaTint = useTransform(progress, [0.172, 0.197, 0.23], [0, 0.34, 0]);

  const altitude = useTransform(progress, (value) => formatAltitude(value));
  const speed = useTransform(progress, (value) => formatSpeed(value));
  const gLoad = useTransform(
    progress,
    [0.14, 0.18, 0.197, 0.22, 0.25],
    [0, 0.4, 4.1, 1.6, 0.38]
  );
  const gText = useTransform(gLoad, (value) => `${value.toFixed(1)} G`);

  return (
    <motion.div
      aria-hidden="true"
      data-layer="lander-cabin"
      style={{ opacity: presence }}
      className="
        pointer-events-none
        fixed
        inset-0
        z-[42]
        overflow-hidden
        [--sw:5vw]
        [--th:11vh]
        [--bh:17vh]
        md:[--sw:8vw]
        md:[--th:13vh]
        md:[--bh:19vh]
      "
    >
      <motion.div style={{ y: topY, ...topBar }} className="absolute inset-x-0 top-0 h-[var(--th)]" />

      <motion.div
        style={{ y: bottomY, ...bottomBar }}
        className="absolute inset-x-0 bottom-0 flex h-[var(--bh)] flex-col items-center"
      >
        {/* Hazard stripe along the console's upper edge. */}
        <div
          className="h-2 w-[calc(100%-2*var(--sw))] opacity-60"
          style={{
            background:
              "repeating-linear-gradient(-45deg, #ff4f00 0 10px, #17181b 10px 20px)",
          }}
        />
        {/* Readouts sit high in the console so the radio subtitle below never overlaps them. */}
        <div className="flex flex-1 items-start gap-8 pt-3 sm:gap-14 sm:pt-4">
          <Readout label="Altitude" value={altitude} />
          <Readout label="Velocity" value={speed} />
          <Readout label="G-load" value={gText} />
        </div>
      </motion.div>

      <motion.div style={{ x: leftX, ...leftBar }} className="absolute left-0 top-0 h-full w-[var(--sw)]" />
      <motion.div style={{ x: rightX, ...rightBar }} className="absolute right-0 top-0 h-full w-[var(--sw)]" />

      {/* Window glass: inner rim, a faint reflection and edge darkening. */}
      <motion.div
        style={{ opacity: windowOpacity }}
        className="absolute inset-x-[var(--sw)] bottom-[var(--bh)] top-[var(--th)] border border-suit/15 shadow-[inset_0_0_90px_rgba(0,0,0,0.6)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,244,226,0.06),transparent_32%)]" />
      </motion.div>

      {/* Plasma glow lighting the cabin interior during entry. */}
      <motion.div
        style={{ opacity: plasmaTint }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_40%,rgba(255,110,30,0.5))] mix-blend-screen"
      />

      {/* Daylight flooding in as the hatch opens. */}
      <motion.div
        style={{ opacity: flood }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_68%_42%,rgba(255,244,226,0.95),rgba(255,206,150,0.4)_48%,transparent_78%)] mix-blend-screen"
      />
    </motion.div>
  );
}

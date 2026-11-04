"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useState } from "react";

import { useJourney } from "./JourneyController";
import { missionStats } from "./missionStats";

/** Journey progress at which each manifest line locks in (while PK reads them out). */
const REVEAL_AT = [0.088, 0.096, 0.104, 0.112] as const;

function countRevealed(value: number) {
  return REVEAL_AT.filter((threshold) => value >= threshold).length;
}

/**
 * Visor readout of the headline numbers, shown during the spacewalk while PK
 * reads the manifest over the radio. Visual only: the radio transcript carries
 * the same figures as text.
 */
export default function EvaManifest() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(() => countRevealed(progress.get()));
  const opacity = useTransform(progress, [0.075, 0.09, 0.125, 0.14], [0, 1, 1, 0]);

  useMotionValueEvent(progress, "change", (value) => {
    setRevealed(countRevealed(value));
  });

  return (
    <motion.div
      aria-hidden="true"
      data-layer="eva-manifest"
      style={{ opacity }}
      className="pointer-events-none fixed right-5 top-[30%] z-[44] sm:right-[6vw] md:top-[34%]"
    >
      <p className="font-hud text-[10px] font-medium uppercase tracking-[0.3em] text-caution/80">
        EVA manifest
      </p>

      <ul className="mt-3 space-y-3 border-l border-caution/40 pl-4">
        {missionStats.map((stat, index) => {
          const isShown = reduceMotion || index < revealed;

          return (
            <motion.li
              key={stat.label}
              initial={false}
              animate={{ opacity: isShown ? 1 : 0, x: isShown || reduceMotion ? 0 : 10 }}
              transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
              className="flex items-baseline gap-4"
            >
              <span className="w-[4.5rem] font-hud text-3xl font-medium leading-none text-sunlight tabular-nums [text-shadow:0_1px_14px_rgba(0,0,0,0.85)]">
                {stat.value}
              </span>
              <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-suit/65 [text-shadow:0_1px_10px_rgba(0,0,0,0.9)]">
                {stat.label}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

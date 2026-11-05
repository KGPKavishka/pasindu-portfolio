"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useState } from "react";

import { useJourney } from "./JourneyController";
import { outpostStructures } from "./journeyWorldConfig";

/**
 * Visor Site Map (DESIGN_PLAN.md §2 Act 4 & §3).
 *
 * Projected inside the helmet right after Landfall (progress ~0.265–0.322) as
 * the astronaut steps onto the plain and looks across the outpost. Displays a
 * tactical schematic of the 9 structures along the traverse corridor together
 * with their designation codes and roles.
 */
export default function OutpostSiteMap() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => {
    const initial = progress.get();
    return initial >= 0.262 && initial <= 0.326;
  });

  const opacity = useTransform(
    progress,
    [0.265, 0.278, 0.312, 0.324],
    [0, 1, 1, 0]
  );

  useMotionValueEvent(progress, "change", (latest) => {
    const shouldShow = latest >= 0.262 && latest <= 0.326;
    setVisible((prev) => (prev === shouldShow ? prev : shouldShow));
  });

  if (!visible) return null;

  return (
    <motion.aside
      aria-label="Outpost site map"
      data-layer="outpost-site-map"
      style={{ opacity }}
      className="pointer-events-none fixed left-4 top-32 z-[44] w-[min(23rem,calc(100vw-2rem))] sm:left-8 sm:top-36 lg:left-[6vw]"
    >
      <div className="border-l-2 border-caution/75 bg-void/60 px-4 py-3.5 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-hud text-[10px] font-medium uppercase tracking-[0.26em] text-caution">
            Outpost Site Map // Sector 01
          </p>
          <span className="font-hud text-[9px] uppercase tracking-[0.18em] text-nominal">
            9 Structures
          </span>
        </div>

        <p className="mt-1 font-radio text-xs leading-relaxed text-suit/75">
          Traverse corridor ahead. Each structure houses one system or mission archive.
        </p>

        {/* Schematic radar strip + structure index */}
        <ul className="mt-3 space-y-1.5 border-t border-suit/15 pt-2.5">
          {outpostStructures.map((item, index) => {
            const side =
              item.position[0] < -1
                ? "W"
                : item.position[0] > 1
                  ? "E"
                  : "C";
            const rangeMeters = Math.round(Math.abs(item.position[2] - -24.6) * 2.5);

            return (
              <motion.li
                key={item.id}
                initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.25,
                  delay: reduceMotion ? 0 : index * 0.035,
                }}
                className="grid grid-cols-[3.4rem_1fr_auto] items-baseline gap-2 font-hud text-[10px]"
              >
                <span className="tracking-[0.14em] text-caution/90">
                  {item.code}
                </span>
                <span className="truncate tracking-[0.08em] text-sunlight">
                  {item.name}{" "}
                  <span className="text-suit/50">· {item.structure}</span>
                </span>
                <span className="tabular-nums tracking-[0.12em] text-suit/55">
                  {side} · {rangeMeters}M
                </span>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.aside>
  );
}


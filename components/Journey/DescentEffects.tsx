"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useState } from "react";

import { useJourney } from "./JourneyController";

// Vertical streaks of hot gas, rasterised once and slid down the screen.
const STREAKS =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420'><filter id='f' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.006 0.11' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.64  0 0 0 0 0.26  0 0 0 2.4 -0.62'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>\")";

// Soft billows of dust, drifted slowly.
const BILLOWS =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.0045' numOctaves='3' seed='9'/><feColorMatrix values='0 0 0 0 0.86  0 0 0 0 0.68  0 0 0 0 0.52  0 0 0 2.1 -0.55'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>\")";

/**
 * What the visitor sees through the lander window while entering the
 * atmosphere and landing: hot plasma that builds from the edges of the glass
 * and fills the view at its peak (hiding the swap from the planet to the
 * landing site), and the cloud of dust the retro-thrusters kick up at
 * touchdown. Both are driven purely by journey progress.
 */
export default function DescentEffects() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const [plasmaActive, setPlasmaActive] = useState(false);
  const [dustActive, setDustActive] = useState(false);

  const edge = useTransform(progress, [0.165, 0.19, 0.22, 0.245], [0, 1, 0.7, 0]);
  const fill = useTransform(progress, [0.178, 0.196, 0.213, 0.236], [0, 0.94, 0.94, 0]);
  const streaks = useTransform(progress, [0.172, 0.192, 0.216, 0.24], [0, 0.85, 0.55, 0]);
  const dust = useTransform(progress, [0.238, 0.247, 0.257, 0.276], [0, 0.88, 0.7, 0]);

  useMotionValueEvent(progress, "change", (value) => {
    setPlasmaActive(value > 0.16 && value < 0.25);
    setDustActive(value > 0.232 && value < 0.28);
  });

  return (
    <div
      aria-hidden="true"
      data-layer="descent-effects"
      className="pointer-events-none fixed inset-0 z-[41] overflow-hidden"
    >
      {plasmaActive && (
        <>
          <motion.div
            style={{
              opacity: edge,
              background:
                "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 34%, rgba(255,128,36,0.5) 66%, rgba(255,79,0,0.9) 100%)",
            }}
            className="absolute inset-0"
          />

          <motion.div style={{ opacity: streaks }} className="absolute inset-0 mix-blend-screen">
            <div
              className={`absolute inset-x-0 -top-[420px] h-[calc(100%+420px)] ${reduceMotion ? "" : "animate-[plasma-streak_0.5s_linear_infinite]"
                }`}
              style={{ backgroundImage: STREAKS, backgroundSize: "420px 420px" }}
            />
          </motion.div>

          <motion.div style={{ opacity: fill }} className="absolute inset-0">
            <div
              className={`absolute inset-0 ${reduceMotion ? "" : "animate-[plasma-flicker_0.22s_steps(2)_infinite]"
                }`}
              style={{
                background:
                  "radial-gradient(ellipse 80% 75% at 50% 52%, #fff6e6 0%, #ffd29a 20%, #ff9a40 46%, #e2540f 76%, #8a2a00 100%)",
              }}
            />
          </motion.div>
        </>
      )}

      {dustActive && (
        <motion.div style={{ opacity: dust }} className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_58%,rgba(214,176,140,0.9),rgba(190,150,115,0.82)_55%,rgba(150,112,84,0.7)_100%)]" />
          <div
            className={`absolute -inset-[300px] opacity-70 ${reduceMotion ? "" : "animate-[dust-drift_14s_linear_infinite]"
              }`}
            style={{ backgroundImage: BILLOWS, backgroundSize: "600px 600px" }}
          />
        </motion.div>
      )}
    </div>
  );
}

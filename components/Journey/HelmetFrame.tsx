"use client";

import { motion, useReducedMotion } from "framer-motion";

import { useJourney } from "./JourneyController";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * The inside of the helmet: everything else in the experience is "seen through"
 * this overlay. Purely visual (no pointer events, hidden from assistive tech)
 * and sits beneath the HUD, modals and loading screen.
 */
export default function HelmetFrame() {
  const { currentPhase } = useJourney();
  const reduceMotion = useReducedMotion();
  const isPoweredOn = currentPhase.id !== "loading";

  return (
    <motion.div
      aria-hidden="true"
      data-layer="helmet-frame"
      initial={{ opacity: 0 }}
      animate={{ opacity: isPoweredOn ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 1.8, ease: "easeOut" }}
      className="pointer-events-none fixed inset-0 z-[43] overflow-hidden"
    >
      {/* Optical falloff toward the edge of the glass; breathes very slowly. */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 72% at 50% 48%, transparent 58%, rgba(5,5,5,0.42) 82%, rgba(5,5,5,0.88) 100%)",
        }}
        animate={reduceMotion ? undefined : { scale: [1, 1.012, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gold sun-filter coating, strongest at the top of the visor. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(201,164,92,0.14), rgba(201,164,92,0.03) 24%, transparent 40%)",
        }}
      />

      {/* Reflection of the sun across the curved glass. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(112deg, rgba(255,244,226,0.07) 0%, rgba(255,244,226,0.02) 22%, transparent 38%)",
        }}
      />

      {/* Glass rim: outer edge of the visor and the inner seal line. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M 3 9 Q 50 -3 97 9 Q 100 50 97 91 Q 50 103 3 91 Q 0 50 3 9 Z"
          fill="none"
          stroke="rgba(233,230,223,0.16)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 4.4 11.5 Q 50 0.5 95.6 11.5 Q 98 50 95.6 88.5 Q 50 99.5 4.4 88.5 Q 2 50 4.4 11.5 Z"
          fill="none"
          stroke="rgba(233,230,223,0.06)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Fine sensor / glass grain. */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </motion.div>
  );
}

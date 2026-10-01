"use client";

import { motion } from "framer-motion";

import { useJourney } from "./Journey/JourneyController";

export default function ScrollProgress() {
  const { progress } = useJourney();

  return (
    <motion.div
      className="
        fixed
        left-0
        right-0
        top-[79px]
        h-[2px]
        z-[60]
        origin-left
        bg-gradient-to-r
        from-cyan-200
        to-emerald-200
        shadow-[0_0_14px_rgba(34,211,238,0.38)]
      "
      style={{
        scaleX: progress,
      }}
    />
  );
}
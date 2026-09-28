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
        from-cyan-400
        via-cyan-300
        to-blue-400
        shadow-[0_0_20px_rgba(34,211,238,0.7)]
      "
      style={{
        scaleX: progress,
      }}
    />
  );
}
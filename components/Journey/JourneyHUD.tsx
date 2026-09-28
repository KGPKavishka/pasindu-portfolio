"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import TypewriterText from "@/components/UI/TypewriterText";
import { useJourney } from "./JourneyController";
import { JourneyPhaseId } from "./journeyConfig";

const systemMessages: Record<JourneyPhaseId, string> = {
  loading: "INITIALIZING JOURNEY",
  space: "NAVIGATION // DEEP SPACE",
  "planet-approach": "DESTINATION DETECTED",
  "planet-surface": "LANDING CORRIDOR ONLINE",
  city: "DIGITAL CITY // CONNECTED",
  healthbridge: "ACCESSING PROJECT DATABASE",
  "ezy-map": "ACCESSING PROJECT DATABASE",
  "kv-audio": "ACCESSING PROJECT DATABASE",
  "story-bloom": "ACCESSING PROJECT DATABASE",
  experience: "CAREER DATA // ONLINE",
  data: "TECHNICAL SYSTEMS // ONLINE",
  creative: "CREATIVE ARCHIVE // ONLINE",
  future: "RESEARCH SIGNAL // ONLINE",
  contact: "COMMUNICATION CHANNEL // OPEN",
  complete: "JOURNEY COMPLETE",
};

export default function JourneyHUD() {
  const { currentPhase, direction } = useJourney();
  const reduceMotion = useReducedMotion();

  if (currentPhase.id === "loading") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase.id}
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduceMotion ? 0 : 0.35 }}
          className="absolute bottom-5 left-4 max-w-[calc(100vw-6rem)] border-l border-cyan-400/40 bg-[#020711]/55 px-4 py-3 backdrop-blur-md sm:bottom-8 sm:left-8"
        >
          <p className="text-[9px] font-medium uppercase text-cyan-300 sm:text-[10px]">
            <TypewriterText text={systemMessages[currentPhase.id]} />
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />
            <p className="text-xs font-semibold uppercase text-white/80 sm:text-sm">
              {currentPhase.label}
            </p>
            <span className="text-[9px] uppercase text-white/35">
              {direction}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
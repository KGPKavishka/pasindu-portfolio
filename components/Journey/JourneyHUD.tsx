"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import TypewriterText from "@/components/UI/TypewriterText";
import { useJourney } from "./JourneyController";
import { JourneyPhaseId } from "./journeyConfig";

interface HudMessage {
  system: string;
  heading?: string;
  status?: string;
}

const hudMessages: Partial<Record<JourneyPhaseId, HudMessage>> = {
  loading: {
    system: "SYSTEM INITIALIZING",
    heading: "LOADING JOURNEY",
  },
  space: {
    system: "SYSTEM INITIALIZED",
    heading: "NAVIGATION ONLINE",
    status: "DESTINATION: DIGITAL CITY",
  },
  "planet-approach": {
    system: "PLANET DETECTED",
  },
  "planet-surface": {
    system: "ENTERING ATMOSPHERE",
    heading: "SURFACE APPROACH",
  },
  city: {
    system: "OUTPOST TELEMETRY",
    heading: "SITE MAP ONLINE",
  },
  healthbridge: {
    system: "STRUCTURE DETECTED",
    heading: "HEALTHBRIDGE MED-LAB",
    status: "ACCESSING MISSION FILE...",
  },
  "ezy-map": {
    system: "STRUCTURE DETECTED",
    heading: "EZY MAP LOGISTICS DEPOT",
    status: "ACCESSING MISSION FILE...",
  },
  "kv-audio": {
    system: "STRUCTURE DETECTED",
    heading: "KV AUDIO EQUIPMENT HANGAR",
    status: "ACCESSING MISSION FILE...",
  },
  "story-bloom": {
    system: "STRUCTURE DETECTED",
    heading: "STORYBLOOM GREENHOUSE",
    status: "ACCESSING MISSION FILE...",
  },
  experience: {
    system: "STRUCTURE DETECTED",
    heading: "CREW HABITAT",
    status: "ACCESSING CREW LOG...",
  },
  data: {
    system: "STRUCTURE DETECTED",
    heading: "POWER GRID // SOLAR ARRAYS",
    status: "READING GRID TELEMETRY...",
  },
  creative: {
    system: "INTERIOR MODULE",
    heading: "OFF-SHIFT QUARTERS",
    status: "ACCESSING PERSONAL ARCHIVE...",
  },
  future: {
    system: "RIDGE MODULE",
    heading: "DEEP-SKY OBSERVATORY",
    status: "TRACKING SIGNAL LOCK...",
  },
  contact: {
    system: "UPLINK ARRAY",
    heading: "LONG-RANGE COMMS MAST",
    status: "COMMUNICATION CHANNEL READY...",
  },
  complete: {
    system: "MISSION LOG END",
    heading: "SIGNAL REMAINS OPEN",
  },
};

interface PhasePanelProps {
  phaseId: JourneyPhaseId;
  message: HudMessage;
}

function PhasePanel({ phaseId, message }: PhasePanelProps) {
  const reduceMotion = useReducedMotion();
  const [systemComplete, setSystemComplete] = useState(false);
  const [headingComplete, setHeadingComplete] = useState(false);
  const contentReady = message.heading ? headingComplete : systemComplete;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      className="absolute left-4 top-32 min-w-56 max-w-[calc(100vw-6rem)] px-3 py-2 sm:left-8 sm:top-32 sm:min-w-72"
    >
      <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-caution/85">
        <TypewriterText
          text={message.system}
          speed={24}
          restartKey={`${phaseId}-system`}
          onComplete={() => setSystemComplete(true)}
        />
      </p>

      <div className="mt-1.5 flex min-h-5 items-center gap-3">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-caution" />
        {systemComplete && message.heading && (
          <p className="font-hud text-xs font-semibold uppercase tracking-[0.14em] text-sunlight sm:text-sm">
            <TypewriterText
              text={message.heading}
              speed={30}
              restartKey={`${phaseId}-heading`}
              onComplete={() => setHeadingComplete(true)}
              showCursor={!headingComplete}
            />
          </p>
        )}
      </div>

      <AnimatePresence>
        {contentReady && message.status && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
          >
            {message.status && (
              <p className="mt-2 font-hud text-[10px] uppercase tracking-[0.16em] text-suit/60">
                {message.status}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Phases whose story is told by the radio transcript or visor site map instead of this panel.
const radioPhases: ReadonlySet<JourneyPhaseId> = new Set([
  "loading",
  "space",
  "spacewalk",
  "planet-approach",
  "planet-surface",
  "landfall",
  "city",
]);

export default function JourneyHUD() {
  const { currentPhase } = useJourney();
  const message = hudMessages[currentPhase.id];

  if (radioPhases.has(currentPhase.id) || !message) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="wait">
        <PhasePanel
          key={currentPhase.id}
          phaseId={currentPhase.id}
          message={message}
        />
      </AnimatePresence>
    </div>
  );
}
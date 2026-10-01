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

const hudMessages: Record<JourneyPhaseId, HudMessage> = {
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
    system: "DIGITAL CITY DETECTED",
  },
  healthbridge: {
    system: "LOCATION DETECTED",
    heading: "HEALTHBRIDGE DISTRICT",
    status: "ACCESSING PROJECT DATABASE...",
  },
  "ezy-map": {
    system: "LOCATION DETECTED",
    heading: "EZY MAP DISTRICT",
    status: "ACCESSING PROJECT DATABASE...",
  },
  "kv-audio": {
    system: "LOCATION DETECTED",
    heading: "KV AUDIO DISTRICT",
    status: "ACCESSING PROJECT DATABASE...",
  },
  "story-bloom": {
    system: "LOCATION DETECTED",
    heading: "STORY BLOOM DISTRICT",
    status: "ACCESSING PROJECT DATABASE...",
  },
  experience: {
    system: "LOCATION DETECTED",
    heading: "EXPERIENCE TOWER",
    status: "ACCESSING EXPERIENCE DATABASE...",
  },
  data: {
    system: "LOCATION DETECTED",
    heading: "DATA CENTER",
    status: "ACCESSING SYSTEM DATABASE...",
  },
  creative: {
    system: "LOCATION DETECTED",
    heading: "CREATIVE STUDIO",
    status: "ACCESSING CREATIVE DATABASE...",
  },
  future: {
    system: "LOCATION DETECTED",
    heading: "FUTURE LAB",
    status: "ACCESSING FUTURE DATABASE...",
  },
  contact: {
    system: "LOCATION DETECTED",
    heading: "CONTACT CENTER",
    status: "COMMUNICATION CHANNEL READY...",
  },
  complete: {
    system: "JOURNEY COMPLETE",
    heading: "CONNECTION ESTABLISHED",
  },
};

interface PhasePanelProps {
  phaseId: JourneyPhaseId;
}

function PhasePanel({ phaseId }: PhasePanelProps) {
  const reduceMotion = useReducedMotion();
  const [systemComplete, setSystemComplete] = useState(false);
  const [headingComplete, setHeadingComplete] = useState(false);
  const message = hudMessages[phaseId];
  const contentReady = message.heading ? headingComplete : systemComplete;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.35 }}
      className="terminal-panel absolute left-4 top-24 min-w-56 max-w-[calc(100vw-6rem)] border-l-2 border-l-emerald-300/50 px-3 py-2 sm:left-8 sm:min-w-72"
    >
      <p className="terminal-kicker text-emerald-200 sm:text-[10px]">
        <TypewriterText
          text={message.system}
          speed={24}
          restartKey={`${phaseId}-system`}
          onComplete={() => setSystemComplete(true)}
        />
      </p>

      <div className="mt-1.5 flex min-h-5 items-center gap-3">
        <span className="terminal-status-dot h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-cyan-200" />
        {systemComplete && message.heading && (
          <p className="terminal-title text-xs sm:text-sm">
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
              <p className="terminal-meta mt-2 text-cyan-100/55 sm:text-[10px]">
                {message.status}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function JourneyHUD() {
  const { currentPhase } = useJourney();

  if (currentPhase.id === "loading") return null;

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
        />
      </AnimatePresence>
    </div>
  );
}
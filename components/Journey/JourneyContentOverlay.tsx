"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { contactItems } from "@/data/contactData";
import TerminalPanel from "@/components/UI/TerminalPanel";
import { useJourney } from "./JourneyController";
import type { JourneyPhaseId } from "./journeyConfig";

// Acts 5–12 (projects, experience, data, creative, future) are presented by ProjectCallouts.
const panelSide: Partial<Record<JourneyPhaseId, "left" | "right">> = {
  contact: "right",
  complete: "left",
};

function Stage({
  children,
  delay,
  reduceMotion,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  reduceMotion: boolean | null;
  className?: string;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="terminal-kicker">
        {eyebrow}
      </p>
      <h2 className="terminal-title mt-1 text-base sm:text-lg">
        <span className="terminal-status-dot mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200 align-middle" />
        {title}
      </h2>
    </>
  );
}

function ContactPanel({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="p-5">
      <Stage delay={1.05} reduceMotion={reduceMotion}>
        <Header eyebrow="Communication // ready" title="Contact Center" />
      </Stage>
      <Stage delay={1.25} reduceMotion={reduceMotion} className="mt-3 grid grid-cols-2 gap-2">
        {contactItems.map((item) => {
          const external = item.href.startsWith("http");
          return (
            <Link
              key={item.id}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              download={item.id === "resume"}
              className="min-w-0 border border-white/10 bg-white/[0.025] p-2.5 transition-colors hover:border-cyan-200/40 hover:bg-cyan-200/5 focus-visible:outline-2 focus-visible:outline-cyan-200"
            >
              <span className="block font-mono text-[9px] uppercase text-cyan-100/85">{item.title}</span>
              <span className="terminal-meta mt-1 block truncate text-white/50">{item.value}</span>
            </Link>
          );
        })}
      </Stage>
    </div>
  );
}

function CompletionPanel({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="p-5">
      <Stage delay={0.45} reduceMotion={reduceMotion}>
        <Header eyebrow="Connection established" title="Pasindu Kavishka" />
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">Software Engineer</p>
      </Stage>
    </div>
  );
}

export default function JourneyContentOverlay() {
  const { currentPhase } = useJourney();
  const reduceMotion = useReducedMotion();
  const phaseId = currentPhase.id;
  const side = panelSide[phaseId];

  let content: React.ReactNode = null;
  if (side) {
    switch (phaseId) {
      case "contact": content = <ContactPanel reduceMotion={reduceMotion} />; break;
      case "complete": content = <CompletionPanel reduceMotion={reduceMotion} />; break;
      default: return null;
    }
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-10" aria-live="off">
      <AnimatePresence mode="wait">
        {side && content && (
          <motion.aside
            key={phaseId}
            aria-label={`${currentPhase.label} information`}
            initial={reduceMotion ? false : { opacity: 0, x: side === "left" ? -18 : 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: side === "left" ? -12 : 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className={`pointer-events-none absolute bottom-20 w-[min(22rem,calc(100vw-2rem))] sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 ${side === "left" ? "left-4 sm:left-8 lg:left-[7vw]" : "right-4 sm:right-8 lg:right-[7vw]"}`}
          >
            <TerminalPanel className="terminal-scroll pointer-events-auto max-h-[52vh] sm:max-h-[72vh]">
              {content}
            </TerminalPanel>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
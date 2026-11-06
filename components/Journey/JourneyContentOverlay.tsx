"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { contactItems } from "@/data/contactData";
import { creativeWorks } from "@/data/creativeData";
import { futureSkills } from "@/data/futureData";
import CreativeModal from "@/components/CreativeModal";
import TerminalPanel from "@/components/UI/TerminalPanel";
import { useJourney } from "./JourneyController";
import type { JourneyPhaseId } from "./journeyConfig";

// Acts 5–10 (projects, experience, data) are presented by ProjectCallouts, not by a panel here.
const panelSide: Partial<Record<JourneyPhaseId, "left" | "right">> = {
  creative: "right",
  future: "left",
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

function CreativePanel({
  reduceMotion,
  onSelect,
}: {
  reduceMotion: boolean | null;
  onSelect: (work: (typeof creativeWorks)[number]) => void;
}) {
  const featured = ["digital-art-1", "portfolio-wireframe", "healthbridge-poster"]
    .map((id) => creativeWorks.find((work) => work.id === id))
    .filter((work): work is (typeof creativeWorks)[number] => Boolean(work));

  return (
    <div className="p-4 sm:p-5">
      <Stage delay={0.55} reduceMotion={reduceMotion}>
        <Header eyebrow="Creative archive // curated" title="Selected Works" />
      </Stage>
      <Stage delay={1.25} reduceMotion={reduceMotion} className="mt-3 grid grid-cols-3 gap-2">
        {featured.map((work) => (
          <button
            key={work.id}
            type="button"
            onClick={() => onSelect(work)}
            aria-label={`View ${work.title}, ${work.category}`}
            className="group min-w-0 text-left focus-visible:outline-2 focus-visible:outline-cyan-200"
          >
            <span className="relative block aspect-square overflow-hidden border border-white/10">
              <Image src={work.image} alt={work.title} fill priority sizes="105px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </span>
            <span className="terminal-kicker mt-1 block truncate">{work.category}</span>
            <span className="terminal-meta block truncate text-white/65">{work.title}</span>
          </button>
        ))}
      </Stage>
      <Stage delay={1.5} reduceMotion={reduceMotion}>
        <Link href="/creative" className="terminal-control mt-3">
          View all creative works
        </Link>
      </Stage>
    </div>
  );
}

function FuturePanel({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="p-5">
      <Stage delay={1.05} reduceMotion={reduceMotion}>
        <Header eyebrow="Learning targets // active" title="Future Lab" />
      </Stage>
      <Stage delay={1.25} reduceMotion={reduceMotion} className="mt-3 space-y-2.5">
        {futureSkills.slice(0, 4).map((skill) => (
          <div key={skill.id}>
            <div className="flex justify-between font-mono text-[9px] uppercase text-white/70"><span>{skill.title}</span><span>{skill.progress}%</span></div>
            <div
              className="my-1 h-1 bg-white/10"
              role="progressbar"
              aria-label={`${skill.title} learning progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skill.progress}
            >
              <div className="h-full bg-emerald-200/70" style={{ width: `${skill.progress}%` }} />
            </div>
            <p className="terminal-copy text-[10px]">{skill.description}</p>
          </div>
        ))}
      </Stage>
      <Stage delay={1.5} reduceMotion={reduceMotion}>
        <details className="mt-3 text-xs text-white/55">
          <summary className="cursor-pointer font-mono text-[10px] uppercase text-cyan-100/75">More learning targets</summary>
          <ul className="mt-2 space-y-2">
            {futureSkills.slice(4).map((skill) => <li key={skill.id}><span className="text-cyan-100/75">{skill.title} · {skill.progress}%</span><br />{skill.description}</li>)}
          </ul>
        </details>
      </Stage>
    </div>
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
  const [selectedWork, setSelectedWork] = useState<(typeof creativeWorks)[number] | null>(null);
  const phaseId = currentPhase.id;
  const side = panelSide[phaseId];

  let content: React.ReactNode = null;
  if (side) {
    switch (phaseId) {
      case "creative": content = <CreativePanel reduceMotion={reduceMotion} onSelect={setSelectedWork} />; break;
      case "future": content = <FuturePanel reduceMotion={reduceMotion} />; break;
      case "contact": content = <ContactPanel reduceMotion={reduceMotion} />; break;
      case "complete": content = <CompletionPanel reduceMotion={reduceMotion} />; break;
      default: return null;
    }
  }

  return (
    <>
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
      <AnimatePresence>
        {selectedWork && (
          <CreativeModal
            image={selectedWork.image}
            title={selectedWork.title}
            category={selectedWork.category}
            description={selectedWork.description}
            tools={selectedWork.tools}
            onClose={() => setSelectedWork(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
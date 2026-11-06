"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useState } from "react";

import { projects } from "@/data/portfolioData";
import { useJourney } from "./JourneyController";
import { outpostStructures } from "./journeyWorldConfig";
import { activateJourneyProject } from "./projectActivation";

const PROJECT_IDS = ["healthbridge", "ezymap", "kvaudio", "storybloom"] as const;
type CalloutId = (typeof PROJECT_IDS)[number];

const panelSide: Record<CalloutId, "left" | "right"> = {
  healthbridge: "right",
  ezymap: "left",
  kvaudio: "right",
  storybloom: "left",
};

/** The callout is up while the camera dwells at its structure. */
const BEFORE = 0.026;
const AFTER = 0.034;

const specs = PROJECT_IDS.map((id) => {
  const outpost = outpostStructures.find((item) => item.id === id);
  const project = projects.find((item) => item.id === id);

  return outpost && project ? { id, outpost, project } : null;
}).filter((item): item is NonNullable<typeof item> => item !== null);

function findActiveId(progress: number): CalloutId | null {
  const match = specs.find(
    ({ outpost }) =>
      progress >= outpost.targetProgress - BEFORE &&
      progress <= outpost.targetProgress + AFTER
  );

  return match?.id ?? null;
}

/**
 * AR callouts for the four project structures (docs/DESIGN_PLAN.md §5.5): a
 * thin leader line from a compact data block to the structure at the centre
 * of the visor, with the facts from data/portfolioData.ts and the
 * OPEN MISSION FILE action.
 */
export default function ProjectCallouts() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<CalloutId | null>(() =>
    findActiveId(progress.get())
  );

  useMotionValueEvent(progress, "change", (value) => {
    const next = findActiveId(value);

    setActiveId((previous) => (previous === next ? previous : next));
  });

  const active = specs.find((item) => item.id === activeId);

  return (
    <div
      data-layer="project-callouts"
      className="pointer-events-none fixed inset-0 z-[43]"
    >
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.35 }}
            className="absolute inset-0"
          >
            <Callout
              side={panelSide[active.id]}
              code={active.outpost.code}
              structure={active.outpost.structure}
              project={active.project}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CalloutProps {
  side: "left" | "right";
  code: string;
  structure: string;
  project: (typeof projects)[number];
}

function Callout({ side, code, structure, project }: CalloutProps) {
  const isRight = side === "right";

  return (
    <>
      {/* Target reticle on the structure, and the leader line to the data block. */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2"
      >
        <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-caution/80" />
        <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-caution/80" />
        <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-caution/80" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-caution/80" />
      </span>
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-caution"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 hidden h-px bg-caution/60 lg:block"
        style={
          isRight
            ? {
                left: "calc(50% + 26px)",
                width: "max(0px, calc(43vw - 22rem - 26px))",
              }
            : {
                right: "calc(50% + 26px)",
                width: "max(0px, calc(43vw - 22rem - 26px))",
              }
        }
      />

      <aside
        aria-label={`${project.title} mission summary`}
        className={`pointer-events-auto absolute bottom-[96px] w-[min(22rem,calc(100vw-2rem))] border border-suit/15 border-l-2 border-l-caution bg-void/82 p-3.5 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:p-5 ${
          isRight
            ? "right-4 sm:right-8 lg:right-[7vw]"
            : "left-4 sm:left-8 lg:left-[7vw]"
        }`}
      >
        <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-caution">
          {code} <span className="text-caution/50">{"//"}</span> {structure}
        </p>
        <h2 className="mt-1 font-hud text-base font-semibold uppercase tracking-[0.1em] text-sunlight sm:mt-2 sm:text-xl">
          {project.title}
        </h2>
        <p className="mt-1 font-radio text-xs leading-snug text-suit/80 sm:mt-1.5 sm:text-[13px]">
          {project.subtitle}
        </p>

        <ul className="mt-2 space-y-1 border-t border-suit/15 pt-2 sm:mt-3.5 sm:space-y-1.5 sm:pt-3">
          {project.features.slice(0, 4).map((feature, index) => (
            <li
              key={feature}
              className={`${
                index === 3 ? "hidden sm:flex" : "flex"
              } gap-2 font-radio text-xs leading-snug text-suit/85 sm:text-[12.5px]`}
            >
              <span aria-hidden="true" className="mt-px font-hud text-caution">
                ›
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <ul className="mt-3.5 hidden flex-wrap gap-1.5 sm:flex">
          {project.technologies.slice(0, 5).map((technology) => (
            <li
              key={technology}
              className="border border-suit/25 px-1.5 py-0.5 font-hud text-[9px] uppercase tracking-[0.12em] text-suit/70"
            >
              {technology}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => activateJourneyProject(project.id)}
          className="mt-3 inline-flex items-center gap-2 bg-signal px-3.5 py-2 font-hud text-[10px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors duration-200 hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution sm:mt-4 sm:px-4 sm:py-2.5 sm:text-[11px]"
        >
          Open mission file <span aria-hidden="true">→</span>
        </button>
      </aside>
    </>
  );
}

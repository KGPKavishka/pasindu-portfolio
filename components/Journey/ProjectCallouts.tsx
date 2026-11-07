"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import CreativeModal from "@/components/CreativeModal";
import { contactItems } from "@/data/contactData";
import { creativeWorks } from "@/data/creativeData";
import { experiences } from "@/data/experienceData";
import { futureSkills } from "@/data/futureData";
import { projects } from "@/data/portfolioData";
import { skills } from "@/data/skillsData";
import { useJourney } from "./JourneyController";
import {
  outpostStructures,
  type OutpostStructureSpec,
} from "./journeyWorldConfig";
import { activateJourneyProject } from "./projectActivation";

const CALLOUT_IDS = [
  "healthbridge",
  "ezymap",
  "kvaudio",
  "storybloom",
  "experience",
  "data",
  "creative",
  "future",
  "contact",
] as const;
type CalloutId = (typeof CALLOUT_IDS)[number];

const panelSide: Record<CalloutId, "left" | "right"> = {
  healthbridge: "right",
  ezymap: "left",
  kvaudio: "right",
  storybloom: "left",
  experience: "left",
  data: "right",
  creative: "right",
  future: "left",
  contact: "right",
};

/** The callout is up while the camera dwells at its structure. */
const BEFORE = 0.026;
const AFTER = 0.034;

const PINNED_CREATIVE_IDS = [
  "digital-art-1",
  "art-1",
  "painting-1",
  "portfolio-wireframe",
  "healthbridge-poster",
  "logo-1",
] as const;

const pinnedCreativeWorks = PINNED_CREATIVE_IDS.map((id) =>
  creativeWorks.find((work) => work.id === id)
).filter((work): work is (typeof creativeWorks)[number] => Boolean(work));

type CalloutSpec =
  | {
      kind: "project";
      id: CalloutId;
      outpost: OutpostStructureSpec;
      project: (typeof projects)[number];
    }
  | {
      kind: "experience";
      id: "experience";
      outpost: OutpostStructureSpec;
      experience: (typeof experiences)[number];
    }
  | {
      kind: "data";
      id: "data";
      outpost: OutpostStructureSpec;
      skills: typeof skills;
    }
  | {
      kind: "creative";
      id: "creative";
      outpost: OutpostStructureSpec;
      works: typeof pinnedCreativeWorks;
      totalCount: number;
    }
  | {
      kind: "future";
      id: "future";
      outpost: OutpostStructureSpec;
      targets: typeof futureSkills;
    }
  | {
      kind: "contact";
      id: "contact";
      outpost: OutpostStructureSpec;
      items: typeof contactItems;
    };

const specs: CalloutSpec[] = CALLOUT_IDS.map((id): CalloutSpec | null => {
  const outpost = outpostStructures.find((item) => item.id === id);
  if (!outpost) return null;

  if (id === "experience") {
    const experience = experiences[0];
    return experience ? { kind: "experience", id, outpost, experience } : null;
  }

  if (id === "data") {
    return { kind: "data", id, outpost, skills };
  }

  if (id === "creative") {
    return {
      kind: "creative",
      id,
      outpost,
      works: pinnedCreativeWorks,
      totalCount: creativeWorks.length,
    };
  }

  if (id === "future") {
    return {
      kind: "future",
      id,
      outpost,
      targets: futureSkills,
    };
  }

  if (id === "contact") {
    return {
      kind: "contact",
      id,
      outpost,
      items: contactItems,
    };
  }

  const project = projects.find((item) => item.id === id);
  return project ? { kind: "project", id, outpost, project } : null;
}).filter((item): item is CalloutSpec => item !== null);

function findActiveId(progress: number): CalloutId | null {
  const match = specs.find(({ id, outpost }) => {
    const afterWindow = id === "contact" ? 0.017 : AFTER;

    return (
      progress >= outpost.targetProgress - BEFORE &&
      progress <= outpost.targetProgress + afterWindow
    );
  });

  return match?.id ?? null;
}

function stripSkillEmoji(title: string): string {
  return title.replace(/^[^\w]+/, "").trim();
}

/**
 * AR callouts for the surface structures (docs/DESIGN_PLAN.md §5.5 & §2 Acts 5–12):
 * a thin leader line from a compact data block to the structure at the centre
 * of the visor, with facts strictly from data/portfolioData.ts, data/experienceData.ts,
 * data/skillsData.ts, data/creativeData.ts, and data/futureData.ts.
 */
export default function ProjectCallouts() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<CalloutId | null>(() =>
    findActiveId(progress.get())
  );
  const [selectedWork, setSelectedWork] = useState<
    (typeof creativeWorks)[number] | null
  >(null);

  useMotionValueEvent(progress, "change", (value) => {
    const next = findActiveId(value);

    setActiveId((previous) => (previous === next ? previous : next));
  });

  const active = specs.find((item) => item.id === activeId);

  return (
    <>
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
                spec={active}
                side={panelSide[active.id]}
                onSelectWork={setSelectedWork}
              />
            </motion.div>
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

interface CalloutProps {
  spec: CalloutSpec;
  side: "left" | "right";
  onSelectWork: (work: (typeof creativeWorks)[number]) => void;
}

function Callout({ spec, side, onSelectWork }: CalloutProps) {
  const isRight = side === "right";
  const { code, structure } = spec.outpost;

  const ariaLabel =
    spec.kind === "project"
      ? `${spec.project.title} mission summary`
      : spec.kind === "experience"
        ? `${spec.experience.company} crew habitat log`
        : spec.kind === "data"
          ? "Power Grid solar array telemetry"
          : spec.kind === "creative"
            ? "Off-Shift Quarters creative archive"
            : spec.kind === "future"
              ? "Ridge Observatory signal-lock telemetry"
              : "Comms Mast direct uplink channels";

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
        aria-label={ariaLabel}
        className={`pointer-events-auto absolute bottom-[96px] w-[min(22rem,calc(100vw-2rem))] border border-suit/15 border-l-2 border-l-caution bg-void/82 p-3.5 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:p-5 ${
          isRight
            ? "right-4 sm:right-8 lg:right-[7vw]"
            : "left-4 sm:left-8 lg:left-[7vw]"
        }`}
      >
        <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-caution">
          {code} <span className="text-caution/50">{"//"}</span> {structure}
        </p>

        {spec.kind === "project" && <ProjectBody project={spec.project} />}
        {spec.kind === "experience" && (
          <ExperienceBody experience={spec.experience} />
        )}
        {spec.kind === "data" && <DataBody skillsList={spec.skills} />}
        {spec.kind === "creative" && (
          <CreativeBody
            works={spec.works}
            totalCount={spec.totalCount}
            onSelect={onSelectWork}
          />
        )}
        {spec.kind === "future" && <FutureBody targets={spec.targets} />}
        {spec.kind === "contact" && <ContactBody items={spec.items} />}
      </aside>
    </>
  );
}

function ProjectBody({ project }: { project: (typeof projects)[number] }) {
  return (
    <>
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
    </>
  );
}

function ExperienceBody({
  experience,
}: {
  experience: (typeof experiences)[number];
}) {
  return (
    <>
      <h2 className="mt-1 font-hud text-sm font-semibold uppercase tracking-[0.08em] text-sunlight sm:mt-2 sm:text-lg">
        {experience.company}
      </h2>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-hud text-[10px] uppercase tracking-[0.16em] text-suit/75 sm:mt-1.5 sm:text-[11px]">
        <span className="text-sunlight/90">{experience.role}</span>
        <span aria-hidden="true" className="text-caution/60">
          ·
        </span>
        <span className="text-caution">{experience.duration}</span>
      </div>

      <div className="mt-1.5 flex items-center justify-between border-y border-suit/15 py-1.5 font-hud text-[9.5px] uppercase tracking-[0.16em] sm:mt-2.5 sm:py-2 sm:text-[10px]">
        <span className="text-suit/75">
          ASSIGNED: <strong className="text-sunlight">{experience.project}</strong>
        </span>
        <span className="text-nominal">600+ HRS LOGGED</span>
      </div>

      <p className="mt-1.5 hidden font-radio text-xs leading-snug text-suit/80 sm:mt-2.5 sm:block sm:text-[12.5px]">
        {experience.description}
      </p>

      <ul className="mt-2 space-y-1 sm:mt-3 sm:space-y-1.5">
        {experience.achievements.map((achievement, index) => (
          <li
            key={achievement}
            className={`${
              index >= 3 ? "hidden sm:flex" : "flex"
            } gap-2 font-radio text-xs leading-snug text-suit/85 sm:text-[12px]`}
          >
            <span aria-hidden="true" className="mt-px font-hud text-caution">
              ›
            </span>
            {achievement}
          </li>
        ))}
      </ul>

      <ul className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
        {experience.technologies.map((technology) => (
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
        onClick={() => activateJourneyProject("ezymap")}
        className="mt-2.5 inline-flex items-center gap-2 bg-signal px-3.5 py-2 font-hud text-[10px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors duration-200 hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution sm:mt-3.5 sm:px-4 sm:py-2.5 sm:text-[11px]"
      >
        Open Ezy Map file <span aria-hidden="true">→</span>
      </button>
    </>
  );
}

function DataBody({ skillsList }: { skillsList: typeof skills }) {
  return (
    <>
      <h2 className="mt-1 font-hud text-base font-semibold uppercase tracking-[0.1em] text-sunlight sm:mt-2 sm:text-xl">
        Solar Array Telemetry
      </h2>
      <p className="mt-0.5 font-hud text-[9.5px] uppercase tracking-[0.18em] text-suit/65 sm:mt-1 sm:text-[10px]">
        5 Arrays Online <span className="text-caution/60">·</span> Output Nominal
      </p>

      <div className="mt-2 space-y-1.5 border-t border-suit/15 pt-2 sm:mt-3 sm:space-y-2.5 sm:pt-3">
        {skillsList.map((skill, index) => {
          const cleanTitle = stripSkillEmoji(skill.title);
          return (
            <div key={skill.id}>
              <div className="flex items-baseline justify-between gap-2 font-hud text-[10px] uppercase tracking-[0.15em]">
                <span className="text-sunlight">
                  <span className="mr-1.5 text-caution/75">
                    0{index + 1}
                  </span>
                  {cleanTitle}
                </span>
                <span className="tabular-nums text-caution">
                  {skill.level}% OUTPUT
                </span>
              </div>
              <div
                className="mt-1 h-1 bg-suit/15"
                role="progressbar"
                aria-label={`${cleanTitle} power output`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={skill.level}
              >
                <div
                  className="h-full bg-caution"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <p className="mt-0.5 truncate font-radio text-[10.5px] text-suit/70 sm:mt-1 sm:text-[11.5px]">
                {skill.technologies.join(" · ")}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function CreativeBody({
  works,
  totalCount,
  onSelect,
}: {
  works: typeof pinnedCreativeWorks;
  totalCount: number;
  onSelect: (work: (typeof creativeWorks)[number]) => void;
}) {
  return (
    <>
      <h2 className="mt-1 font-hud text-base font-semibold uppercase tracking-[0.1em] text-sunlight sm:mt-2 sm:text-xl">
        Off-Shift Quarters
      </h2>
      <p className="mt-0.5 font-hud text-[9.5px] uppercase tracking-[0.16em] text-suit/65 sm:mt-1 sm:text-[10px]">
        {totalCount} Works Pinned <span className="text-caution/60">·</span> Art
        · UI · Research · Logo
      </p>

      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-suit/15 pt-2 sm:mt-3 sm:gap-2.5 sm:pt-3">
        {works.map((work, index) => (
          <button
            key={work.id}
            type="button"
            onClick={() => onSelect(work)}
            aria-label={`Inspect ${work.title}, ${work.category}`}
            className={`${
              index >= 3 ? "hidden sm:block" : "block"
            } group min-w-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution`}
          >
            <span className="relative block aspect-square overflow-hidden border border-suit/25 bg-void transition-colors group-hover:border-caution">
              <Image
                src={work.image}
                alt={work.title}
                fill
                sizes="105px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </span>
            <span className="mt-1 block truncate font-hud text-[8.5px] uppercase tracking-[0.14em] text-caution">
              {work.category}
            </span>
            <span className="block truncate font-radio text-[10.5px] text-suit/85 group-hover:text-sunlight">
              {work.title}
            </span>
          </button>
        ))}
      </div>

      <Link
        href="/creative"
        className="mt-2.5 inline-flex items-center gap-2 bg-signal px-3.5 py-2 font-hud text-[10px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors duration-200 hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution sm:mt-3.5 sm:px-4 sm:py-2.5 sm:text-[11px]"
      >
        Open full archive ({totalCount}) <span aria-hidden="true">→</span>
      </Link>
    </>
  );
}

function FutureBody({ targets }: { targets: typeof futureSkills }) {
  return (
    <>
      <h2 className="mt-1 font-hud text-base font-semibold uppercase tracking-[0.1em] text-sunlight sm:mt-2 sm:text-xl">
        Signal Lock Telemetry
      </h2>
      <p className="mt-0.5 font-hud text-[9.5px] uppercase tracking-[0.16em] text-suit/65 sm:mt-1 sm:text-[10px]">
        {targets.length} Active Targets{" "}
        <span className="text-caution/60">·</span> Blue-Hour Pass
      </p>

      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-suit/15 pt-2 sm:mt-3 sm:grid-cols-1 sm:gap-y-2 sm:pt-3">
        {targets.map((skill, index) => (
          <div key={skill.id} title={skill.description}>
            <div className="flex items-baseline justify-between gap-1.5 font-hud text-[9.5px] uppercase tracking-[0.12em] sm:text-[10px]">
              <span className="truncate text-sunlight">
                <span className="mr-1 text-caution/75">
                  0{index + 1}
                </span>
                {skill.title}
              </span>
              <span className="shrink-0 tabular-nums text-caution">
                {skill.progress}%
              </span>
            </div>
            <div
              className="mt-0.5 h-1 bg-suit/15 sm:mt-1"
              role="progressbar"
              aria-label={`${skill.title} signal lock`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skill.progress}
            >
              <div
                className="h-full bg-caution"
                style={{ width: `${skill.progress}%` }}
              />
            </div>
            <p className="mt-0.5 hidden truncate font-radio text-[10.5px] text-suit/65 sm:block">
              {skill.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function ContactBody({ items }: { items: typeof contactItems }) {
  const directLinks = items.filter((item) => item.id !== "resume");
  const resumeItem = items.find((item) => item.id === "resume");

  return (
    <>
      <h2 className="mt-1 font-hud text-base font-semibold uppercase tracking-[0.1em] text-sunlight sm:mt-2 sm:text-xl">
        Direct Comms Channel
      </h2>
      <p className="mt-0.5 font-hud text-[9.5px] uppercase tracking-[0.16em] text-nominal sm:mt-1 sm:text-[10px]">
        {items.length} Uplink Channels Active{" "}
        <span className="text-caution/60">·</span> Signal Clear
      </p>

      <div className="mt-2 space-y-1.5 border-t border-suit/15 pt-2 sm:mt-3 sm:space-y-2 sm:pt-3">
        {directLinks.map((item, index) => {
          const external = item.href.startsWith("http");

          return (
            <Link
              key={item.id}
              href={item.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-3 border border-suit/20 bg-void/70 px-3 py-2 transition-colors hover:border-caution hover:bg-suit/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
            >
              <span className="min-w-0">
                <span className="block font-hud text-[9px] uppercase tracking-[0.2em] text-caution">
                  CH-0{index + 1} {"//"} {item.title}
                </span>
                <span className="mt-0.5 block truncate font-radio text-xs text-suit/90 group-hover:text-sunlight sm:text-[13px]">
                  {item.value}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 font-hud text-xs text-caution transition-transform group-hover:translate-x-0.5"
              >
                {external ? "↗" : "→"}
              </span>
            </Link>
          );
        })}
      </div>

      {resumeItem && (
        <a
          href={resumeItem.href}
          download
          className="mt-2.5 inline-flex items-center gap-2 bg-signal px-3.5 py-2 font-hud text-[10px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors duration-200 hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution sm:mt-3.5 sm:px-4 sm:py-2.5 sm:text-[11px]"
        >
          {resumeItem.value} ({resumeItem.title}) <span aria-hidden="true">↓</span>
        </a>
      )}
    </>
  );
}

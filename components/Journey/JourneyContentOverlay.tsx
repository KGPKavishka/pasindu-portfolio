"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { contactItems } from "@/data/contactData";
import { creativeWorks } from "@/data/creativeData";
import { experiences } from "@/data/experienceData";
import { futureSkills } from "@/data/futureData";
import { projects } from "@/data/portfolioData";
import { skills } from "@/data/skillsData";
import CreativeModal from "@/components/CreativeModal";
import TerminalPanel from "@/components/UI/TerminalPanel";
import { useJourney } from "./JourneyController";
import type { JourneyPhaseId } from "./journeyConfig";
import { activateJourneyProject } from "./projectActivation";

const projectsByPhase = {
  healthbridge: "healthbridge",
  "ezy-map": "ezymap",
  "kv-audio": "kvaudio",
  "story-bloom": "storybloom",
} as const;

const panelSide: Partial<Record<JourneyPhaseId, "left" | "right">> = {
  city: "left",
  healthbridge: "right",
  "ezy-map": "left",
  "kv-audio": "right",
  "story-bloom": "left",
  experience: "left",
  data: "right",
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

function TechTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="terminal-chip px-2 py-1">
      {children}
    </span>
  );
}

function ProjectPanel({
  phaseId,
  reduceMotion,
}: {
  phaseId: keyof typeof projectsByPhase;
  reduceMotion: boolean | null;
}) {
  const project = projects.find((item) => item.id === projectsByPhase[phaseId]);
  if (!project) return null;

  return (
    <>
      <Stage delay={1.05} reduceMotion={reduceMotion}>
        <div className="terminal-image-frame relative aspect-[16/8] overflow-hidden border-b border-cyan-200/15">
          <Image
            src={project.heroImage}
            alt={`${project.title} project preview`}
            fill
            priority
            sizes="(max-width: 640px) calc(100vw - 2rem), 352px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020711]/90 via-transparent to-transparent" />
        </div>
      </Stage>
      <div className="p-4 sm:p-5">
        <Stage delay={1.2} reduceMotion={reduceMotion}>
          <Header eyebrow={`${project.id} // project archive`} title={project.title} />
          <p className="terminal-meta mt-1">{project.subtitle}</p>
          <p className="terminal-copy mt-2">{project.description}</p>
        </Stage>
        <Stage delay={1.4} reduceMotion={reduceMotion} className="mt-3 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((technology) => (
            <TechTag key={technology}>{technology}</TechTag>
          ))}
        </Stage>
        <Stage delay={1.6} reduceMotion={reduceMotion}>
          <button
            type="button"
            onClick={() => activateJourneyProject(project.id)}
            className="terminal-control mt-3"
          >
            View project details
          </button>
        </Stage>
      </div>
    </>
  );
}

function CityPanel({ reduceMotion }: { reduceMotion: boolean | null }) {
  const metrics = [
    ["600+", "Internship hours"],
    ["4+", "Major projects"],
    ["20+", "Technologies"],
    ["1", "Research project"],
  ];

  return (
    <div className="p-5">
      <Stage delay={0.45} reduceMotion={reduceMotion}>
        <Header eyebrow="Transit hub // online" title="Digital City" />
        <p className="mt-2 text-xs leading-5 text-white/60">
          Explore the projects, experiences, skills and future innovations that make up my software engineering city.
        </p>
      </Stage>
      <Stage delay={0.62} reduceMotion={reduceMotion}>
        <p className="mt-3 font-mono text-[9px] uppercase text-cyan-100/55">
          Four project districts // experience // data // creative // future
        </p>
      </Stage>
      <Stage delay={0.78} reduceMotion={reduceMotion} className="mt-3 grid grid-cols-2 gap-2">
        {metrics.map(([value, label]) => (
          <div key={label} className="border-l border-cyan-200/25 pl-2">
            <p className="font-mono text-sm text-cyan-100">{value}</p>
            <p className="text-[9px] uppercase text-white/45">{label}</p>
          </div>
        ))}
      </Stage>
    </div>
  );
}

function ExperiencePanel({ reduceMotion }: { reduceMotion: boolean | null }) {
  const experience = experiences[0];
  const relatedProject = projects.find((project) => project.id === "ezymap");
  return (
    <div className="p-5">
      {relatedProject && (
        <Stage delay={1.05} reduceMotion={reduceMotion}>
          <div className="terminal-image-frame relative mb-3 aspect-[16/7] overflow-hidden border-b border-cyan-200/15">
            <Image
              src={relatedProject.heroImage}
              alt={`${relatedProject.title} internship project preview`}
              fill
              priority
              sizes="(max-width: 640px) calc(100vw - 2rem), 352px"
              className="object-cover"
            />
          </div>
        </Stage>
      )}
      <Stage delay={1.05} reduceMotion={reduceMotion}>
        <Header eyebrow="Experience archive // 01" title={experience.company} />
        <p className="terminal-meta mt-1">{experience.role}</p>
        <p className="terminal-meta mt-1 text-white/50">{experience.duration}</p>
        <p className="terminal-kicker mt-1">Project // {experience.project}</p>
        <div className="mt-3 border-l border-cyan-200/35 pl-3">
          <p className="terminal-copy">{experience.description}</p>
        </div>
        <p className="terminal-meta mt-3 text-emerald-200/80">600+ hours completed</p>
      </Stage>
      <Stage delay={1.4} reduceMotion={reduceMotion} className="mt-3 flex flex-wrap gap-1.5">
        {experience.technologies.slice(0, 4).map((technology) => (
          <TechTag key={technology}>{technology}</TechTag>
        ))}
      </Stage>
      <Stage delay={1.6} reduceMotion={reduceMotion}>
        <details className="mt-3 text-xs text-white/55">
          <summary className="cursor-pointer font-mono text-[10px] uppercase text-cyan-100/75">Responsibilities</summary>
          <ul className="mt-2 space-y-1 pl-3">
            {experience.achievements.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </details>
      </Stage>
    </div>
  );
}

function DataPanel({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="p-5">
      <Stage delay={1.05} reduceMotion={reduceMotion}>
        <Header eyebrow="Systems index // live" title="Data Center" />
      </Stage>
      <Stage delay={1.25} reduceMotion={reduceMotion} className="mt-3 space-y-2.5">
        {skills.map((skill) => (
          <div key={skill.id}>
            <div className="flex justify-between gap-3 font-mono text-[9px] uppercase text-white/70">
              <span>{skill.title}</span><span>{skill.level}%</span>
            </div>
            <div
              className="mt-1 h-1 bg-white/10"
              role="progressbar"
              aria-label={`${skill.title} proficiency`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skill.level}
            >
              <div className="h-full bg-cyan-200/75" style={{ width: `${skill.level}%` }} />
            </div>
            <p className="terminal-meta mt-1 truncate text-white/40">{skill.technologies.join(" // ")}</p>
          </div>
        ))}
      </Stage>
    </div>
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
  if (side && phaseId in projectsByPhase) {
    content = <ProjectPanel phaseId={phaseId as keyof typeof projectsByPhase} reduceMotion={reduceMotion} />;
  } else if (side) {
    switch (phaseId) {
      case "city": content = <CityPanel reduceMotion={reduceMotion} />; break;
      case "experience": content = <ExperiencePanel reduceMotion={reduceMotion} />; break;
      case "data": content = <DataPanel reduceMotion={reduceMotion} />; break;
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
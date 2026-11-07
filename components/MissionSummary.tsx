"use client";

import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import CreativeModal from "@/components/CreativeModal";
import { outpostStructures } from "@/components/Journey/journeyWorldConfig";
import { missionStats } from "@/components/Journey/missionStats";
import ProjectModal from "@/components/ProjectModal";
import { aboutBio } from "@/data/aboutData";
import { contactItems } from "@/data/contactData";
import { creativeWorks } from "@/data/creativeData";
import { experiences } from "@/data/experienceData";
import { futureSkills } from "@/data/futureData";
import { projects } from "@/data/portfolioData";
import { skills } from "@/data/skillsData";
import type { Project } from "@/types/project";

interface MissionSummaryProps {
  /**
   * "active" renders the visible single-page Mission Summary dossier (used when
   * toggled from the HUD or when WebGL is unavailable).
   * "seo" renders the same semantic content in a visually-hidden container so
   * search engines and screen readers index the complete portfolio in SSR HTML
   * while the 3D EVA experience is active.
   */
  mode?: "active" | "seo";
  webglSupported?: boolean;
  onExitSummary?: () => void;
}

function stripLeadingEmoji(text: string): string {
  return text.replace(/^[^\w]+/, "").trim();
}

export default function MissionSummary({
  mode = "active",
  webglSupported = true,
  onExitSummary,
}: MissionSummaryProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedWork, setSelectedWork] = useState<
    (typeof creativeWorks)[number] | null
  >(null);

  const isSeo = mode === "seo";
  const sectionId = (id: string) => (isSeo ? undefined : id);
  const sortedFuture = [...futureSkills].sort(
    (a, b) => b.progress - a.progress
  );
  const featuredCreative = creativeWorks.slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <div
      id={sectionId("mission-summary")}
      data-layer={isSeo ? "mission-summary-seo" : "mission-summary-active"}
      className={
        isSeo
          ? "sr-only"
          : "relative z-20 min-h-screen bg-void pt-20 pb-24 text-suit sm:pt-24"
      }
    >
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        {/* Act 01–02: Hero, Bio & EVA Manifest Stats */}
        <section
          id={sectionId("home")}
          aria-labelledby={isSeo ? undefined : "summary-hero-heading"}
          className="border border-suit/20 border-t-2 border-t-caution bg-[#0d0d0c] p-6 sm:p-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-suit/15 pb-4">
            <p className="font-hud text-[11px] uppercase tracking-[0.24em] text-caution">
              EVA-01 {"//"} MISSION SUMMARY DOSSIER · PLAIN TELEMETRY VIEW
            </p>
            {!webglSupported ? (
              <span className="border border-caution/50 bg-caution/10 px-2.5 py-1 font-hud text-[10px] uppercase tracking-[0.18em] text-caution">
                WebGL Unavailable {"//"} Standard Dossier Active
              </span>
            ) : (
              <span className="font-hud text-[10px] uppercase tracking-[0.2em] text-nominal">
                ALL DATA SYNCHRONIZED {"//"} NO-3D FAST VIEW
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div>
              <h1
                id={isSeo ? undefined : "summary-hero-heading"}
                className="font-hud text-2xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-4xl"
              >
                Pasindu Kavishka
              </h1>

              <p className="mt-2 font-hud text-xs uppercase tracking-[0.24em] text-caution sm:text-sm">
                Software Engineer{" "}
                <span aria-hidden="true" className="text-caution/50">
                  {"//"}
                </span>{" "}
                Digital Astronaut
              </p>

              <p className="mt-4 font-radio text-base leading-relaxed text-suit/90 sm:text-lg">
                Building scalable web, mobile, cloud and AI-powered solutions.
              </p>

              <div className="mt-4 space-y-2.5 border-l-2 border-caution/60 pl-4 font-radio text-sm leading-relaxed text-suit/80 sm:text-[15px]">
                {aboutBio.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>

              {!isSeo && (
                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  {webglSupported && onExitSummary && (
                    <button
                      type="button"
                      onClick={onExitSummary}
                      className="inline-flex items-center gap-2 bg-signal px-5 py-2.5 font-hud text-[11px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                    >
                      [ Return to 3D EVA ]
                    </button>
                  )}

                  <a
                    href="/resume.pdf"
                    download="Pasindu_Kavishka_CV.pdf"
                    className="inline-flex items-center gap-2 border border-suit/40 bg-void/70 px-5 py-2.5 font-hud text-[11px] font-semibold uppercase tracking-[0.22em] text-suit transition-colors hover:border-caution hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                  >
                    Download CV <span aria-hidden="true">↓</span>
                  </a>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 border border-suit/25 px-4 py-2.5 font-hud text-[11px] uppercase tracking-[0.2em] text-suit/85 transition-colors hover:border-caution hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                  >
                    Direct Comms <span aria-hidden="true">→</span>
                  </a>
                </div>
              )}
            </div>

            {/* EVA Manifest Headline Numbers */}
            <div className="border border-suit/20 bg-void/80 p-5">
              <p className="font-hud text-[10px] uppercase tracking-[0.24em] text-caution">
                ACT 02 {"//"} EVA MANIFEST TELEMETRY
              </p>

              <dl className="mt-4 grid grid-cols-2 gap-4">
                {missionStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="border border-suit/15 bg-[#121210] p-3.5"
                  >
                    <dt className="font-hud text-[10px] uppercase tracking-[0.16em] text-suit/75">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-hud text-2xl font-semibold tabular-nums text-sunlight sm:text-3xl">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Acts 05–08: Project Structures */}
        <section
          id={sectionId("projects")}
          aria-labelledby={isSeo ? undefined : "summary-projects-heading"}
          className="scroll-mt-24 space-y-6"
        >
          <div className="border-b border-suit/20 pb-3">
            <p className="font-hud text-[10px] uppercase tracking-[0.26em] text-caution">
              ACTS 05–08 {"//"} OUTPOST PROJECT STRUCTURES
            </p>
            <h2
              id={isSeo ? undefined : "summary-projects-heading"}
              className="mt-1 font-hud text-xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-2xl"
            >
              01 {"//"} Engineered Systems & Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {projects.map((project) => {
              const outpost = outpostStructures.find(
                (item) => item.id === project.id
              );

              return (
                <article
                  key={project.id}
                  className="flex flex-col justify-between border border-suit/20 border-l-2 border-l-caution bg-[#0d0d0c] p-5 sm:p-6"
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-caution">
                        {outpost
                          ? `${outpost.code} // ${outpost.structure}`
                          : "OUTPOST STRUCTURE"}
                      </p>
                      {project.category && (
                        <span className="border border-suit/25 px-2 py-0.5 font-hud text-[9.5px] uppercase tracking-[0.18em] text-suit/80">
                          {project.category}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-hud text-lg font-semibold uppercase tracking-[0.08em] text-sunlight sm:text-xl">
                      {project.title}
                    </h3>

                    <p className="mt-1 font-radio text-sm text-caution/90">
                      {project.subtitle}
                    </p>

                    <p className="mt-3 font-radio text-sm leading-relaxed text-suit/85">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="mt-4">
                      <p className="font-hud text-[9.5px] uppercase tracking-[0.2em] text-suit/70">
                        Technology Stack ({project.technologies.length})
                      </p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <li
                            key={tech}
                            className="border border-suit/25 bg-void/70 px-2 py-0.5 font-hud text-[10px] uppercase tracking-[0.12em] text-suit/90"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Key Features */}
                    <div className="mt-4">
                      <p className="font-hud text-[9.5px] uppercase tracking-[0.2em] text-suit/70">
                        Key Capabilities ({project.features.length})
                      </p>
                      <ul className="mt-1.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
                        {project.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 font-radio text-xs text-suit/80"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1 w-1 shrink-0 bg-caution"
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-suit/15 pt-4">
                    {!isSeo && (
                      <button
                        type="button"
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-2 bg-signal px-4 py-2 font-hud text-[10px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                      >
                        Open Mission File <span aria-hidden="true">→</span>
                      </button>
                    )}

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-suit/35 px-3.5 py-2 font-hud text-[10px] uppercase tracking-[0.18em] text-suit transition-colors hover:border-caution hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                      >
                        GitHub <span aria-hidden="true">↗</span>
                      </a>
                    )}

                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-suit/35 px-3.5 py-2 font-hud text-[10px] uppercase tracking-[0.18em] text-suit transition-colors hover:border-caution hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                      >
                        Live Demo <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Act 09: Crew Habitat — Experience */}
        <section
          id={sectionId("experience")}
          aria-labelledby={isSeo ? undefined : "summary-experience-heading"}
          className="scroll-mt-24 space-y-6"
        >
          <div className="border-b border-suit/20 pb-3">
            <p className="font-hud text-[10px] uppercase tracking-[0.26em] text-caution">
              ACT 09 {"//"} HAB-05 CREW HABITAT
            </p>
            <h2
              id={isSeo ? undefined : "summary-experience-heading"}
              className="mt-1 font-hud text-xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-2xl"
            >
              02 {"//"} Professional Experience
            </h2>
          </div>

          <div className="space-y-6">
            {experiences.map((exp) => (
              <article
                key={`${exp.company}-${exp.role}`}
                className="border border-suit/20 border-l-2 border-l-caution bg-[#0d0d0c] p-5 sm:p-7"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <p className="font-hud text-[10px] uppercase tracking-[0.22em] text-caution">
                      {exp.company}
                    </p>
                    <h3 className="mt-1 font-hud text-lg font-semibold uppercase tracking-[0.08em] text-sunlight sm:text-xl">
                      {exp.role}
                    </h3>
                  </div>

                  <span className="border border-caution/40 bg-caution/10 px-3 py-1 font-hud text-[10px] uppercase tracking-[0.2em] text-caution">
                    {exp.duration}
                  </span>
                </div>

                <p className="mt-3 font-radio text-sm leading-relaxed text-suit/85 sm:text-base">
                  {exp.description} (Assigned system:{" "}
                  <strong className="font-semibold text-sunlight">
                    {exp.project}
                  </strong>
                  )
                </p>

                <div className="mt-5 grid gap-6 md:grid-cols-[1.3fr_1fr]">
                  <div>
                    <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-suit/70">
                      Duty Log & Key Achievements
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {exp.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="flex items-start gap-2.5 font-radio text-sm text-suit/85"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 bg-caution"
                          />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-suit/70">
                      Production Stack
                    </p>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <li
                          key={tech}
                          className="border border-suit/25 bg-void/70 px-2.5 py-1 font-hud text-[10px] uppercase tracking-[0.14em] text-suit/90"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Act 10: Power Grid — Skills */}
        <section
          id={sectionId("skills")}
          aria-labelledby={isSeo ? undefined : "summary-skills-heading"}
          className="scroll-mt-24 space-y-6"
        >
          <div className="border-b border-suit/20 pb-3">
            <p className="font-hud text-[10px] uppercase tracking-[0.26em] text-caution">
              ACT 10 {"//"} PWR-06 SOLAR ARRAY FIELD
            </p>
            <h2
              id={isSeo ? undefined : "summary-skills-heading"}
              className="mt-1 font-hud text-xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-2xl"
            >
              03 {"//"} Technical Skills & Power Output
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((group, index) => {
              const cleanTitle = stripLeadingEmoji(group.title);

              return (
                <article
                  key={group.id}
                  className="border border-suit/20 bg-[#0d0d0c] p-5"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-hud text-xs font-semibold uppercase tracking-[0.16em] text-sunlight">
                      ARR-0{index + 1} {"//"} {cleanTitle}
                    </h3>
                    <span className="font-hud text-xs font-semibold tabular-nums text-caution">
                      {group.level}% KW
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-full bg-suit/15"
                  >
                    <div
                      className="h-full bg-caution"
                      style={{ width: `${group.level}%` }}
                    />
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {group.technologies.map((tech) => (
                      <li
                        key={tech}
                        className="border border-suit/25 bg-void/70 px-2 py-0.5 font-hud text-[10px] uppercase tracking-[0.12em] text-suit/90"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* Act 11: Off-Shift Quarters — Creative Works */}
        <section
          id={sectionId("creative")}
          aria-labelledby={isSeo ? undefined : "summary-creative-heading"}
          className="scroll-mt-24 space-y-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-suit/20 pb-3">
            <div>
              <p className="font-hud text-[10px] uppercase tracking-[0.26em] text-caution">
                ACT 11 {"//"} QTR-07 OFF-SHIFT QUARTERS
              </p>
              <h2
                id={isSeo ? undefined : "summary-creative-heading"}
                className="mt-1 font-hud text-xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-2xl"
              >
                Creative Archive ({creativeWorks.length} Works)
              </h2>
            </div>

            <Link
              href="/creative"
              className="inline-flex items-center gap-2 border border-suit/35 bg-void/70 px-4 py-2 font-hud text-[10px] font-semibold uppercase tracking-[0.2em] text-suit transition-colors hover:border-caution hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
            >
              View Full Creative Archive ({creativeWorks.length}){" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCreative.map((work) => (
              <article
                key={work.id}
                className="flex flex-col justify-between border border-suit/20 bg-[#0d0d0c] p-4"
              >
                <div>
                  {!isSeo && (
                    <div className="relative mb-3 h-44 w-full overflow-hidden border border-suit/15 bg-void">
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <p className="font-hud text-[9.5px] uppercase tracking-[0.2em] text-caution">
                    {work.category}
                  </p>

                  <h3 className="mt-1 font-hud text-sm font-semibold uppercase tracking-[0.08em] text-sunlight">
                    {work.title}
                  </h3>

                  <p className="mt-1.5 font-radio text-xs leading-relaxed text-suit/80">
                    {work.description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-suit/15 pt-3">
                  <span className="truncate font-hud text-[9.5px] uppercase tracking-[0.14em] text-suit/70">
                    {work.tools?.join(" · ")}
                  </span>

                  {!isSeo && (
                    <button
                      type="button"
                      onClick={() => setSelectedWork(work)}
                      className="shrink-0 border border-suit/30 px-2.5 py-1 font-hud text-[9.5px] uppercase tracking-[0.18em] text-caution transition-colors hover:border-caution hover:bg-caution/10 hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                    >
                      Inspect
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Act 12: Ridge Observatory — Learning & Future Goals */}
        <section
          id={sectionId("future")}
          aria-labelledby={isSeo ? undefined : "summary-future-heading"}
          className="scroll-mt-24 space-y-6"
        >
          <div className="border-b border-suit/20 pb-3">
            <p className="font-hud text-[10px] uppercase tracking-[0.26em] text-caution">
              ACT 12 {"//"} OBS-08 RIDGE OBSERVATORY · MARTIAN BLUE HOUR
            </p>
            <h2
              id={isSeo ? undefined : "summary-future-heading"}
              className="mt-1 font-hud text-xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-2xl"
            >
              Active Research & Learning Horizon
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sortedFuture.map((target, index) => (
              <article
                key={target.id}
                className="border border-suit/20 bg-[#0d0d0c] p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-hud text-[9.5px] uppercase tracking-[0.18em] text-caution">
                    TRK-0{index + 1}
                  </span>
                  <span className="font-hud text-xs font-semibold tabular-nums text-caution">
                    {target.progress}% LOCK
                  </span>
                </div>

                <h3 className="mt-1 font-hud text-sm font-semibold uppercase tracking-[0.1em] text-sunlight">
                  {target.title}
                </h3>

                <div
                  aria-hidden="true"
                  className="mt-2 h-1 w-full bg-suit/15"
                >
                  <div
                    className="h-full bg-caution"
                    style={{ width: `${target.progress}%` }}
                  />
                </div>

                <p className="mt-2.5 font-radio text-xs leading-relaxed text-suit/80">
                  {target.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Acts 13–14: Long-Range Comms Mast — Contact & Log End */}
        <section
          id={sectionId("contact")}
          aria-labelledby={isSeo ? undefined : "summary-contact-heading"}
          className="scroll-mt-24 border border-suit/20 border-t-2 border-t-caution bg-[#0d0d0c] p-6 sm:p-8"
        >
          <div className="border-b border-suit/20 pb-4">
            <p className="font-hud text-[10px] uppercase tracking-[0.26em] text-caution">
              ACTS 13–14 {"//"} COM-09 LONG-RANGE UPLINK & MISSION LOG END
            </p>
            <h2
              id={isSeo ? undefined : "summary-contact-heading"}
              className="mt-1 font-hud text-xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-2xl"
            >
              04 {"//"} Direct Communications Channels
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {contactItems.map((item, index) => {
              const external = item.href.startsWith("http");
              const isResume = item.id === "resume";

              return (
                <a
                  key={item.id}
                  href={item.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  download={isResume ? "Pasindu_Kavishka_CV.pdf" : undefined}
                  className={`flex flex-col justify-between border p-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution ${
                    isResume
                      ? "border-signal bg-signal text-sunlight hover:bg-[#ff6a26]"
                      : "border-suit/25 bg-void/80 text-suit hover:border-caution hover:text-sunlight"
                  }`}
                >
                  <span
                    className={`font-hud text-[9.5px] uppercase tracking-[0.2em] ${
                      isResume ? "text-sunlight/90" : "text-caution"
                    }`}
                  >
                    CH-0{index + 1} {"//"} {item.title}
                  </span>

                  <span className="mt-2 break-all font-radio text-xs font-medium text-sunlight">
                    {item.value}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-suit/15 pt-5">
            <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-suit/70">
              © {year} Pasindu Kavishka · Signal Remains Open
            </p>

            {!isSeo && (
              <div className="flex flex-wrap items-center gap-3">
                {webglSupported && onExitSummary && (
                  <button
                    type="button"
                    onClick={onExitSummary}
                    className="bg-signal px-4 py-2 font-hud text-[10px] font-semibold uppercase tracking-[0.2em] text-sunlight transition-colors hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
                  >
                    [ Return to 3D EVA ]
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Interactive Modals in Active Mode */}
      {!isSeo && (
        <>
          <AnimatePresence mode="wait">
            {selectedProject && (
              <ProjectModal
                key={selectedProject.id}
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {selectedWork && (
              <CreativeModal
                key={selectedWork.id}
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
      )}
    </div>
  );
}


"use client";

import ProjectModal from "./ProjectModal";

import { projects } from "../data/portfolioData";
import { Project } from "../types/project";
import Reveal from "./Reveal";
import { AnimatePresence } from "framer-motion";

interface CityOverviewProps {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
}

export default function CityOverview({
  selectedProject,
  setSelectedProject,
}: CityOverviewProps) {
  return (
    <section
      id="projects"
      className="
        relative min-h-screen px-6 py-24 sm:px-10 lg:px-16
      "
    >
      <div
        className="
          relative z-10 mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-7xl
          flex-col justify-between py-10 pointer-events-none
        "
      >
        <Reveal y={30}>
          <div className="max-w-sm border-l border-cyan-400/50 pl-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
              Destination Identified
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Digital City
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Four active systems are online. Select a district or explore the
              city.
            </p>
          </div>
        </Reveal>

        <div className="pointer-events-auto self-center rounded-lg border border-cyan-300/20 bg-slate-950/65 p-2 backdrop-blur-md">
          <p className="sr-only">Project destinations</p>
          <div className="flex max-w-full flex-wrap justify-center gap-1.5">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.06} y={12}>
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="rounded-md border border-white/10 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-cyan-300/60 hover:bg-cyan-300/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  {project.title}
                </button>
              </Reveal>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedProject && (
            <ProjectModal
              key={selectedProject.id}
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>
        <div className="sr-only">
          Each destination has a full summary in its project dialog.
        </div>
      </div>
    </section>
  );
}

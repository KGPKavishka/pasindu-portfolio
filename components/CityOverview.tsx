"use client";

import BuildingCard from "./BuildingCard";
import ProjectModal from "./ProjectModal";

import { projects } from "../data/portfolioData";
import { Project } from "../types/project";
import Reveal from "./Reveal";
import { AnimatePresence, LayoutGroup } from "framer-motion";

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
                relative
                min-h-screen
                overflow-hidden
                px-6
                py-32
                sm:px-10
                lg:px-16
            "
    >
      <div
        className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    max-w-7xl
                "
      >
        {/* ============================= */}
        {/* Section Heading */}
        {/* ============================= */}

        <Reveal y={30}>
          <div className="text-center">
            <span
              className="
                                uppercase
                                tracking-[0.3em]
                                text-cyan-400
                                text-sm
                                font-medium
                            "
            >
              Projects
            </span>

            <h2
              className="
                                mt-3
                                text-4xl
                                sm:text-5xl
                                font-bold
                                text-white
                            "
            >
              Digital City
            </h2>

            <p
              className="
                                mx-auto
                                mt-6
                                max-w-2xl
                                text-gray-400
                                leading-8
                            "
            >
              Explore the projects, experiences, skills and future innovations
              that make up my software engineering city.
            </p>
          </div>
        </Reveal>

        {/* ============================= */}
        {/* Project Districts */}
        {/* ============================= */}

        <LayoutGroup>
          <div
            className="
                            mt-32
                            grid
                            grid-cols-1
                            gap-6
                            sm:grid-cols-2
                            xl:grid-cols-3
                        "
          >
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 0.1} y={40}>
                <BuildingCard
                  emoji={project.emoji}
                  title={project.title}
                  subtitle={project.subtitle}
                  description={project.description}
                  heroImage={project.heroImage}
                  technologies={project.technologies}
                  accentColor={project.accentColor}
                  onClick={() => setSelectedProject(project)}
                />
              </Reveal>
            ))}
          </div>

          {/* ============================= */}
          {/* Project Modal */}
          {/* ============================= */}

          <AnimatePresence mode="wait">
            {selectedProject && (
              <ProjectModal
                key={selectedProject.id}
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}

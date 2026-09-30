"use client";

import { useEffect, useState } from "react";

import BuildingCard from "./BuildingCard";
import ProjectModal from "./ProjectModal";

import { projects } from "../data/portfolioData";
import { Project } from "../types/project";
import Reveal from "./Reveal";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import {
  PROJECT_ACTIVATION_EVENT,
  ProjectActivationDetail,
} from "./Journey/projectActivation";

export default function CityOverview() {
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  useEffect(() => {
    const activateProject = (event: Event) => {
      const projectId = (event as CustomEvent<ProjectActivationDetail>).detail
        .projectId;
      const project = projects.find((item) => item.id === projectId);

      if (project) setSelectedProject(project);
    };

    window.addEventListener(PROJECT_ACTIVATION_EVENT, activateProject);

    return () =>
      window.removeEventListener(PROJECT_ACTIVATION_EVENT, activateProject);
  }, []);

  return (
    <Reveal delay={0.2}>
      <section
        id="projects"
        className="px-6"
      >
        <div className="mx-auto flex min-h-[110vh] max-w-7xl items-center py-24">
          <div className="max-w-2xl border-l border-cyan-300/25 pl-6 sm:pl-8">
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-400">
              Projects
            </span>

            <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
              Digital City
            </h2>

            <p className="mt-6 leading-8 text-gray-400">
              Explore the projects, experiences, skills and future innovations
              that make up my software engineering city.
            </p>
          </div>
        </div>

        <LayoutGroup>
          <div className="mx-auto max-w-7xl">
            {projects.map((project, index) => (
              <article
                key={project.id}
                data-project-district={project.id}
                className={`flex min-h-[80vh] items-center py-16 ${
                  index % 2 === 0 ? "justify-end" : "justify-start"
                }`}
              >
                <div className="w-full max-w-xl">
                  <Reveal delay={0.1} y={28}>
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
                </div>
              </article>
            ))}
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

        </LayoutGroup>

      </section>
    </Reveal>
  );
}
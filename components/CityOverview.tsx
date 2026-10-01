"use client";

import { useEffect, useState } from "react";

import ProjectModal from "./ProjectModal";

import { projects } from "../data/portfolioData";
import { Project } from "../types/project";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import {
  PROJECT_ACTIVATION_EVENT,
  ProjectActivationDetail,
} from "./Journey/projectActivation";

const districtAnchors: Record<string, string> = {
  healthbridge: "district-healthbridge",
  ezymap: "district-ezy-map",
  kvaudio: "district-kv-audio",
  storybloom: "district-story-bloom",
};

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
    <section id="projects" aria-label="Digital City project districts">
      <div className="min-h-[110vh]" aria-hidden="true" />
      {projects.map((project) => (
        <div
          key={project.id}
          id={districtAnchors[project.id]}
          data-project-district={project.id}
          className="min-h-[80vh]"
          aria-hidden="true"
        />
      ))}

      <LayoutGroup>
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
  );
}
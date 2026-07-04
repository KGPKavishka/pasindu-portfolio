"use client";

import { useState } from "react";

import BuildingCard from "./BuildingCard";
import ProjectModal from "./ProjectModal";

import { projects } from "../data/portfolioData";
import { Project } from "../types/project";
import Reveal from "./Reveal";

export default function CityOverview() {
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  return (
    <Reveal delay={0.2}>
      <section
        id="projects"
        className="py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">

          {/* Section Heading */}
          <span className="uppercase tracking-[0.3em] text-cyan-400 text-sm font-medium">
            Projects
          </span>

          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">
            Digital City
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl leading-8">
            Explore the projects, experiences,
            skills and future innovations that
            make up my software engineering city.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {projects.map((project, index) => (
              <Reveal
                key={project.id}
                delay={index * 0.1}
                y={40}
              >
                <BuildingCard
                  emoji={project.emoji || "🏢"}
                  title={project.title}
                  description={project.description}
                  onClick={() =>
                    setSelectedProject(project)
                  }
                />
              </Reveal>
            ))}

          </div>

          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() =>
                setSelectedProject(null)
              }
            />
          )}

        </div>
      </section>
    </Reveal>
  );
}
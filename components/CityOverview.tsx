"use client";

import { useState } from "react";

import BuildingCard from "./BuildingCard";
import ProjectModal from "./ProjectModal";

import { projects } from "../data/portfolioData";
import { Project } from "../types/project";

export default function CityOverview() {
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold mb-8">
          Digital City
        </h2>

        <p className="text-gray-400 mb-12 max-w-2xl">
          Explore the projects, experiences,
          skills and future innovations that
          make up my software engineering city.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          {projects.map((project) => (
            <BuildingCard
              key={project.id}
              emoji={project.emoji || "🏢"}
              title={project.title}
              description={project.description}
              onClick={() =>
                setSelectedProject(project)
              }
            />
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
  );
}
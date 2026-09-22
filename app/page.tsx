"use client";

import { useEffect, useState } from "react";
import { Project } from "../types/project";

import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "../components/Navbar";
import ScrollProgress from "../components/ScrollProgress";
import BackToTop from "../components/BackToTop";
import SceneCanvas from "@/components/Background/SceneCanvas";
import JourneyHUD from "@/components/JourneyHUD";
import ProjectModal from "@/components/ProjectModal";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoading]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <SceneCanvas setSelectedProject={setSelectedProject} />

      {/* Minimal HUD Layer */}
      <div className="fixed inset-0 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Navbar />
        </div>

        <div className="pointer-events-auto">
          <ScrollProgress />
        </div>

        <JourneyHUD />

        <BackToTop />
      </div>

      {/* Scroll Height Container - 800vh for smooth camera journey */}
      <div className="h-[800vh]" />

      {/* Project Modal */}
      {selectedProject && (
        <div className="pointer-events-auto">
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </div>
      )}
    </>
  );
}

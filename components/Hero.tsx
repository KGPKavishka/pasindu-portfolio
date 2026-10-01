"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";

import TerminalPanel from "@/components/UI/TerminalPanel";
import TypewriterText from "@/components/UI/TypewriterText";
import { useJourney } from "./Journey/JourneyController";

export default function Hero() {
  const { currentPhase, progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const introOpacity = useTransform(
    progress,
    reduceMotion ? [0, 0.08] : [0, 0.025, 0.075],
    reduceMotion ? [1, 0] : [1, 1, 0]
  );
  const introY = useTransform(progress, [0, 0.08], [0, reduceMotion ? 0 : -28]);
  const introScale = useTransform(
    progress,
    [0, 0.08],
    [1, reduceMotion ? 1 : 0.96]
  );
  const isIntroActive = currentPhase.id === "space";

  const scrollToProjects = () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({
        behavior: reduceMotion ? "instant" : "smooth",
      });
  };

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Pasindu_Kavishka_CV.pdf";
    link.click();
  };

  return (
    <section id="home" className="relative min-h-[280vh]">
      <div className="sticky top-0 flex h-screen items-end overflow-hidden px-6 pb-16 pt-28 sm:pb-20 lg:px-12">
        <motion.div
          style={{ opacity: introOpacity, y: introY, scale: introScale }}
          className="relative z-10 max-w-md text-left"
        >
          <TerminalPanel className="p-4 sm:p-5">
            <p className="terminal-kicker text-emerald-200">
              <TypewriterText text="SYSTEM INITIALIZED" speed={34} restartKey="hero-system" />
            </p>
            <h1 className="terminal-title mt-2 text-xl sm:text-2xl">
              Pasindu Kavishka
            </h1>
            <p className="terminal-meta mt-1 text-cyan-100/75">Software Engineer</p>
            <p className="terminal-copy mt-3 max-w-sm">
              Building scalable web, mobile, cloud and AI-powered solutions.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                tabIndex={isIntroActive ? 0 : -1}
                onClick={scrollToProjects}
                className="terminal-control"
              >
                Explore City <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                tabIndex={isIntroActive ? 0 : -1}
                onClick={downloadCV}
                className="terminal-control"
              >
                Download CV <span aria-hidden="true">↓</span>
              </button>
            </div>
          </TerminalPanel>
        </motion.div>
      </div>
    </section>
  );
}
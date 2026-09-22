"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contactItems } from "../data/contactData";

type JourneyStage =
  | "hero"
  | "space"
  | "planet"
  | "city"
  | "experience"
  | "skills"
  | "creative"
  | "future"
  | "contact";

const stageConfig: Record<
  JourneyStage,
  { label: string; title: string; description?: string }
> = {
  hero: {
    label: "Software Engineer",
    title: "Pasindu Kavishka",
    description:
      "Building scalable web, mobile, cloud and AI-powered solutions",
  },
  space: {
    label: "Entering Orbit",
    title: "Deep Space",
    description: "Signal detected from unknown digital territory",
  },
  planet: {
    label: "Destination Identified",
    title: "Digital City",
    description: "A software engineering ecosystem approaches",
  },
  city: {
    label: "Projects Online",
    title: "Project Districts",
    description: "Select any building to explore project details",
  },
  experience: {
    label: "Career Data",
    title: "Experience Tower",
    description: "Professional journey and industry exposure",
  },
  skills: {
    label: "Technical Infrastructure",
    title: "Data Center",
    description: "Technologies powering the ecosystem",
  },
  creative: {
    label: "Design Systems",
    title: "Creative District",
    description: "Visual design, research, and artistic work",
  },
  future: {
    label: "Research Signal",
    title: "Future Lab",
    description: "Exploring next-generation technologies",
  },
  contact: {
    label: "Signal Established",
    title: "Contact Center",
    description: "Let's build something meaningful together",
  },
};

export default function JourneyHUD() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState<JourneyStage>("hero");

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));

      // Determine current stage based on scroll progress
      if (progress < 0.08) {
        setCurrentStage("hero");
      } else if (progress < 0.15) {
        setCurrentStage("space");
      } else if (progress < 0.28) {
        setCurrentStage("planet");
      } else if (progress < 0.48) {
        setCurrentStage("city");
      } else if (progress < 0.58) {
        setCurrentStage("experience");
      } else if (progress < 0.68) {
        setCurrentStage("skills");
      } else if (progress < 0.78) {
        setCurrentStage("creative");
      } else if (progress < 0.88) {
        setCurrentStage("future");
      } else {
        setCurrentStage("contact");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stage = stageConfig[currentStage];

  return (
    <>
      {/* Main HUD Content */}
      <div className="fixed inset-0 flex items-center justify-start px-6 sm:px-10 lg:px-16 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-lg"
          >
            {/* Stage Label */}
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-cyan-400" />
              <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-cyan-400">
                {stage.label}
              </p>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[0.95] tracking-tight text-white">
              {stage.title}
            </h1>

            {/* Description */}
            {stage.description && (
              <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-gray-400">
                {stage.description}
              </p>
            )}

            {/* Hero CTA Buttons */}
            {currentStage === "hero" && (
              <div className="mt-8 flex flex-wrap gap-4 pointer-events-auto">
                <button
                  onClick={() =>
                    window.scrollTo({
                      top: window.innerHeight * 3,
                      behavior: "smooth",
                    })
                  }
                  className="group rounded-xl bg-cyan-500 px-7 py-3 font-semibold text-black transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-cyan-400 hover:shadow-xl hover:shadow-cyan-500/30"
                >
                  <span className="flex items-center gap-2">
                    Enter Digital City
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>

                <a
                  href="/resume.pdf"
                  download="Pasindu_Kavishka_CV.pdf"
                  className="rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-cyan-500/10"
                >
                  Download CV
                </a>
              </div>
            )}

            {/* Contact Links */}
            {currentStage === "contact" && (
              <div className="mt-8 flex flex-wrap gap-4 pointer-events-auto">
                {contactItems.slice(0, 3).map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-5 py-3 text-cyan-300 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-500/20"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mission Stats HUD - Only at hero stage */}
      <AnimatePresence>
        {currentStage === "hero" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="fixed bottom-8 left-6 sm:left-10 lg:left-16"
          >
            <div className="flex gap-8 border-l border-cyan-400/30 pl-4">
              <div>
                <p className="text-2xl font-bold text-cyan-400">4+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Projects
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">20+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Technologies
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-400">600+</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Hours
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator - Only at hero */}
      <AnimatePresence>
        {currentStage === "hero" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
              Scroll to Explore
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-px bg-gradient-to-b from-cyan-400 to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journey Progress Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-1">
        {Object.keys(stageConfig).map((stage, index) => {
          const stageProgress = index / (Object.keys(stageConfig).length - 1);
          const isActive = currentStage === stage;
          const isPast = scrollProgress >= stageProgress;

          return (
            <div
              key={stage}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-cyan-400 scale-150 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                  : isPast
                    ? "bg-cyan-400/50"
                    : "bg-white/20"
              }`}
            />
          );
        })}
      </div>
    </>
  );
}

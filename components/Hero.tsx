"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { useCallback } from "react";

import { useJourney } from "./Journey/JourneyController";
import {
  type JourneyPointer,
  useJourneyPointer,
} from "./Journey/journeyPointer";

const sequenceVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.45,
      staggerChildren: 0.16,
    },
  },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const bracketCorners = [
  "left-0 top-0 border-l border-t -translate-x-1.5 -translate-y-1.5",
  "right-0 top-0 border-r border-t translate-x-1.5 -translate-y-1.5",
  "bottom-0 left-0 border-b border-l -translate-x-1.5 translate-y-1.5",
  "bottom-0 right-0 border-b border-r translate-x-1.5 translate-y-1.5",
] as const;

function CornerBrackets() {
  return (
    <>
      {bracketCorners.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            h-2.5
            w-2.5
            border-cyan-400
            transition-all
            duration-300
            ease-out
            group-hover:translate-x-0
            group-hover:translate-y-0
            group-hover:border-white
            group-focus-visible:translate-x-0
            group-focus-visible:translate-y-0
            group-focus-visible:border-white
            ${corner}
          `}
        />
      ))}
    </>
  );
}

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
  const isReady = currentPhase.id !== "loading";
  const isIntroActive = currentPhase.id === "space";

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  // Soft, delayed spring so the text drifts after the scene, not with it.
  const floatX = useSpring(pointerX, { stiffness: 26, damping: 14, mass: 1.4 });
  const floatY = useSpring(pointerY, { stiffness: 26, damping: 14, mass: 1.4 });
  const followPointer = useCallback(
    (pointer: JourneyPointer) => {
      pointerX.set(pointer.x * 10);
      pointerY.set(-pointer.y * 7);
    },
    [pointerX, pointerY]
  );

  useJourneyPointer(reduceMotion ? undefined : followPointer);

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
    <section id="home" aria-label="Orbital gateway" className="relative min-h-[280vh]">
      <div className="sticky top-0 flex h-screen items-end overflow-hidden px-6 pb-16 pt-28 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
        <motion.div
          style={{ opacity: introOpacity, y: introY, scale: introScale }}
          className="relative z-10 w-full max-w-2xl origin-bottom-left text-left"
        >
          <motion.div style={{ x: floatX, y: floatY }}>
            <motion.div
              variants={sequenceVariants}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
            >
              <motion.h1
                variants={riseVariants}
                className="terminal-title text-xl sm:text-2xl"
              >
                Pasindu Kavishka
              </motion.h1>

              <motion.p
                variants={riseVariants}
                className="
                  mt-5
                  font-mono
                  text-[11px]
                  uppercase
                  tracking-[0.2em]
                  text-cyan-400
                  [text-shadow:0_0_12px_rgba(34,211,238,0.55)]
                  sm:text-xs
                  sm:tracking-[0.32em]
                "
              >
                <span className="whitespace-nowrap">
                  Software Engineer{" "}
                  <span aria-hidden="true" className="text-cyan-400/50">{"//"}</span>
                </span>{" "}
                <span className="whitespace-nowrap">Digital Astronaut</span>
              </motion.p>

              <motion.p
                variants={riseVariants}
                className="mt-4 max-w-md font-sans text-sm leading-relaxed text-slate-300/75 [text-shadow:0_1px_10px_rgba(0,0,0,0.6)] sm:text-[15px]"
              >
                Building scalable web, mobile, cloud and AI-powered solutions.
              </motion.p>

              <motion.div
                variants={riseVariants}
                className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5"
              >
                <button
                  type="button"
                  tabIndex={isIntroActive ? 0 : -1}
                  onClick={scrollToProjects}
                  aria-label="Initiate journey"
                  className="
                    group
                    relative
                    border
                    border-cyan-500
                    bg-transparent
                    px-6
                    py-3
                    whitespace-nowrap
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.28em]
                    text-cyan-200
                    shadow-[0_0_24px_rgba(6,182,212,0.12)]
                    transition-colors
                    duration-300
                    hover:bg-cyan-500/20
                    hover:text-white
                    focus-visible:bg-cyan-500/20
                    focus-visible:text-white
                    focus-visible:outline-none
                    sm:text-xs
                  "
                >
                  <CornerBrackets />
                  [ Initiate Journey ]
                </button>

                <button
                  type="button"
                  tabIndex={isIntroActive ? 0 : -1}
                  onClick={downloadCV}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    font-mono
                    text-[11px]
                    uppercase
                    tracking-[0.24em]
                    text-cyan-200/60
                    transition-colors
                    duration-300
                    hover:text-white
                    focus-visible:text-white
                    focus-visible:outline
                    focus-visible:outline-1
                    focus-visible:outline-offset-4
                    focus-visible:outline-cyan-400
                  "
                >
                  Download CV <span aria-hidden="true">↓</span>
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

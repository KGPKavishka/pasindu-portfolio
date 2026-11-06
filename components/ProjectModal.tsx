import { Project } from "../types/project";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

import { outpostStructures } from "./Journey/journeyWorldConfig";

interface Props {
  project: Project;
  onClose: () => void;
}

const lightboxButton =
  "absolute flex h-10 w-10 items-center justify-center border border-suit/50 bg-void/85 font-hud text-lg text-suit transition-colors hover:border-signal hover:bg-signal hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution";

function SectionHeading({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="bg-signal px-2 py-0.5 font-hud text-[10px] font-semibold tracking-[0.2em] text-sunlight">
        {index}
      </span>
      <h3 className="font-hud text-[12px] font-semibold uppercase tracking-[0.24em] text-[#141414]">
        {children}
      </h3>
      <span aria-hidden="true" className="h-px flex-1 bg-black/25" />
    </div>
  );
}

/**
 * Mission file: the full project record, presented as a printed technical
 * dossier (paper-white sheet, black type, International Orange tabs).
 */
export default function ProjectModal({
  project,
  onClose,
}: Props) {

  const [selectedImage, setSelectedImage] =
    useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileCode =
    outpostStructures.find((item) => item.id === project.id)?.code ?? "FILE";

  const showPreviousImage = () => {
    if (!project.screenshots || selectedImage === null) return;

    setSelectedImage(
      selectedImage === 0
        ? project.screenshots.length - 1
        : selectedImage - 1
    );
  };

  const showNextImage = () => {
    if (!project.screenshots || selectedImage === null) return;

    setSelectedImage(
      selectedImage === project.screenshots.length - 1
        ? 0
        : selectedImage + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectedImage !== null) {
          setSelectedImage(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose, selectedImage]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`project-${project.id}-title`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-void/85 p-3 sm:p-6"
      onClick={onClose}
    >

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.97,
          y: 18,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.98,
          y: 12,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 30,
          mass: 0.8,
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-[#f3f0e8] text-[#141414] shadow-[0_30px_90px_rgba(0,0,0,0.65)]"
      >

        {/* Header */}
        <div className="border-b-2 border-[#141414] px-5 pb-5 pt-0 sm:px-8">

          <div className="flex items-stretch justify-between gap-4">

            <div className="flex items-center gap-3 bg-signal px-3 py-1.5 font-hud text-[10px] font-semibold uppercase tracking-[0.24em] text-sunlight">
              <span>Mission file</span>
              <span aria-hidden="true" className="text-sunlight/60">{"//"}</span>
              <span>{fileCode}</span>
            </div>

            <button
              ref={closeRef}
              type="button"
              aria-label={`Close ${project.title} project details`}
              onClick={onClose}
              className="mt-2 flex h-9 w-9 items-center justify-center border border-[#141414] font-hud text-base transition-colors hover:bg-signal hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
            >
              ✕
            </button>

          </div>

          <h2
            id={`project-${project.id}-title`}
            className="mt-5 font-hud text-2xl font-semibold uppercase tracking-[0.08em] sm:text-3xl"
          >
            {project.title}
          </h2>

          <p className="mt-2 font-radio text-base text-[#3a3a38]">
            {project.subtitle}
          </p>

          {project.category && (
            <p className="mt-3 inline-block border border-[#141414] px-2 py-0.5 font-hud text-[10px] uppercase tracking-[0.2em]">
              Category: {project.category}
            </p>
          )}

        </div>

        <div className="space-y-9 p-5 sm:p-8">

          {/* Hero Image */}
          {project.heroImage && (
            <figure>
              <div
                className="
                  relative
                  h-52 sm:h-72
                  overflow-hidden
                  border border-[#141414]
                  bg-[#d9d4c7]
                "
              >
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  priority
                  sizes="(max-width: 768px) calc(100vw - 3rem), 896px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-2 font-hud text-[10px] uppercase tracking-[0.2em] text-[#5a5a56]">
                Fig. 0 — {project.title}
              </figcaption>
            </figure>
          )}

          {/* Overview */}
          <section>
            <SectionHeading index="01">Overview</SectionHeading>
            <p className="font-radio text-[15px] leading-7 text-[#222220]">
              {project.description}
            </p>
          </section>

          {/* Technologies */}
          <section>
            <SectionHeading index="02">Technologies</SectionHeading>
            <ul className="flex flex-wrap gap-2.5">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="border border-[#141414] px-2.5 py-1 font-hud text-[11px] uppercase tracking-[0.12em]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          {/* Architecture */}
          <section>
            <SectionHeading index="03">Architecture</SectionHeading>
            <ol className="space-y-2">
              {project.architecture.map((item, index) => (
                <li key={item} className="flex items-center gap-3 font-radio text-[15px] text-[#222220]">
                  <span className="w-7 font-hud text-[11px] font-semibold text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="border-b border-dotted border-black/40 pb-0.5">{item}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Features */}
          <section>
            <SectionHeading index="04">Key features</SectionHeading>
            <ul className="space-y-2.5">
              {project.features.map((item) => (
                <li key={item} className="flex items-start gap-3 font-radio text-[15px] text-[#222220]">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-[#141414]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Challenges */}
          <section>
            <SectionHeading index="05">Challenges</SectionHeading>
            <ul className="space-y-2.5">
              {project.challenges.map((item) => (
                <li key={item} className="flex items-start gap-3 font-radio text-[15px] text-[#222220]">
                  <span aria-hidden="true" className="mt-0.5 font-hud text-sm font-semibold text-signal">
                    !
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Lessons */}
          <section>
            <SectionHeading index="06">Lessons learned</SectionHeading>
            <ul className="space-y-2.5">
              {project.lessons.map((item) => (
                <li key={item} className="flex items-start gap-3 font-radio text-[15px] text-[#222220]">
                  <span aria-hidden="true" className="mt-0.5 font-hud text-sm font-semibold text-[#141414]">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <section>

              <SectionHeading index="07">Project gallery</SectionHeading>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {project.screenshots.map((image, index) => (
                  <figure key={image}>
                    <button
                      type="button"
                      aria-label={`Open ${project.title} screenshot ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      className="
                        group
                        relative
                        block
                        h-52
                        w-full
                        overflow-hidden
                        border
                        border-[#141414]
                        bg-[#d9d4c7]
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-signal
                      "
                    >

                      <Image
                        src={image}
                        alt={`${project.title} Screenshot ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) calc(100vw - 4rem), 33vw"
                        className="
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />

                    </button>
                    <figcaption className="mt-1.5 font-hud text-[10px] uppercase tracking-[0.2em] text-[#5a5a56]">
                      Fig. {index + 1}
                    </figcaption>
                  </figure>
                ))}

              </div>

            </section>
          )}

          {/* Full Screen Image Viewer */}
          {selectedImage !== null && project.screenshots && (
            <div
              onClick={() => setSelectedImage(null)}
              className="
                fixed
                inset-0
                z-[100]
                flex
                items-center
                justify-center
                bg-void/92
                p-6
              "
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="
                  relative
                  w-full
                  max-w-6xl
                  h-[80vh]
                "
              >
                <Image
                  src={project.screenshots[selectedImage]}
                  alt={`${project.title} Screenshot`}
                  fill
                  className="object-contain"
                />

                <button
                  type="button"
                  aria-label="Previous screenshot"
                  onClick={showPreviousImage}
                  className={`${lightboxButton} left-4 top-1/2 -translate-y-1/2`}
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  onClick={showNextImage}
                  className={`${lightboxButton} right-4 top-1/2 -translate-y-1/2`}
                >
                  ›
                </button>

                {/* Close */}
                <button
                  type="button"
                  aria-label="Close screenshot viewer"
                  onClick={() => setSelectedImage(null)}
                  className={`${lightboxButton} right-4 top-4`}
                >
                  ✕
                </button>

                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 border border-suit/50 bg-void/85 px-4 py-2 font-hud text-[11px] tracking-[0.2em] text-suit"
                >
                  {selectedImage! + 1} / {project.screenshots.length}
                </div>

              </div>
            </div>
          )}

          {/* Actions */}
          {(project.github || project.demo) && (
            <div className="flex flex-wrap gap-4 border-t-2 border-[#141414] pt-6">

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-signal px-5 py-3 font-hud text-[11px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                >
                  View GitHub <span aria-hidden="true">↗</span>
                </a>
              )}

              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#141414] px-5 py-3 font-hud text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors hover:bg-[#141414] hover:text-[#f3f0e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                >
                  Live demo <span aria-hidden="true">↗</span>
                </a>
              )}

            </div>
          )}

        </div>

      </motion.div>

    </motion.div>,
    document.body
  );
}

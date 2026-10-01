import { Project } from "../types/project";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  onClose,
}: Props) {

  const [selectedImage, setSelectedImage] =
    useState<number | null>(null);

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
      className="
        fixed
        inset-0
        z-50
        bg-black/80
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-6
      "
      onClick={onClose}
    >

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 16,
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
          damping: 28,
          mass: 0.8,
        }}
        onClick={(e) => e.stopPropagation()}
        className="terminal-panel interface-dialog max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >

        {/* Header */}
        <div className="border-b border-cyan-300/15 p-5 sm:p-8">

          <div className="flex items-start justify-between">

            <div>

              <div className="font-mono text-2xl text-cyan-100">
                {project.emoji}
              </div>

              <h2 id={`project-${project.id}-title`} className="terminal-title mt-3 text-xl sm:text-2xl">
                {project.title}
              </h2>

              <p className="terminal-meta mt-2 text-cyan-100">
                {project.subtitle}
              </p>

            </div>

            <button
              type="button"
              aria-label={`Close ${project.title} project details`}
              onClick={onClose}
                className="terminal-control h-10 w-10 min-h-10 p-0 text-lg"
            >
              ✕
            </button>

          </div>

        </div>

        <div className="space-y-8 p-5 sm:p-8">

          {/* Hero Image */}
          {project.heroImage && (
            <div
              className="
                relative
                h-52 sm:h-72
                overflow-hidden
                terminal-image-frame
                bg-[#0f172a]
              "
            >
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 768px) calc(100vw - 3rem), 896px"
                className="
                  object-cover
                  transition-transform
                  duration-500
                  hover:scale-105
                "
              />

              {/* Dark Overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#050816]/70
                  via-transparent
                  to-transparent
                "
              />

              {/* Project Title Overlay */}
              <div
                className="
                  absolute
                  bottom-6
                  left-6
                "
              >
                <span
                    className="terminal-chip px-3 py-2"
                >
                  {project.title}
                </span>
              </div>

            </div>
          )}

          {/* Overview */}
          <div>

                <h3 className="mb-3">
              Overview
            </h3>

            <p className="text-gray-300 leading-8">
              {project.description}
            </p>

          </div>

          {/* Technologies */}
          <div>

                <h3 className="mb-3">
              Technologies
            </h3>

            <div className="flex flex-wrap gap-3">

              {project.technologies.map((tech) => (
                <span
                  key={tech}
                    className="terminal-chip px-2.5 py-1.5"
                >
                  {tech}
                </span>
              ))}

            </div>

          </div>

          {/* Architecture */}
          <div>

            <h3 className="mb-3">
              Architecture
            </h3>

            <div className="space-y-3">

              {project.architecture.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <span className="text-cyan-400">
                    →
                  </span>

                  <span className="text-gray-300">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

          {/* Features */}
          <div>

            <h3 className="mb-3">
              Key Features
            </h3>

            <div className="space-y-3">

              {project.features.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3"
                >
                  <span className="text-emerald-400">
                    ✓
                  </span>

                  <span className="text-gray-300">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

          {/* Challenges */}
          <div>

            <h3 className="mb-3">
              Challenges
            </h3>

            <div className="space-y-3">

              {project.challenges.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3"
                >
                  <span className="text-orange-400">
                    •
                  </span>

                  <span className="text-gray-300">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

          {/* Lessons */}
          <div>

            <h3 className="text-2xl font-bold mb-4">
              Lessons Learned
            </h3>

            <div className="space-y-3">

              {project.lessons.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3"
                >
                  <span className="text-violet-400">
                    ★
                  </span>

                  <span className="text-gray-300">
                    {item}
                  </span>
                </div>
              ))}

            </div>

          </div>

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div>

              <h3 className="mb-4">
                Project Gallery
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {project.screenshots.map((image, index) => (
                  <button
                    type="button"
                    key={index}
                    aria-label={`Open ${project.title} screenshot ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className="
                      group
                      block
                      relative
                      h-52
                      w-full
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#101827]
                      focus-visible:outline-2
                      focus-visible:outline-offset-2
                      focus-visible:outline-cyan-300
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
                        group-hover:scale-110
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-black/20
                        opacity-0
                        transition-opacity
                        duration-300
                        group-hover:opacity-100
                      "
                    />

                  </button>
                ))}

              </div>

            </div>
          )}

          {/* Full Screen Image Viewer */}
          {selectedImage !== null && project.screenshots && (
            <div
              onClick={() => setSelectedImage(null)}
              className="
                fixed
                inset-0
                z-[60]
                flex
                items-center
                justify-center
                bg-black/90
                backdrop-blur-sm
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
                  className="terminal-control absolute left-4 top-1/2 h-10 w-10 min-h-10 -translate-y-1/2 p-0 text-xl"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Next screenshot"
                  onClick={showNextImage}
                  className="terminal-control absolute right-4 top-1/2 h-10 w-10 min-h-10 -translate-y-1/2 p-0 text-xl"
                >
                  ›
                </button>

                {/* Close */}
                <button
                  type="button"
                  aria-label="Close screenshot viewer"
                  onClick={() => setSelectedImage(null)}
                  className="terminal-control absolute right-4 top-4 h-10 w-10 min-h-10 p-0"
                >
                  ✕
                </button>

                <div
                  className="terminal-chip absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2"
                >
                  {selectedImage! + 1} / {project.screenshots.length}
                </div>

              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-4 pt-4">

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="terminal-control"
            >
              View GitHub
            </a>

          </div>

        </div>

      </motion.div>

    </motion.div>,
    document.body
  );
}
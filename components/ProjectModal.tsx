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
        className="
          bg-[#0b1020]
          border
          border-white/10
          rounded-3xl
          max-w-4xl
          w-full
          max-h-[90vh]
          overflow-y-auto
          shadow-2xl
          shadow-cyan-500/10
        "
      >

        {/* Header */}
        <div className="border-b border-white/10 p-8">

          <div className="flex items-start justify-between">

            <div>

              <div className="text-5xl">
                {project.emoji}
              </div>

              <h2 className="mt-4 text-4xl font-bold">
                {project.title}
              </h2>

              <p className="mt-2 text-lg text-cyan-400">
                {project.subtitle}
              </p>

            </div>

            <button
              onClick={onClose}
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-xl
                transition-all
                duration-300
                hover:bg-red-500/20
                hover:text-red-300
              "
            >
              ✕
            </button>

          </div>

        </div>

        <div className="p-8 space-y-10">

          {/* Hero Image */}
          {project.heroImage && (
            <div
              className="
                relative
                h-72
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#0f172a]
              "
            >
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                priority
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
                  className="
                    rounded-full
                    bg-cyan-500/20
                    px-4
                    py-2
                    text-sm
                    text-cyan-300
                    backdrop-blur
                  "
                >
                  {project.title}
                </span>
              </div>

            </div>
          )}

          {/* Overview */}
          <div>

            <h3 className="text-2xl font-bold mb-4">
              Overview
            </h3>

            <p className="text-gray-300 leading-8">
              {project.description}
            </p>

          </div>

          {/* Technologies */}
          <div>

            <h3 className="text-2xl font-bold mb-4">
              Technologies
            </h3>

            <div className="flex flex-wrap gap-3">

              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="
                    px-4
                    py-2
                    rounded-full
                    bg-cyan-500/10
                    border
                    border-cyan-500/20
                    text-sm
                    text-cyan-300
                  "
                >
                  {tech}
                </span>
              ))}

            </div>

          </div>

          {/* Architecture */}
          <div>

            <h3 className="text-2xl font-bold mb-4">
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

            <h3 className="text-2xl font-bold mb-4">
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

            <h3 className="text-2xl font-bold mb-4">
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

              <h3 className="text-2xl font-bold mb-6">
                Project Gallery
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {project.screenshots.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className="
                      group
                      relative
                      h-52
                      overflow-hidden
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#101827]
                    "
                  >

                    <Image
                      src={image}
                      alt={`${project.title} Screenshot ${index + 1}`}
                      fill
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

                  </div>
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
                  onClick={showPreviousImage}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    h-14
                    w-14
                    rounded-full
                    bg-black/60
                    text-3xl
                    text-white
                    transition
                    hover:bg-cyan-500
                  "
                >
                  ‹
                </button>
                <button
                  onClick={showNextImage}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    h-14
                    w-14
                    rounded-full
                    bg-black/60
                    text-3xl
                    text-white
                    transition
                    hover:bg-cyan-500
                  "
                >
                  ›
                </button>

                {/* Close */}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="
                    absolute
                    top-4
                    right-4
                    h-12
                    w-12
                    rounded-full
                    bg-black/60
                    text-white
                    text-xl
                    transition
                    hover:bg-red-500
                  "
                >
                  ✕
                </button>

                <div
                  className="
                    absolute
                    bottom-6
                    left-1/2
                    -translate-x-1/2
                    rounded-full
                    bg-black/70
                    px-5
                    py-2
                    text-sm
                    text-white
                  "
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
              className="
                rounded-xl
                bg-cyan-500
                px-6
                py-3
                font-semibold
                text-black
                transition-all
                duration-300
                hover:scale-105
              "
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
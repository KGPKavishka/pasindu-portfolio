"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

interface Props {
  image: string;
  title: string;
  category: string;
  description: string;
  tools?: string[];
  onClose: () => void;
}

function SectionHeading({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
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
 * Mission file (Creative archive plate): restyled as a printed technical
 * dossier (paper-white sheet, black type, International Orange tabs) matching
 * ProjectModal (docs/DESIGN_PLAN.md §5.6).
 */
export default function CreativeModal({
  image,
  title,
  category,
  description,
  tools,
  onClose,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const titleId = `creative-${title.replaceAll(" ", "-")}-title`;

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/85 p-3 sm:p-6"
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
              <span aria-hidden="true" className="text-sunlight/60">
                {"//"}
              </span>
              <span>QTR-07</span>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="mt-2 flex h-9 w-9 items-center justify-center border border-[#141414] font-hud text-base transition-colors hover:bg-signal hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <h2
            id={titleId}
            className="mt-5 font-hud text-2xl font-semibold uppercase tracking-[0.08em] sm:text-3xl"
          >
            {title}
          </h2>

          <p className="mt-3 inline-block border border-[#141414] px-2 py-0.5 font-hud text-[10px] uppercase tracking-[0.2em]">
            Category: {category}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-8 p-5 sm:p-8">
          <figure>
            <div className="relative h-[44vh] max-h-[480px] min-h-[260px] w-full overflow-hidden border border-[#141414] bg-[#d9d4c7]">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) calc(100vw - 3rem), 896px"
                className="object-contain p-4"
              />
            </div>
            <figcaption className="mt-2 font-hud text-[10px] uppercase tracking-[0.2em] text-[#5a5a56]">
              Plate — {title} ({category})
            </figcaption>
          </figure>

          <section>
            <SectionHeading index="01">Description</SectionHeading>
            <p className="font-radio text-[15px] leading-7 text-[#222220]">
              {description}
            </p>
          </section>

          {tools && tools.length > 0 && (
            <section>
              <SectionHeading index="02">Tools & medium</SectionHeading>
              <ul className="flex flex-wrap gap-2.5">
                {tools.map((tool) => (
                  <li
                    key={tool}
                    className="border border-[#141414] px-2.5 py-1 font-hud text-[11px] uppercase tracking-[0.12em]"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

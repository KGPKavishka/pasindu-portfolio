"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { creativeWorks } from "../data/creativeData";
import CreativeGallery from "./CreativeGallery";
import CreativeHeading from "./CreativeHeading";
import CreativeModal from "./CreativeModal";
import Reveal from "./Reveal";

interface CreativeStudioProps {
  limit?: number;
  showViewAll?: boolean;

  title?: string;
  headingWords?: string[];
  description?: string;
}

export default function CreativeStudio({
  limit,
  showViewAll = false,

  title = "Creative Studio",

  headingWords = [
    "Design",
    "Research",
    "Art",
    "Branding",
  ],

  description =
  "Beyond software engineering, I explore visual design, research presentation, branding and traditional art.",
}: CreativeStudioProps) {
  const [selectedWork, setSelectedWork] = useState<
    (typeof creativeWorks)[0] | null
  >(null);

  const [activeCategory, setActiveCategory] =
    useState("All");

  const categories = [
    "All",
    "Research",
    "UI Design",
    "Art",
    "Logo",
  ];

  const filteredWorks = useMemo(() => {
    const works =
      activeCategory === "All"
        ? creativeWorks
        : creativeWorks.filter(
          (work) => work.category === activeCategory
        );

    return limit ? works.slice(0, limit) : works;
  }, [activeCategory, limit]);

  const getCount = (category: string) => {
    if (category === "All") {
      return creativeWorks.length;
    }

    return creativeWorks.filter(
      (work) => work.category === category
    ).length;
  };

  if (limit && showViewAll) {
    return (
      <section
        id="creative"
        className="min-h-[115vh]"
        aria-label="Off-Shift Quarters waypoint"
      />
    );
  }

  return (
    <Reveal delay={0.5}>
      <section id="creative" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-suit/20 pb-4">
            <span className="font-hud text-[11px] uppercase tracking-[0.22em] text-caution">
              QTR-07 // OFF-SHIFT QUARTERS ARCHIVE
            </span>
            <Link
              href="/#creative"
              className="inline-flex items-center gap-2 border border-suit/30 px-3.5 py-1.5 font-hud text-[10px] uppercase tracking-[0.2em] text-suit transition-colors hover:border-caution hover:text-sunlight"
            >
              ← Return to EVA Log
            </Link>
          </div>

          {/* Animated Header */}
          <CreativeHeading
            title={title}
            words={headingWords}
          />

          <p className="mt-4 mb-8 max-w-2xl font-radio text-sm leading-relaxed text-suit/80">
            {description}
          </p>

          {/* Filter Buttons */}
          <div className="mb-8 flex flex-wrap gap-2 border-y border-suit/15 py-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`border px-3.5 py-1.5 font-hud text-[10px] uppercase tracking-[0.18em] transition-colors ${
                  activeCategory === category
                    ? "border-signal bg-signal text-sunlight"
                    : "border-suit/25 bg-void/70 text-suit/75 hover:border-caution hover:text-sunlight"
                }`}
              >
                {category}

                <span className="ml-2 opacity-75">
                  ({getCount(category)})
                </span>
              </button>
            ))}
          </div>

          <CreativeGallery
            works={filteredWorks}
            onSelect={setSelectedWork}
          />

          {showViewAll && (
            <div className="mt-14 flex justify-center">
              <Link
                href="/creative"
                className="inline-flex items-center gap-2 bg-signal px-5 py-2.5 font-hud text-[11px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors hover:bg-[#ff6a26]"
              >
                View All Creative Works →
              </Link>
            </div>
          )}

          {/* Modal */}
          {selectedWork && (
            <CreativeModal
              image={selectedWork.image}
              title={selectedWork.title}
              category={selectedWork.category}
              description={selectedWork.description}
              tools={selectedWork.tools}
              onClose={() =>
                setSelectedWork(null)
              }
            />
          )}
        </div>
      </section>
    </Reveal>
  );
}
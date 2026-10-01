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
        aria-label="Creative Studio waypoint"
      />
    );
  }

  return (
    <Reveal delay={0.5}>
      <section id="creative" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Animated Header */}
          <CreativeHeading
            title={title}
            words={headingWords}
          />

          <p className="terminal-copy max-w-2xl mt-4 mb-8">
            {description}
          </p>

          {/* Filter Buttons */}
          <div className="mb-8 flex flex-wrap gap-2 border-y border-cyan-300/15 py-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() =>
                  setActiveCategory(category)
                }
                className={`terminal-control ${activeCategory === category ? "border-cyan-100/70 bg-cyan-200/15 text-cyan-50" : ""}`}
              >
                {category}

                <span className="ml-2 opacity-70">
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
                className="
                terminal-control
              "
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
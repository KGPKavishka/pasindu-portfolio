"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { creativeWorks } from "../data/creativeData";
import CreativeGallery from "./CreativeGallery";
import CreativeHeading from "./CreativeHeading";
import CreativeModal from "./CreativeModal";

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

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Animated Header */}
        <CreativeHeading
          title={title}
          words={headingWords}
        />

        <p className="text-gray-400 max-w-2xl mt-4 mb-12">
          {description}
        </p>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(category)
              }
              className={`
                px-5
                py-2
                rounded-full
                border
                transition-all
                duration-300
                ${
                  activeCategory === category
                    ? "bg-cyan-500 text-black border-cyan-500"
                    : "bg-white/5 border-white/10 hover:border-cyan-400 hover:bg-white/10"
                }
              `}
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
                px-8
                py-4
                rounded-full
                border
                border-cyan-400/30
                bg-cyan-500/10
                hover:bg-cyan-500/20
                hover:border-cyan-400
                transition-all
                duration-300
                font-medium
                tracking-wide
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
  );
}
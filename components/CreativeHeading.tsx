"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface CreativeHeadingProps {
  title?: string;
  words?: string[];
}

export default function CreativeHeading({
  title = "Creative Studio",
  words = [
    "Design",
    "Research",
    "Art",
    "Branding",
  ],
}: CreativeHeadingProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [reduceMotion, words.length]);

  return (
    <>
      <h2 className="font-hud text-2xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-3xl">
        {title}
      </h2>

      <p className="mt-3 h-8 font-hud text-xs uppercase tracking-[0.22em] text-caution">
        {words[reduceMotion ? 0 : index]}
      </p>
    </>
  );
}
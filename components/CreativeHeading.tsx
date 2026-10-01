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
      <h2 className="terminal-title text-2xl sm:text-3xl">
        {title}
      </h2>

      <p className="terminal-kicker mt-3 h-8 text-cyan-200">
        {words[reduceMotion ? 0 : index]}
      </p>
    </>
  );
}
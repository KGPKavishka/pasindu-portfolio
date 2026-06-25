"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [words]);

  return (
    <>
      <h2 className="text-5xl font-bold">
        {title}
      </h2>

      <p className="text-cyan-400 text-xl mt-3 h-8 font-medium">
        {words[index]}
      </p>
    </>
  );
}
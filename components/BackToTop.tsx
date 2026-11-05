"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Return to orbit"
      className="
      group
      fixed
      bottom-5
      right-5
      sm:bottom-8
      sm:right-8
      z-[90]

      flex
      h-11
      w-11
      sm:h-12
      sm:w-12
      items-center
      justify-center

      border
      border-suit/30
      bg-void/85
      backdrop-blur-md

      text-caution

      transition-all
      duration-300

      hover:-translate-y-0.5
      hover:border-signal
      hover:bg-signal
      hover:text-sunlight

      focus-visible:outline
      focus-visible:outline-1
      focus-visible:outline-offset-2
      focus-visible:outline-caution

      active:scale-95
    "
    >
      {/* Arrow */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="
        relative
        z-10
        h-4
        w-4
        transition-transform
        duration-300
        group-hover:-translate-y-0.5
      "
      >
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
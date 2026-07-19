"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

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
      behavior: "smooth",
    });
  };

  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
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
      sm:h-14
      sm:w-14
      items-center
      justify-center

      rounded-full
      border
      border-cyan-400/40
      bg-[#07111f]/80
      backdrop-blur-xl

      text-cyan-300
      shadow-lg
      shadow-cyan-500/20

      transition-all
      duration-300

      hover:-translate-y-1
      hover:scale-110
      hover:border-cyan-300
      hover:bg-cyan-500
      hover:text-[#050816]
      hover:shadow-xl
      hover:shadow-cyan-400/40

      active:scale-95
    "
    >
      {/* Inner Glow */}
      <span
        className="
        absolute
        inset-1
        rounded-full
        bg-cyan-400/5
        transition-all
        duration-300
        group-hover:bg-cyan-300/20
      "
      />

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
        h-5
        w-5
        transition-transform
        duration-300
        group-hover:-translate-y-1
      "
      >
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
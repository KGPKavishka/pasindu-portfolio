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
      className="
        fixed
        bottom-8
        right-8
        z-[90]
        h-14
        w-14
        rounded-full
        bg-cyan-500
        text-black
        text-xl
        font-bold
        shadow-xl
        shadow-cyan-500/30
      "
    >
      ↑
    </button>
  );
}
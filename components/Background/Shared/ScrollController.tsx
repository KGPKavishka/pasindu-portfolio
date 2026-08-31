"use client";

import { useEffect } from "react";

export const scrollState = {
  target: 0,
  current: 0,
};

export default function ScrollController() {
  useEffect(() => {
    const updateScrollProgress = () => {
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (maxScroll <= 0) {
        scrollState.target = 0;
        return;
      }

      const progress =
        window.scrollY / maxScroll;

      scrollState.target = Math.min(
        1,
        Math.max(0, progress)
      );
    };

    updateScrollProgress();

    window.addEventListener(
      "scroll",
      updateScrollProgress,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateScrollProgress
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollProgress
      );

      window.removeEventListener(
        "resize",
        updateScrollProgress
      );
    };
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const smoothScroll = () => {
      scrollState.current +=
        (scrollState.target - scrollState.current) *
        0.08;

      animationFrame =
        requestAnimationFrame(smoothScroll);
    };

    animationFrame =
      requestAnimationFrame(smoothScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
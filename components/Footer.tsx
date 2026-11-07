"use client";

import { useMotionValueEvent, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { useJourney } from "@/components/Journey/JourneyController";
import { contactItems } from "@/data/contactData";

/**
 * Act 14 — Night / Log End Footer (docs/DESIGN_PLAN.md §2 & §3):
 * Displayed at the end of the surface walk as the orbital station passes
 * overhead as a moving star, with direct contact links and RETURN TO ORBIT.
 */
export default function Footer() {
  const { progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(() => progress.get() >= 0.988);
  const year = new Date().getFullYear();

  useMotionValueEvent(progress, "change", (value) => {
    const next = value >= 0.988;
    setVisible((prev) => (prev === next ? prev : next));
  });

  const returnToOrbit = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  };

  return (
    <footer
      id="journey-complete"
      aria-label="Mission log end and return to orbit"
      className="flex min-h-[75vh] flex-col items-center justify-end px-4 pb-24 sm:px-6 sm:pb-28"
    >
      <div
        className={`w-full max-w-xl border border-suit/20 border-t-2 border-t-caution bg-void/82 p-5 text-center transition-opacity duration-300 sm:p-6 ${
          visible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <p className="font-hud text-[10px] uppercase tracking-[0.24em] text-caution">
          EVA-01 {"//"} MISSION LOG END · ORBITAL STATION OVERHEAD
        </p>

        <h2 className="mt-1.5 font-hud text-lg font-semibold uppercase tracking-[0.14em] text-sunlight sm:text-xl">
          Pasindu Kavishka
        </h2>

        <p className="mt-0.5 font-hud text-[10px] uppercase tracking-[0.2em] text-suit/80">
          Software Engineer · Signal Remains Open
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={returnToOrbit}
            className="inline-flex items-center gap-2 bg-signal px-4 py-2.5 font-hud text-[10px] font-semibold uppercase tracking-[0.22em] text-sunlight transition-colors duration-200 hover:bg-[#ff6a26] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution sm:px-5 sm:text-[11px]"
          >
            [ Return to Orbit <span aria-hidden="true">↑</span> ]
          </button>

          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center gap-2 border border-suit/35 bg-void/70 px-4 py-2.5 font-hud text-[10px] font-semibold uppercase tracking-[0.22em] text-suit transition-colors duration-200 hover:border-caution hover:text-sunlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution sm:px-5 sm:text-[11px]"
          >
            Download CV <span aria-hidden="true">↓</span>
          </a>
        </div>

        <nav
          aria-label="Footer contact links"
          className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 border-y border-suit/15 py-2.5"
        >
          {contactItems.map((item) => {
            const external = item.href.startsWith("http");

            return (
              <Link
                key={item.id}
                href={item.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                download={item.id === "resume"}
                className="font-hud text-[10px] uppercase tracking-[0.18em] text-suit/85 transition-colors hover:text-caution focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-caution"
              >
                {item.title}
              </Link>
            );
          })}
        </nav>

        <p className="mt-3 font-hud text-[9.5px] uppercase tracking-[0.2em] text-suit/70">
          © {year} Pasindu Kavishka · All Systems Nominal
        </p>
      </div>
    </footer>
  );
}

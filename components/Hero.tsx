"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export default function Hero() {
  const scrollToProjects = () => {
    document
      .getElementById("projects")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Pasindu_Kavishka_CV.pdf";
    link.click();
  };

  return (
    <Reveal>
      <section
        id="home"
        className="
          relative
          min-h-screen
          flex
          items-center
          overflow-hidden
          bg-[#030712]
        "
      >
        {/* =========================
            SPACE BACKGROUND
        ========================== */}

        {/* Main deep-space gradient */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-[#03131f]
            via-[#030712]
            to-[#08051a]
          "
        />

        {/* Left cyan atmospheric glow */}
        <div
          className="
            absolute
            -left-40
            top-1/3
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/10
            blur-[140px]
          "
        />

        {/* Right violet planetary glow */}
        <div
          className="
            absolute
            -right-32
            top-1/4
            h-[600px]
            w-[600px]
            rounded-full
            bg-violet-600/15
            blur-[160px]
          "
        />

        {/* Small stars */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute left-[8%] top-[25%] h-1 w-1 rounded-full bg-cyan-300/70" />
          <span className="absolute left-[18%] top-[62%] h-1 w-1 rounded-full bg-white/50" />
          <span className="absolute left-[30%] top-[20%] h-[3px] w-[3px] rounded-full bg-cyan-300/50" />
          <span className="absolute left-[42%] top-[75%] h-1 w-1 rounded-full bg-white/40" />
          <span className="absolute left-[55%] top-[28%] h-[3px] w-[3px] rounded-full bg-cyan-300/60" />
          <span className="absolute left-[66%] top-[65%] h-1 w-1 rounded-full bg-white/40" />
          <span className="absolute left-[78%] top-[22%] h-[3px] w-[3px] rounded-full bg-cyan-300/60" />
          <span className="absolute right-[8%] top-[70%] h-1 w-1 rounded-full bg-violet-300/60" />
        </div>

        {/* =========================
            HERO PORTRAIT
        ========================== */}

        <div
          className="
            absolute
            inset-y-0
            right-0
            hidden
            md:block
            w-[48%]
            pointer-events-none
            z-[2]
          "
        >
          <Image
            src="/images/pasindu-hero-new.png"
            alt="Pasindu Kavishka"
            fill
            priority
            sizes="48vw"
            className="
              object-contain
              object-bottom
            "
          />

          {/* Fade portrait toward center */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#030712]
              via-[#030712]/20
              to-transparent
          "
          />

          {/* Bottom fade */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#030712]
              via-transparent
              to-transparent
            "
          />
        </div>

        {/* =========================
            HERO CONTENT
        ========================== */}

        <div
          className="
            relative
            z-10
            w-full
            max-w-7xl
            mx-auto
            px-6
            sm:px-10
            lg:px-16
          "
        >
          <div
            className="
              max-w-3xl
              text-center
              md:text-left
            "
          >
            {/* Intro Label */}
            <div
              className="
                mb-5
                flex
                items-center
                justify-center
                md:justify-start
                gap-3
              "
            >
              <span
                className="
                  h-[1px]
                  w-8
                  bg-cyan-400
                "
              />

              <p
                className="
                  text-xs
                  sm:text-sm
                  uppercase
                  tracking-[0.35em]
                  text-cyan-400
                "
              >
                Software Engineer
              </p>
            </div>

            {/* Name */}
            <h1
              className="
                text-5xl
                sm:text-6xl
                lg:text-7xl
                xl:text-8xl
                font-bold
                leading-[0.95]
                tracking-tight
                text-white
              "
            >
              Pasindu
              <br />
              Kavishka
            </h1>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-xl
                mx-auto
                md:mx-0
                text-base
                sm:text-lg
                leading-relaxed
                text-gray-400
              "
            >
              Building scalable web, mobile, cloud and
              AI-powered solutions across a growing
              digital ecosystem.
            </p>

            {/* Buttons */}
            <div
              className="
                mt-9
                flex
                flex-col
                sm:flex-row
                justify-center
                md:justify-start
                gap-4
              "
            >
              <button
                onClick={scrollToProjects}
                className="
                  group
                  rounded-xl
                  bg-cyan-500
                  px-7
                  py-3
                  font-semibold
                  text-black
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-105
                  hover:bg-cyan-400
                  hover:shadow-xl
                  hover:shadow-cyan-500/30
                  active:scale-95
                "
              >
                <span className="flex items-center justify-center gap-2">
                  Enter Digital City

                  <span
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  >
                    →
                  </span>
                </span>
              </button>

              <button
                onClick={downloadCV}
                className="
                  group
                  rounded-xl
                  border
                  border-white/15
                  bg-white/5
                  px-7
                  py-3
                  text-white
                  backdrop-blur-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-cyan-400/60
                  hover:bg-cyan-500/10
                  hover:shadow-lg
                  hover:shadow-cyan-500/10
                  active:scale-95
                "
              >
                <span className="flex items-center justify-center gap-2">
                  Download CV

                  <span
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-y-[2px]
                    "
                  >
                    ↓
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            SCROLL INDICATOR
        ========================== */}

        <div
          className="
            absolute
            bottom-8
            left-1/2
            z-10
            hidden
            -translate-x-1/2
            md:flex
            flex-col
            items-center
            gap-2
            text-xs
            uppercase
            tracking-[0.25em]
            text-gray-500
          "
        >
          <span>Explore the Universe</span>

          <span className="text-cyan-400 text-lg">
            ↓
          </span>
        </div>

        {/* Bottom Space Transition */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-48
            pointer-events-none
            bg-gradient-to-b
            from-transparent
            via-[#050816]/40
            to-[#050816]
          "
        />
      </section>
    </Reveal>
  );
}
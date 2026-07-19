"use client";

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
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Glow Effects */}
        {/* <div className="absolute top-40 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px]" />
        <div className="absolute bottom-48 right-20 w-72 h-72 bg-purple-500/20 blur-[120px]" /> */}

        <div className="relative z-10 text-center px-6">
          <p className="mb-4 text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-400">
            Software Engineer
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-none">
            Pasindu
          </h1>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold leading-none">
            Kavishka
          </h1>

          <p className="mx-auto mt-6 sm:mt-8 max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed px-2">
            Building scalable web, mobile, cloud and AI-powered solutions.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={scrollToProjects}
              className="
                w-full sm:w-auto
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
                Explore City
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>

            <button
              onClick={downloadCV}
              className="
                w-full sm:w-auto
                group
                rounded-xl
                border
                border-white/20
                bg-white/5
                px-7
                py-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:scale-105
                hover:border-cyan-400
                hover:bg-cyan-500/10
                hover:shadow-lg
                hover:shadow-cyan-500/10
                active:scale-95
              "
            >
              <span className="flex items-center justify-center gap-2">
                Download CV
                <span className="transition-transform duration-300 group-hover:translate-y-[2px]">
                  ↓
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
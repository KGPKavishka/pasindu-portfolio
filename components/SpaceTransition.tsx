"use client";

import Reveal from "./Reveal";

export default function SpaceTransition() {
  return (
    <section
      className="
                relative
                min-h-screen
                flex
                items-center
                justify-center
                overflow-hidden
            "
    >
      {/* ============================= */}
      {/* Center Journey Content */}
      {/* ============================= */}

      <div className="relative z-10 w-full px-6 text-center">
        <Reveal y={20}>
          <div className="flex flex-col items-center">
            {/* Top Navigation Line */}
            <div
              className="
                                h-20
                                w-px
                                bg-gradient-to-b
                                from-transparent
                                via-cyan-400/30
                                to-cyan-400/10
                            "
            />

            {/* Orbit Indicator */}
            <div
              className="
                                relative
                                mt-8
                                flex
                                items-center
                                justify-center
                            "
            >
              <div
                className="
                                    absolute
                                    w-24
                                    h-24
                                    rounded-full
                                    border
                                    border-cyan-400/10
                                "
              />

              <div
                className="
                                    absolute
                                    w-16
                                    h-16
                                    rounded-full
                                    border
                                    border-cyan-400/20
                                "
              />

              <div
                className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-cyan-400
                                    shadow-[0_0_20px_rgba(34,211,238,0.8)]
                                "
              />
            </div>

            {/* Status */}
            <p
              className="
                                mt-16
                                text-[10px]
                                sm:text-xs
                                uppercase
                                tracking-[0.4em]
                                text-cyan-400
                            "
            >
              Entering Orbit
            </p>

            {/* Heading */}
            <h2
              className="
                                mt-5
                                text-3xl
                                sm:text-4xl
                                md:text-5xl
                                font-semibold
                                tracking-tight
                                text-white
                            "
            >
              Signal Detected
            </h2>

            {/* Description */}
            <p
              className="
                                mt-4
                                text-sm
                                sm:text-base
                                text-gray-500
                            "
            >
              Approaching the software engineering ecosystem.
            </p>

            {/* System Status */}
            <div
              className="
                                mt-10
                                flex
                                items-center
                                gap-3
                                rounded-full
                                border
                                border-cyan-400/10
                                bg-cyan-400/[0.03]
                                backdrop-blur-sm
                                px-5
                                py-2
                            "
            >
              <span
                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-cyan-400
                                    shadow-[0_0_10px_rgba(34,211,238,0.8)]
                                "
              />

              <span
                className="
                                    text-[9px]
                                    uppercase
                                    tracking-[0.3em]
                                    text-gray-500
                                "
              >
                Digital City // Online
              </span>
            </div>

            {/* Bottom Navigation Line */}
            <div
              className="
                                mt-12
                                h-24
                                w-px
                                bg-gradient-to-b
                                from-cyan-400/20
                                to-transparent
                            "
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

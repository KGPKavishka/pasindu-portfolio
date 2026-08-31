import Reveal from "./Reveal";
import AnimatedCounter from "./AnimatedCounter";

export default function Stats() {
  const stats = [
    {
      value: 600,
      suffix: "+",
      label: "Internship Hours",
    },
    {
      value: 4,
      suffix: "+",
      label: "Major Projects",
    },
    {
      value: 20,
      suffix: "+",
      label: "Technologies",
    },
    {
      value: 1,
      suffix: "",
      label: "Research Project",
    },
  ];

  return (
    <section
      id="mission-stats"
      className="
        relative
        px-6
        pt-6
        pb-32
        overflow-hidden
      "
    >
      <div className="relative z-10 max-w-5xl mx-auto">
        <Reveal delay={0.1}>
          {/* Mission Data HUD */}
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              border
              border-cyan-400/10
              bg-white/[0.015]
              backdrop-blur-sm
            "
          >
            {/* Top subtle glow line */}
            <div
              className="
                absolute
                top-0
                left-1/2
                -translate-x-1/2
                w-1/3
                h-px
                bg-gradient-to-r
                from-transparent
                via-cyan-400/70
                to-transparent
              "
            />

            {/* HUD Header */}
            <div className="pt-6 pb-5 text-center">
              <p
                className="
                  text-[10px]
                  sm:text-xs
                  uppercase
                  tracking-[0.35em]
                  text-cyan-400
                "
              >
                Mission Data
              </p>

              <p
                className="
                  mt-2
                  text-[9px]
                  sm:text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-gray-600
                "
              >
                System Profile // PK-01
              </p>
            </div>

            {/* Separator */}
            <div
              className="
                mx-auto
                h-px
                w-[90%]
                bg-gradient-to-r
                from-transparent
                via-white/10
                to-transparent
              "
            />

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <Reveal
                  key={stat.label}
                  delay={index * 0.08}
                  y={20}
                >
                  <div
                    className={`
                      group
                      relative
                      px-4
                      py-8
                      sm:py-10
                      text-center
                      transition-all
                      duration-500
                      hover:bg-cyan-400/[0.025]

                      ${index !== stats.length - 1
                        ? "lg:border-r lg:border-white/[0.06]"
                        : ""
                      }

                      ${index % 2 === 0
                        ? "border-r border-white/[0.06] lg:border-r"
                        : ""
                      }

                      ${index < 2
                        ? "border-b border-white/[0.06] lg:border-b-0"
                        : ""
                      }
                    `}
                  >
                    {/* Small HUD indicator */}
                    <div
                      className="
                        mx-auto
                        mb-4
                        h-1
                        w-1
                        rounded-full
                        bg-cyan-400/70
                        shadow-[0_0_8px_rgba(34,211,238,0.8)]
                      "
                    />

                    <h3
                      className="
                        text-3xl
                        sm:text-4xl
                        font-bold
                        text-cyan-400
                        transition-all
                        duration-300
                        group-hover:text-cyan-300
                        group-hover:scale-105
                      "
                    >
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </h3>

                    <p
                      className="
                        mt-2
                        text-xs
                        sm:text-sm
                        text-gray-500
                        leading-relaxed
                        transition-colors
                        duration-300
                        group-hover:text-gray-400
                      "
                    >
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Bottom subtle line */}
            <div
              className="
                absolute
                bottom-0
                left-1/2
                -translate-x-1/2
                w-1/4
                h-px
                bg-gradient-to-r
                from-transparent
                via-cyan-400/30
                to-transparent
              "
            />
          </div>
        </Reveal>

        {/* Journey continuation */}
        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-col items-center">
            <div className="h-12 w-px bg-gradient-to-b from-cyan-400/30 to-transparent" />

            <div className="mt-3 flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-400/20" />

              <span
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.3em]
                  text-gray-600
                "
              >
                Journey Initialized
              </span>

              <span className="h-px w-8 bg-cyan-400/20" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

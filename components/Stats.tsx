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
    <Reveal delay={0.1}>
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 0.08}
                y={30}
              >
                <div
                  className="
                    group
                    bg-white/5
                    border
                    border-white/10
                    rounded-3xl
                    p-5
                    sm:p-6
                    text-center
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-cyan-500/30
                    hover:shadow-lg
                    hover:shadow-cyan-500/10
                  "
                >
                  <h3 
                    className="
                      text-3xl
                      sm:text-4xl
                      font-bold
                      text-cyan-400
                      transition-all
                      duration-300
                      group-hover:scale-110
                      group-hover:text-cyan-300
                    "
                  >
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                    />
                  </h3>

                  <p className="mt-2 text-sm sm:text-base text-gray-400 leading-relaxed">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
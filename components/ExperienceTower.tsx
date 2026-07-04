import { experiences } from "../data/experienceData";
import Reveal from "./Reveal";

export default function ExperienceTower() {
  return (
    <Reveal delay={0.3}>
      <section
        id="experience"
        className="py-24 px-6"
      >
        <div className="max-w-7xl mx-auto">

          {/* Section Heading */}
          <span className="uppercase tracking-[0.3em] text-cyan-400 text-sm font-medium">
            Experience
          </span>

          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">
            Experience Tower
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl leading-8">
            Professional experience and industry exposure.
          </p>

          {experiences.map((experience, index) => (
            <Reveal
              key={experience.company}
              delay={index * 0.12}
              y={40}
            >
              <div
                className="
                  mt-12
                  bg-white/5
                  border
                  border-white/10
                  rounded-3xl
                  p-6
                  sm:p-8
                  transition-all
                  duration-300
                  hover:border-cyan-500/30
                  hover:shadow-lg
                  hover:shadow-cyan-500/10
                "
              >

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-10">

                  <div className="flex-1">

                    <h3 className="text-3xl font-bold">
                      {experience.company}
                    </h3>

                    <p className="text-cyan-400 mt-2 font-medium">
                      {experience.role}
                    </p>

                    <p className="text-gray-400 mt-1">
                      {experience.duration}
                    </p>

                    <p className="text-gray-300 mt-6 leading-8 max-w-2xl">
                      {experience.description}
                    </p>

                  </div>

                  {/* Hours Card */}
                  <div
                    className="
                      w-full
                      sm:w-48
                      lg:w-40
                      mx-auto
                      lg:mx-0
                      bg-cyan-500/10
                      border
                      border-cyan-500/20
                      rounded-2xl
                      px-6
                      py-5
                    "
                  >
                    <div className="text-center">

                      <p className="text-5xl font-bold text-cyan-400">
                        600+
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        Hours Completed
                      </p>

                    </div>
                  </div>

                </div>

                {/* Project */}
                <div className="mt-10">

                  <h4 className="text-xl font-bold mb-4">
                    Project
                  </h4>

                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      px-5
                      py-3
                      rounded-xl
                      bg-cyan-500/10
                      border
                      border-cyan-500/20
                      transition-all
                      duration-300
                      hover:border-cyan-400
                      hover:bg-cyan-500/20
                      hover:-translate-y-1
                    "
                  >
                    <span className="text-xl">
                      🚕
                    </span>

                    <span className="font-medium">
                      {experience.project}
                    </span>

                  </div>

                </div>

                {/* Technologies */}
                <div className="mt-10">

                  <h4 className="text-xl font-bold mb-4">
                    Technologies
                  </h4>

                  <div className="flex flex-wrap gap-3">

                    {experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="
                          px-3
                          py-1.5
                          text-sm
                          rounded-full
                          bg-white/5
                          border
                          border-white/10
                          transition-all
                          duration-300
                          hover:border-cyan-400
                          hover:text-cyan-300
                        "
                      >
                        {tech}
                      </span>
                    ))}

                  </div>

                </div>

                {/* Contributions */}
                <div className="mt-10">

                  <h4 className="text-xl font-bold mb-4">
                    Key Contributions
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {experience.achievements.map((item) => (
                      <div
                        key={item}
                        className="
                          bg-white/5
                          border
                          border-white/10
                          rounded-xl
                          p-4
                          transition-all
                          duration-300
                          hover:border-cyan-500/30
                        "
                      >
                        ✓ {item}
                      </div>
                    ))}

                  </div>

                </div>

              </div>
            </Reveal>
          ))}

        </div>
      </section>
    </Reveal>
  );
}
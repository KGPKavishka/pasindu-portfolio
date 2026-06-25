import { experiences } from "../data/experienceData";

export default function ExperienceTower() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl font-bold mb-4">
          Experience Tower
        </h2>

        <p className="text-gray-400 mb-12">
          Professional experience and industry exposure.
        </p>

        {experiences.map((experience) => (
          <div
            key={experience.company}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">

              <div>
                <h3 className="text-3xl font-bold">
                  {experience.company}
                </h3>

                <p className="text-cyan-400 mt-2">
                  {experience.role}
                </p>

                <p className="text-gray-400 mt-1">
                  {experience.duration}
                </p>

                <p className="text-gray-300 mt-6 max-w-2xl">
                  {experience.description}
                </p>
              </div>

              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl px-6 py-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-cyan-400">
                    600+
                  </p>

                  <p className="text-sm text-gray-400">
                    Hours Completed
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-10">

              <h4 className="text-xl font-bold mb-4">
                Project
              </h4>

              <div className="inline-flex px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                🚕 {experience.project}
              </div>

            </div>

            <div className="mt-10">

              <h4 className="text-xl font-bold mb-4">
                Technologies
              </h4>

              <div className="flex flex-wrap gap-3">

                {experience.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10"
                  >
                    {tech}
                  </span>
                ))}

              </div>

            </div>

            <div className="mt-10">

              <h4 className="text-xl font-bold mb-4">
                Key Contributions
              </h4>

              <div className="grid md:grid-cols-2 gap-3">

                {experience.achievements.map((item) => (
                  <div
                    key={item}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    ✓ {item}
                  </div>
                ))}

              </div>

            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
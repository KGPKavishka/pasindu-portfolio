import SkillRack from "./SkillRack";
import { skills } from "../data/skillsData";

export default function DataCenter() {
  return (
    <section className="py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold mb-4">
          Data Center
        </h2>

        <p className="text-gray-400 mb-12 max-w-2xl">
          The technologies, tools and platforms
          that power my software engineering
          ecosystem.
        </p>

        <div className="grid md:grid-cols-2 gap-6">

          {skills.map((skill) => (
            <SkillRack
              key={skill.title}
              title={skill.title}
              level={skill.level}
              technologies={skill.technologies}
            />
          ))}

        </div>

      </div>

    </section>
  );
}
import SkillRack from "./SkillRack";
import { skills } from "../data/skillsData";
import Reveal from "./Reveal";
import RevealGroup from "./RevealGroup";
import RevealItem from "./RevealItem";

export default function DataCenter() {
  return (
    <Reveal delay={0.5}>
      <section
        id="skills"
        className="py-24 px-6"
      >

        <div className="max-w-7xl mx-auto">

          {/* Section Heading */}

          <span className="uppercase tracking-[0.3em] text-cyan-400 text-sm font-medium">
            Skills
          </span>

          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">
            Data Center
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl leading-8">
            The technologies, tools and platforms
            that power my software engineering ecosystem.
          </p>

          <RevealGroup stagger={0.3}>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">

              {skills.map((skill) => (

                <RevealItem key={skill.id}>
                  <SkillRack
                    title={skill.title}
                    level={skill.level}
                    technologies={skill.technologies}
                  />
                </RevealItem>

              ))}

            </div>

          </RevealGroup>

        </div>

      </section>
    </Reveal>
  );
}
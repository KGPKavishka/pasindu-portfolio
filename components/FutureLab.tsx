import { futureSkills } from "../data/futureData";
import Reveal from "./Reveal";

export default function FutureLab() {
  return (
    <Reveal delay={0.2}>
      <section className="relative flex min-h-screen items-center px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-md border-l border-fuchsia-300/50 pl-4">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-fuchsia-200">
              Research Signal
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Future Lab
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Exploring the systems, tools, and engineering practices behind the
              next generation of production software.
            </p>
          </div>

          <details className="mt-12 max-w-2xl border-y border-fuchsia-200/20 py-4 text-sm text-slate-300">
            <summary className="cursor-pointer font-medium text-fuchsia-100 marker:text-fuchsia-300">
              Active areas of exploration
            </summary>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {futureSkills.map((skill) => (
                <li
                  key={skill.id}
                  className="border-l border-fuchsia-300/30 pl-3"
                >
                  <p className="font-medium text-white">{skill.title}</p>
                  <p className="mt-1 leading-6 text-slate-400">
                    {skill.description}
                  </p>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </Reveal>
  );
}

import { Project } from "../types/project";

interface Props {
  project: Project;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">

      <div className="bg-[#0b1020] border border-white/10 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-3xl font-bold">
            {project.emoji} {project.title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>

        </div>

        <p className="text-cyan-400 mb-4">
          {project.subtitle}
        </p>

        <p className="text-gray-300 mb-8">
          {project.description}
        </p>

        <h3 className="font-bold text-xl mb-3">
          Technologies
        </h3>

        <div className="flex flex-wrap gap-2 mb-8">

          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}

        </div>

        {project.architecture && (
          <>
            <h3 className="font-bold text-xl mb-3">
              Architecture
            </h3>

            <ul className="mb-8 space-y-2">

              {project.architecture.map((item) => (
                <li key={item}>
                  → {item}
                </li>
              ))}

            </ul>
          </>
        )}

        {project.achievements && (
          <>
            <h3 className="font-bold text-xl mb-3">
              Achievements
            </h3>

            <ul className="space-y-2">

              {project.achievements.map((item) => (
                <li key={item}>
                  ✓ {item}
                </li>
              ))}

            </ul>
          </>
        )}

      </div>

    </div>
  );
}
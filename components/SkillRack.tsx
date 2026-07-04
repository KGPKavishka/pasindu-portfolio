interface Props {
  title: string;
  level: number;
  technologies: string[];
}

export default function SkillRack({
  title,
  level,
  technologies,
}: Props) {

  const getSkillLevel = () => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Emerging";
  };

  return (
    <div
      className="
        group
        h-full
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-500/40
        hover:bg-white/10
        hover:shadow-xl
        hover:shadow-cyan-500/10
      "
    >

      {/* Header */}

      <div className="flex justify-between items-center mb-5">

        <h3 className="text-2xl font-bold">
          {title}
        </h3>

        <span
          className="
            text-xs
            px-3
            py-1
            rounded-full
            bg-cyan-500/10
            border
            border-cyan-500/20
            text-cyan-400
            transition-all
            duration-300
            group-hover:border-cyan-400/40
            group-hover:bg-cyan-500/20
          "
        >
          {technologies.length} Tech
        </span>

      </div>

      {/* Technologies */}

      <div className="flex flex-wrap gap-2 mb-6">

        {technologies.map((tech) => (
          <span
            key={tech}
            className="
              px-3
              py-1
              rounded-full
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-sm
              transition-all
              duration-300
              group-hover:border-cyan-400/40
              hover:bg-cyan-500/20
              hover:scale-105
            "
          >
            {tech}
          </span>
        ))}

      </div>

      {/* Skill Level */}

      <div>

        <div className="flex justify-between mb-2">

          <span className="text-gray-400">
            Skill Level
          </span>

          <span
            className="
              text-cyan-400
              font-bold
              transition-colors
              duration-300
              group-hover:text-cyan-300
            "
          >
            {getSkillLevel()}
          </span>

        </div>

        {/* Progress Bar */}

        <div className="h-3 rounded-full bg-white/10 overflow-hidden">

          <div
            className="
              h-full
              rounded-full
              bg-cyan-400
              transition-all
              duration-700
              group-hover:bg-cyan-300
            "
            style={{
              width: `${level}%`,
            }}
          />

        </div>

        <div
          className="
            text-right
            mt-2
            text-xs
            text-gray-500
            transition-colors
            duration-300
            group-hover:text-cyan-300
          "
        >
          {level}%
        </div>

      </div>

    </div>
  );
}
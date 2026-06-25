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
    <div className="
      bg-white/5
      border border-white/10
      rounded-3xl
      p-6
      h-full
      transition-all
      duration-300
      hover:border-cyan-400
      hover:-translate-y-2
      hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]
    ">

      <div className="flex justify-between items-center mb-5">

        <h3 className="text-2xl font-bold">
          {title}
        </h3>

        <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          {technologies.length} Tech
        </span>

      </div>

      <div className="flex flex-wrap gap-2 mb-6">

        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-sm"
          >
            {tech}
          </span>
        ))}

      </div>

      <div>

        <div className="flex justify-between mb-2">

          <span className="text-gray-400">
            Skill Level
          </span>

          <span className="text-cyan-400 font-bold">
            {getSkillLevel()}
          </span>

        </div>

        <div className="h-3 rounded-full bg-white/10 overflow-hidden">

          <div
            className="h-full bg-cyan-400"
            style={{
              width: `${level}%`,
            }}
          />

        </div>

        <div className="text-right mt-2 text-xs text-gray-500">
          {level}%
        </div>

      </div>

    </div>
  );
}
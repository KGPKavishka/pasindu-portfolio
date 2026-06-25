interface Props {
  title: string;
  skills: string[];
}

export default function SkillCluster({
  title,
  skills,
}: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

      <h3 className="text-2xl font-bold mb-6">
        {title}
      </h3>

      <div className="flex flex-wrap gap-3">

        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
          >
            {skill}
          </span>
        ))}

      </div>

    </div>
  );
}
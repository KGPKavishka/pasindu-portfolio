export default function MissionCard() {
  return (
    <div
      className="
        rounded-3xl
        border
        border-cyan-400/20
        bg-gradient-to-br
        from-cyan-500/10
        to-transparent
        p-8
      "
    >
      <span
        className="
          inline-block
          rounded-full
          bg-cyan-500/20
          px-4
          py-1
          text-sm
          font-medium
          text-cyan-400
        "
      >
        Roadmap🚀
      </span>

      <h3 className="mt-6 text-3xl font-bold">
        Building the next generation of software.
      </h3>

      <p className="mt-6 text-gray-400 leading-8">
        My current focus is learning modern cloud-native
        architecture, AI engineering and scalable backend
        systems to build production-ready applications.
      </p>

      <div className="mt-8 space-y-4">

        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>

          <span>
            Exploring AI-powered software development
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>

          <span>
            Learning cloud-native application architecture
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>

          <span>
            Improving system design knowledge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400">✓</span>

          <span>
            Preparing for enterprise-scale engineering
          </span>
        </div>

      </div>
    </div>
  );
}
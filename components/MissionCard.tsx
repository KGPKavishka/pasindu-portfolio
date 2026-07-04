export default function MissionCard() {
  return (
    <div
      className="
        group
        rounded-3xl
        border
        border-cyan-400/20
        bg-gradient-to-br
        from-cyan-500/10
        to-transparent
        p-8
        transition-all
        duration-500
        hover:-translate-y-2
        hover:border-cyan-400/40
        hover:shadow-2xl
        hover:shadow-cyan-500/10
      "
    >
      {/* Badge */}
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
          transition-transform
          duration-300
          group-hover:scale-105
        "
      >
        Roadmap 🚀
      </span>

      {/* Title */}
      <h3 className="mt-6 text-3xl font-bold leading-tight">
        Building the next generation of software.
      </h3>

      {/* Description */}
      <p className="mt-6 text-gray-400 leading-8">
        My current focus is learning modern cloud-native
        architecture, AI engineering and scalable backend
        systems to build production-ready applications.
      </p>

      {/* Goals */}
      <div className="mt-8 space-y-4">

        <div className="flex items-center gap-3">
          <span className="text-cyan-400 text-lg">✓</span>

          <span className="transition-colors duration-300 group-hover:text-white">
            Exploring AI-powered software development
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400 text-lg">✓</span>

          <span className="transition-colors duration-300 group-hover:text-white">
            Learning cloud-native application architecture
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400 text-lg">✓</span>

          <span className="transition-colors duration-300 group-hover:text-white">
            Improving system design knowledge
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-400 text-lg">✓</span>

          <span className="transition-colors duration-300 group-hover:text-white">
            Preparing for enterprise-scale engineering
          </span>
        </div>

      </div>
    </div>
  );
}
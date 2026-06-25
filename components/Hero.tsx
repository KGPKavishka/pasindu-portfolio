export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-40 left-20 w-72 h-72 bg-cyan-500/20 blur-[120px]" />

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 blur-[120px]" />

      <div className="relative z-10 text-center px-6">

        <p className="text-cyan-400 mb-4 uppercase tracking-[0.3em]">
          Software Engineer
        </p>

        <h1 className="text-6xl md:text-8xl font-bold leading-none">
          Pasindu
        </h1>

        <h1 className="text-6xl md:text-8xl font-bold leading-none">
          Kavishka
        </h1>

        <p className="max-w-2xl mx-auto mt-8 text-gray-400 text-lg">
          Building scalable web, mobile,
          cloud and AI-powered solutions.
        </p>

        <div className="mt-10 flex justify-center gap-4">

          <button className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-semibold">
            Explore City
          </button>

          <button className="px-6 py-3 rounded-xl border border-white/20">
            Download CV
          </button>

        </div>

      </div>
    </section>
  );
}
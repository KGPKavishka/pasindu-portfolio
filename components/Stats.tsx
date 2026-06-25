export default function Stats() {
  const stats = [
    {
      value: "600+",
      label: "Internship Hours",
    },
    {
      value: "4+",
      label: "Major Projects",
    },
    {
      value: "20+",
      label: "Technologies",
    },
    {
      value: "1",
      label: "Research Project",
    },
  ];

  return (
    <section className="pb-24 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center"
            >
              <h3 className="text-4xl font-bold text-cyan-400">
                {stat.value}
              </h3>

              <p className="text-gray-400 mt-2">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
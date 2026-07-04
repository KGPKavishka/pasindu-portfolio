interface BuildingCardProps {
  emoji: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function BuildingCard({
  emoji,
  title,
  description,
  onClick,
}: BuildingCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        group
        h-full
        flex
        flex-col
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-400
        hover:bg-white/10
        hover:shadow-xl
        hover:shadow-cyan-500/10
      "
    >
      <div
        className="
          text-5xl
          mb-5
          transition-transform
          duration-300
          group-hover:scale-110
          group-hover:-translate-y-1
        "
      >
        {emoji}
      </div>

      <h3
        className="
          text-xl
          font-bold
          mb-3
          group-hover:text-cyan-300
          transition-colors
        "
      >
        {title}
      </h3>

      <p
        className="
          text-gray-400
          text-sm
          leading-7
          flex-grow
        "
      >
        {description}
      </p>

      <div className="mt-6 flex items-center text-cyan-400 text-sm font-medium">

        View Project

        <span
          className="
        ml-2
        transition-transform
        duration-300
        group-hover:translate-x-1
        "
        >
          →
        </span>

      </div>
    </div>
  );
}
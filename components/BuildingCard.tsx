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
      className="group bg-white/5 border border-white/10 rounded-3xl p-6 transition-all duration-300 hover:border-cyan-400 hover:-translate-y-2 hover:bg-white/10 cursor-pointer"
    >
      <div className="text-4xl mb-4">
        {emoji}
      </div>

      <h3 className="text-xl font-bold mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm">
        {description}
      </p>
    </div>
  );
}
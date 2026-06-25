import Image from "next/image";

interface Props {
  image: string;
  title: string;
  category: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}

export default function CreativeCard({
  image,
  title,
  category,
  size = "medium",
  onClick,
}: Props) {
  const imageHeight =
    size === "large"
      ? "h-96"
      : size === "small"
      ? "h-48"
      : "h-64";

  const imageFit =
    category === "Logo"
      ? "object-contain bg-white"
      : category === "Research"
      ? "object-contain bg-[#111827]"
      : "object-cover";

  return (
    <div
      onClick={onClick}
      className="
        group
        break-inside-avoid
        mb-6
        overflow-hidden
        rounded-3xl
        border border-white/10
        bg-white/5
        hover:border-cyan-400
        transition-all
        duration-300
        hover:-translate-y-1
        cursor-pointer
      "
    >
      <div className="relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={800}
          height={600}
          className={`
            w-full
            ${imageHeight}
            ${imageFit}
            transition
            duration-500
            group-hover:scale-110
          `}
        />

        {/* Hover Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/60
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
            flex
            items-center
            justify-center
          "
        >
          <span
            className="
              text-white
              font-semibold
              text-lg
              tracking-wide
            "
          >
            View Artwork →
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-cyan-400 text-sm">
          {category}
        </p>

        <h3 className="font-bold mt-1">
          {title}
        </h3>
      </div>
    </div>
  );
}
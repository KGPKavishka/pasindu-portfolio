import Image from "next/image";

interface Props {
  image: string;
  title: string;
  category: string;
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  priority?: boolean;
}

export default function CreativeCard({
  image,
  title,
  category,
  size = "medium",
  onClick,
  priority = false,
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
    <button
      type="button"
      aria-label={`View ${title}`}
      onClick={onClick}
      className="
        group
        block
        w-full
        break-inside-avoid
        mb-6
        overflow-hidden
        border border-suit/20 border-l-2 border-l-caution bg-void/85
        hover:border-caution
        transition-all
        duration-300
        hover:-translate-y-1
        cursor-pointer
        text-left
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-caution
      "
    >
      <div className="relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          priority={priority}
          className={`
            w-full
            ${imageHeight}
            ${imageFit}
            transition
            duration-500
            group-hover:scale-105
          `}
        />

        {/* Hover Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-void/70
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
              bg-signal px-3.5 py-2 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-sunlight
            "
          >
            Inspect Plate →
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="font-hud text-[10px] uppercase tracking-[0.2em] text-caution">
          {category}
        </p>

        <h3 className="mt-1 font-hud text-sm font-semibold uppercase tracking-[0.08em] text-sunlight">
          {title}
        </h3>
      </div>
    </button>
  );
}
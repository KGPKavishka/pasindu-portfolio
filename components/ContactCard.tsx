import Link from "next/link";

interface Props {
  icon: string;
  title: string;
  value: string;
  href: string;
}

export default function ContactCard({
  icon,
  title,
  value,
  href,
}: Props) {
  const isExternal =
    href.startsWith("http");

  const isResume =
    href.endsWith(".pdf");

  return (
    <Link
      href={href}
      target={
        isExternal ? "_blank" : undefined
      }
      rel={
        isExternal
          ? "noopener noreferrer"
          : undefined
      }
      download={isResume}
      className="
        group
        relative
        block
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400
        hover:shadow-2xl
        hover:shadow-cyan-500/10
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-cyan-500/10
          text-3xl
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      {/* Value */}
      <p className="mt-2 break-all text-gray-400">
        {value}
      </p>

      {/* Hover Indicator */}
      <div
        className="
          mt-6
          flex
          items-center
          justify-end
          text-sm
          font-medium
          text-cyan-400
          opacity-0
          translate-x-3
          transition-all
          duration-300
          group-hover:opacity-100
          group-hover:translate-x-0
        "
      >
        {isResume
          ? "Download →"
          : "Open →"}
      </div>
    </Link>
  );
}
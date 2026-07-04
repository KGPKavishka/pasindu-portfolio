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
  const isExternal = href.startsWith("http");

  const isResume = href.endsWith(".pdf");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={
        isExternal
          ? "noopener noreferrer"
          : undefined
      }
      download={isResume}
      className="
        group
        flex
        flex-col
        justify-between
        h-full
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-500/40
        hover:bg-white/10
        hover:shadow-xl
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
          border
          border-cyan-500/20
          text-3xl
          transition-all
          duration-300
          group-hover:scale-110
          group-hover:bg-cyan-500/20
          group-hover:border-cyan-400/40
        "
      >
        {icon}
      </div>

      {/* Title */}

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      {/* Value */}

      <p className="mt-2 break-all text-gray-400 leading-7">
        {value}
      </p>

      {/* Divider */}

      <div className="mt-6 border-t border-white/10" />

      {/* CTA */}

      <div
        className="
          mt-5
          flex
          items-center
          justify-between
        "
      >
        <span className="text-sm text-gray-500">
          {isResume
            ? "Download File"
            : "Open Link"}
        </span>

        <span
          className="
            text-cyan-400
            font-semibold
            transition-all
            duration-300
            translate-x-0
            group-hover:translate-x-1
          "
        >
          →
        </span>
      </div>

    </Link>
  );
}
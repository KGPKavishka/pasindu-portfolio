import Image from "next/image";
import { useEffect } from "react";

interface Props {
  image: string;
  title: string;
  category: string;
  description: string;
  tools?: string[];
  onClose: () => void;
}

export default function CreativeModal({
  image,
  title,
  category,
  description,
  tools,
  onClose,
}: Props) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="
        fixed
        inset-0
        z-50
        bg-black/90
        backdrop-blur-sm
        overflow-y-auto
        p-6
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          max-w-5xl
          mx-auto
          bg-[#111827]
          border
          border-white/10
          rounded-3xl
          overflow-hidden
          mt-10
        "
      >
        <button
          onClick={onClose}
          className="
            absolute
            top-6
            right-8
            text-3xl
            text-gray-400
            hover:text-cyan-400
            transition-colors
          "
        >
          ✕
        </button>

        {/* IMAGE */}
        <div className="relative w-full h-[600px] bg-black/30">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain"
          />
        </div>

        {/* CONTENT */}
        <div className="p-8">
          <p className="text-cyan-400 text-sm mb-3">
            {category}
          </p>

          <h2 className="text-4xl font-bold mb-5">
            {title}
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8">
            {description}
          </p>

          {tools && tools.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-4">
                Tools Used
              </h3>

              <div className="flex flex-wrap gap-3">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="
                      px-4
                      py-2
                      rounded-full
                      bg-cyan-500/10
                      border
                      border-cyan-500/20
                      text-cyan-300
                      text-sm
                    "
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
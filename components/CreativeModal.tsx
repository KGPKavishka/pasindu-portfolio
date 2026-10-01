import Image from "next/image";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

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

    // Lock background page scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleEsc);

    return () => {
      // Restore scrolling when modal closes
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`creative-${title.replaceAll(" ", "-")}-title`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/80
        backdrop-blur-sm
        p-6
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 16,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.98,
          y: 12,
        }}
        transition={{
          type: "spring",
          stiffness: 320,
          damping: 28,
        }}
        onClick={(e) => e.stopPropagation()}
        className="terminal-panel interface-dialog relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="terminal-control absolute right-3 top-3 z-20 h-10 w-10 min-h-10 p-0 text-lg sm:right-5 sm:top-5"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* IMAGE */}
        <div
          className="
            relative
            w-full
            h-[45vh]
            min-h-[280px]
            max-h-[500px]
            terminal-image-frame bg-black/30
          "
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) calc(100vw - 3rem), 896px"
            className="object-contain p-4"
          />
        </div>

        {/* CONTENT */}
        <div className="p-8">
          <p className="terminal-kicker mb-2">
            {category}
          </p>

          <h2
            id={`creative-${title.replaceAll(" ", "-")}-title`}
            className="terminal-title mb-4 text-xl sm:text-2xl"
          >
            {title}
          </h2>

          <p className="text-gray-300 leading-relaxed mb-8">
            {description}
          </p>

          {tools && tools.length > 0 && (
            <>
              <h3 className="mb-3">
                Tools Used
              </h3>

              <div className="flex flex-wrap gap-3">
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="terminal-chip px-2.5 py-1.5"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
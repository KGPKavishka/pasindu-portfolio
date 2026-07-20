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
        className="
          relative
          bg-[#0b1020]
          border
          border-white/10
          rounded-3xl
          max-w-4xl
          w-full
          max-h-[90vh]
          overflow-y-auto
          shadow-2xl
          shadow-cyan-500/10
        "
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="
            absolute
            top-6
            right-6
            z-20
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-white/10
            text-xl
            text-gray-300
            transition-all
            duration-300
            hover:bg-red-500/20
            hover:text-red-300
          "
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
            bg-black/30
          "
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-4"
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
      </motion.div>
    </motion.div>,
    document.body
  );
}
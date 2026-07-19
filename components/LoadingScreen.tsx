"use client";

import { motion } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({
  isLoading,
}: LoadingScreenProps) {
  return (
    <div
      className={`
        fixed
        inset-0
        z-[9999]
        flex
        flex-col
        items-center
        justify-center
        bg-[#050816]
        transition-all
        duration-700
        ${
          isLoading
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }
      `}
    >
      {/* Soft Background Glow */}
      <div
        className="
          absolute
          h-72
          w-72
          rounded-full
          bg-cyan-500/10
          blur-[100px]
        "
      />

      {/* Logo */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          text-7xl
          font-black
          tracking-widest
          text-cyan-400
        "
      >
        Pasi
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.3,
          duration: 0.6,
        }}
        className="
          relative
          mt-6
          text-sm
          text-gray-400
          tracking-[0.3em]
          uppercase
        "
      >
        Loading Portfolio...
      </motion.p>

      {/* Progress Bar */}
      <div
        className="
          relative
          mt-10
          w-64
          h-[3px]
          rounded-full
          bg-white/10
          overflow-hidden
        "
      >
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            via-cyan-300
            to-cyan-400
            shadow-[0_0_15px_rgba(34,211,238,0.7)]
          "
        />
      </div>

      {/* Loading Status */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.6,
          duration: 0.5,
        }}
        className="
          relative
          mt-4
          text-xs
          text-gray-600
          tracking-wider
        "
      >
        Initializing digital experience
      </motion.p>
    </div>
  );
}
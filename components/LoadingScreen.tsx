"use client";

import { motion, useReducedMotion } from "framer-motion";
import TerminalPanel from "@/components/UI/TerminalPanel";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({
  isLoading,
}: LoadingScreenProps) {
  const reduceMotion = useReducedMotion();

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
        bg-[#02070c]/95
        transition-all
        duration-700
        ${
          isLoading
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }
      `}
    >
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
      >
        <TerminalPanel className="w-[min(28rem,calc(100vw-2rem))] p-6 sm:p-8">
          <p className="terminal-kicker text-emerald-200">System // boot sequence</p>
          <h1 className="terminal-title mt-3 text-xl sm:text-2xl">Pasindu Kavishka</h1>
          <p className="terminal-meta mt-2">Loading Portfolio...</p>
          <div className="mt-7 h-1 border border-cyan-200/20 bg-black/50">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: reduceMotion ? 0 : 2, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-cyan-300 to-emerald-200 shadow-[0_0_12px_rgba(103,232,249,0.45)]"
            />
          </div>
          <p className="terminal-kicker mt-3 text-white/45">
            Initializing digital experience
          </p>
        </TerminalPanel>
      </motion.div>
    </div>
  );
}
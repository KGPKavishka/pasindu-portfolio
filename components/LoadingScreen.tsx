"use client";

import { motion, useReducedMotion } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden={!isLoading}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-void/96 transition-all duration-700 ${
        isLoading
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
    >
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.45 }}
        className="w-[min(28rem,calc(100vw-2rem))] border border-suit/20 border-t-2 border-t-caution bg-[#0d0d0c] p-6 sm:p-8"
      >
        <p className="font-hud text-[10px] uppercase tracking-[0.26em] text-caution">
          EVA-01 {"//"} VISOR BOOT SEQUENCE
        </p>
        <h2 className="mt-3 font-hud text-xl font-semibold uppercase tracking-[0.12em] text-sunlight sm:text-2xl">
          Pasindu Kavishka
        </h2>
        <p className="mt-1.5 font-hud text-[11px] uppercase tracking-[0.18em] text-suit/75">
          Pressurizing Suit & Telemetry...
        </p>
        <div className="mt-6 h-1.5 border border-suit/25 bg-void">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: reduceMotion ? 0 : 2, ease: "easeInOut" }}
            className="h-full bg-caution"
          />
        </div>
        <div className="mt-3 flex items-center justify-between font-hud text-[10px] uppercase tracking-[0.2em] text-suit/65">
          <span>COM-LINK: SYNCHRONIZING</span>
          <span className="text-nominal">SUIT: NOMINAL</span>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  blur?: number;
}

export default function Reveal({
  children,
  delay = 0,
  duration = 0.5,
  y = 30,
  scale = 0.99,
  blur = 6,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        scale,
        filter: `blur(${blur}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: 0.1,
      }}
      transition={{
        delay,
        duration,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
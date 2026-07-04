"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
}

export default function Reveal({
  children,
  delay = 0,
  y = 60,
}: Props) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
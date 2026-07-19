"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function RevealItem({
  children,
}: Props) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 30,
          scale: 0.97,
          filter: "blur(8px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
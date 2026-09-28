"use client";

import { motion, useReducedMotion } from "framer-motion";

interface TypewriterTextProps {
  text: string;
}

export default function TypewriterText({ text }: TypewriterTextProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      key={text}
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : 0.018,
          },
        },
      }}
    >
      <span aria-hidden="true">
        {Array.from(text).map((character, index) => (
          <motion.span
            key={`${character}-${index}`}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
          >
            {character}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
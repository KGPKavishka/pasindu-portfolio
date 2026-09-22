"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

type Particle = {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  opacity: number;
};

export default function Particles() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 20 }, (_, id) => {
        const random = (offset: number) => {
          const value = Math.sin((id + offset) * 12.9898) * 43758.5453;
          return value - Math.floor(value);
        };

        return {
          id,
          size: random(1) * 4 + 2,
          left: random(2) * 100,
          top: random(3) * 100,
          duration: random(4) * 12 + 12,
          delay: random(5) * 8,
          opacity: random(6) * 0.4 + 0.2,
        };
      }),
    [],
  );

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-300"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: particle.opacity,
            filter: "blur(1px)",
          }}
          animate={{
            x: [-10, 10, -10],
            y: [-20, 20, -20],
            opacity: [
              particle.opacity,
              particle.opacity * 0.5,
              particle.opacity,
            ],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

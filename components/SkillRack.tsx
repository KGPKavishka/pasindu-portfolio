import {
  motion,
  useInView,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
  title: string;
  level: number;
  technologies: string[];
}

export default function SkillRack({
  title,
  level,
  technologies,
}: Props) {

  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
  });

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(0, level, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate(value) {
        setCount(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [isInView, level]);

  const getSkillLevel = () => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Emerging";
  };

  return (
    <motion.div
      ref={ref}
      className="
        group
        h-full
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-500/40
        hover:bg-white/10
        hover:shadow-xl
        hover:shadow-cyan-500/10
      "
    >

      {/* Header */}

      <div className="flex justify-between items-center mb-5">

        <h3 className="text-2xl font-bold">
          {title}
        </h3>

        <span
          className="
            text-xs
            px-3
            py-1
            rounded-full
            bg-cyan-500/10
            border
            border-cyan-500/20
            text-cyan-400
            transition-all
            duration-300
            group-hover:border-cyan-400/40
            group-hover:bg-cyan-500/20
          "
        >
          {technologies.length} Tech
        </span>

      </div>

      {/* Technologies */}

      <div className="flex flex-wrap gap-2 mb-6">

        {technologies.map((tech, index) => (
          <motion.span
            key={tech}
            initial={{
              opacity: 0,
              y: 12,
              scale: 0.9,
            }}
            animate={
              isInView
                ? {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }
                : {}
            }
            transition={{
              delay: index * 0.08,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              px-3
              py-1
              rounded-full
              bg-cyan-500/10
              border
              border-cyan-500/20
              text-sm
              transition-all
              duration-300
              group-hover:border-cyan-400/40
              hover:bg-cyan-500/20
              hover:scale-105
            "
          >
            {tech}
          </motion.span>
        ))}

      </div>

      {/* Skill Level */}

      <div>

        <div className="flex justify-between mb-2">

          <span className="text-gray-400">
            Skill Level
          </span>

          <span
            className="
              text-cyan-400
              font-bold
              transition-colors
              duration-300
              group-hover:text-cyan-300
            "
          >
            {getSkillLevel()}
          </span>

        </div>

        {/* Progress Bar */}

        <div className="h-3 rounded-full bg-white/10 overflow-hidden">

          <motion.div
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-cyan-500
              via-cyan-400
              to-cyan-300
              shadow-lg
              shadow-cyan-400/30
            "
            initial={{
              width: 0,
            }}
            animate={
              isInView
                ? {
                  width: `${level}%`,
                }
                : {}
            }
            transition={{
              duration: 2.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

        </div>

        <div
          className="
            text-right
            mt-2
            text-xs
            text-gray-500
            transition-colors
            duration-300
            group-hover:text-cyan-300
          "
        >
          {count}%
        </div>

      </div>

    </motion.div>
  );
}
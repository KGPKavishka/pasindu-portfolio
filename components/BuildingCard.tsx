import Image from "next/image";
import TiltCard from "./TiltCard";

interface BuildingCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  technologies: string[];
  accentColor?: string;
  onClick?: () => void;
}

export default function BuildingCard({
  emoji,
  title,
  subtitle,
  description,
  heroImage,
  technologies,
  onClick,
}: BuildingCardProps) {
  return (
    <div className="h-full">
      <TiltCard
        className="
            h-full
            group
            overflow-hidden
            rounded-3xl
            border
            border-white/10
            bg-white/5
            cursor-pointer
            transition-all
            duration-500
            hover:border-cyan-400/60
            hover:shadow-2xl
            hover:shadow-cyan-500/20
        "
      >
        <div
          onClick={onClick}
          className="
          relative
          h-full
          overflow-hidden
          rounded-3xl
        "
        >

          {/* Hover Glow */}
          <div
            className="
            pointer-events-none
            absolute
            inset-0
            opacity-0
            transition-all
            duration-700
            group-hover:opacity-100
          "
          >
            <div
              className="
              absolute
              -left-20
              top-1/2
              h-56
              w-56
              -translate-y-1/2
              rounded-full
              bg-cyan-400/10
              blur-[90px]
            "
            />

            <div
              className="
              absolute
              -right-20
              bottom-0
              h-44
              w-44
              rounded-full
              bg-cyan-500/10
              blur-[80px]
            "
            />
          </div>

          {/* Cover Image */}
          <div
            className="
            relative
            h-48
            sm:h-56
            overflow-hidden
            rounded-t-3xl
            will-change-transform
          "
          >
            <Image
              src={heroImage}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
              className="
              object-cover
              transition-transform
              duration-700
              group-hover:scale-110
              will-change-transform
              backface-hidden
            "
            />

            {/* Gradient Overlay */}
            <div
              className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#050816]
              via-[#050816]/40
              to-transparent
            "
            />

            {/* Emoji Badge */}
            <div
              className="
              absolute
              left-5
              top-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-black/40
              backdrop-blur-md
              text-3xl
            "
            >
              {emoji}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-6">
            <h3
              className="
              text-2xl
              font-bold
              transition-colors
              duration-300
              group-hover:text-cyan-300
            "
            >
              {title}
            </h3>

            <p className="mt-2 text-sm text-cyan-400">
              {subtitle}
            </p>

            <p
              className="
                mt-4
                sm:mt-5
                text-sm
                sm:text-base
                text-gray-400
                leading-6
                sm:leading-7
                line-clamp-3
              "
            >
              {description}
            </p>

            {/* Technologies */}
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2">
              {technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="
                  rounded-full
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-3
                  py-1
                  text-xs
                  text-cyan-300
                  transition-all
                  duration-300
                  group-hover:bg-cyan-500/15
                "
                >
                  {tech}
                </span>
              ))}

              {technologies.length > 3 && (
                <span
                  className="
                  rounded-full
                  border
                  border-white/10
                  px-3
                  py-1
                  text-xs
                  text-gray-400
                "
                >
                  +{technologies.length - 3}
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="mt-6 sm:mt-8 flex items-center justify-between">
              <span
                className="
                font-medium
                text-cyan-400
                transition-all
                duration-300
                group-hover:text-cyan-300
              "
              >
                Explore Project
              </span>

              <div
                className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-cyan-500/30
                bg-cyan-500/10
                transition-all
                duration-300
                group-hover:translate-x-1
                group-hover:scale-110
                group-hover:bg-cyan-500
                group-hover:text-black
              "
              >
                →
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}
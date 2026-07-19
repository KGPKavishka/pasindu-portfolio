"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from "framer-motion";

export default function Navbar() {
  const [activeSection, setActiveSection] =
    useState("projects");

  const [hoveredItem, setHoveredItem] =
    useState<string | null>(null);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  useEffect(() => {
    const sections = [
      "projects",
      "experience",
      "skills",
      "contact",
    ];

    const handleScroll = () => {
      if (document.body.classList.contains("modal-open")) {
        return;
      }

      const pageBottom =
        window.innerHeight + window.scrollY;

      const pageHeight =
        document.documentElement.scrollHeight;

      if (pageBottom >= pageHeight - 5) {
        setActiveSection("contact");
        return;
      }

      let currentSection = "projects";

      for (const section of sections) {
        const element =
          document.getElementById(section);

        if (!element) continue;

        const rect =
          element.getBoundingClientRect();

        // Navbar position (~80px from top)
        if (
          rect.top <= 120 &&
          rect.bottom >= 120
        ) {
          currentSection = section;
          break;
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        right-0
        z-50

        border-b
        border-white/5

        bg-[#050816]/65

        backdrop-blur-3xl

        shadow-xl
        shadow-black/20
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
          h-20
          px-6
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
              border
              border-cyan-400/25
              bg-cyan-500/10
              font-bold
              text-cyan-400
              shadow-lg
              shadow-cyan-500/10
            "
          >
            Pasi
          </div>

          <div>

            <h1 className="text-lg font-semibold tracking-tight">
              Pasindu Kavishka
            </h1>

            <p className="text-[11px] tracking-wide uppercase text-gray-400">
              Software Engineer
            </p>

          </div>

        </div>

        <LayoutGroup>

          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              rounded-full
              border
              border-white/5
              bg-white/[0.03]
              p-1.5
              backdrop-blur-xl
            "
          >
            <a
              href="#projects"
              onMouseEnter={() => setHoveredItem("projects")}
              onMouseLeave={() => setHoveredItem(null)}
              className="
                relative
                overflow-hidden
                rounded-full
                px-6
                py-2.5
                text-[14px]
                font-medium
                transition-colors
                duration-300
              "
            >
              {(hoveredItem === "projects" ||
                activeSection === "projects") && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="
                    absolute
                    inset-0
                    rounded-full
                    bg-cyan-400/15
                    border
                    border-cyan-400/20
                    shadow-lg
                    shadow-cyan-400/10
                  "
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}

              <span
                className={`relative z-10 ${activeSection === "projects"
                  ? "text-cyan-300 font-semibold"
                  : "text-white hover:text-cyan-300"
                  }`}
              >
                Projects
              </span>
            </a>

            <a
              href="#experience"
              onMouseEnter={() => setHoveredItem("experience")}
              onMouseLeave={() => setHoveredItem(null)}
              className="
                relative
                overflow-hidden
                rounded-full
                px-6
                py-2.5
                text-[14px]
                font-medium
                transition-colors
                duration-300
              "
            >
              {(hoveredItem === "experience" ||
                activeSection === "experience") && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="
                    absolute
                    inset-0
                    rounded-full
                    bg-cyan-400/15
                    border
                    border-cyan-400/20
                    shadow-lg
                    shadow-cyan-400/10
                  "
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}

              <span
                className={`relative z-10 ${activeSection === "experience"
                  ? "text-cyan-300 font-semibold"
                  : "text-white hover:text-cyan-300"
                  }`}
              >
                Experience
              </span>
            </a>

            <a
              href="#skills"
              onMouseEnter={() => setHoveredItem("skills")}
              onMouseLeave={() => setHoveredItem(null)}
              className="
                relative
                overflow-hidden
                rounded-full
                px-6
                py-2.5
                text-[14px]
                font-medium
                transition-colors
                duration-300
              "
            >
              {(hoveredItem === "skills" ||
                activeSection === "skills") && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="
                    absolute
                    inset-0
                    rounded-full
                    bg-cyan-400/15
                    border
                    border-cyan-400/20
                    shadow-lg
                    shadow-cyan-400/10
                  "
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}

              <span
                className={`relative z-10 ${activeSection === "skills"
                  ? "text-cyan-300 font-semibold"
                  : "text-white hover:text-cyan-300"
                  }`}
              >
                Skills
              </span>
            </a>

            <a
              href="#contact"
              onMouseEnter={() => setHoveredItem("contact")}
              onMouseLeave={() => setHoveredItem(null)}
              className="
                relative
                overflow-hidden
                rounded-full
                px-6
                py-2.5
                text-[14px]
                font-medium
                transition-colors
                duration-300
              "
            >
              {(hoveredItem === "contact" ||
                activeSection === "contact") && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="
                    absolute
                    inset-0
                    rounded-full
                    bg-cyan-400/15
                    border
                    border-cyan-400/20
                    shadow-lg
                    shadow-cyan-400/10
                  "
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}

              <span
                className={`relative z-10 ${activeSection === "contact"
                  ? "text-cyan-300 font-semibold"
                  : "text-white hover:text-cyan-300"
                  }`}
              >
                Contact
              </span>
            </a>
          </div>
        </LayoutGroup>

        <div className="md:hidden">
          <button
            onClick={() =>
              setIsMenuOpen(!isMenuOpen)
            }
            className="text-white transition-colors hover:text-cyan-400"
          >
            {isMenuOpen ? (
              <X size={28} />
            ) : (
              <Menu size={28} />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            transition={{
              duration: 0.25,
            }}
            className="md:hidden border-t border-white/10 bg-[#050816]/95 backdrop-blur-md"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              <a
                href="#projects"
                onClick={() => setIsMenuOpen(false)}
                className="text-white transition-colors hover:text-cyan-400"
              >
                Projects
              </a>

              <a
                href="#experience"
                onClick={() => setIsMenuOpen(false)}
                className="text-white transition-colors hover:text-cyan-400"
              >
                Experience
              </a>

              <a
                href="#skills"
                onClick={() => setIsMenuOpen(false)}
                className="text-white transition-colors hover:text-cyan-400"
              >
                Skills
              </a>

              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-white transition-colors hover:text-cyan-400"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
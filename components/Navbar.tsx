"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [activeSection, setActiveSection] =
    useState("projects");

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
      // Contact highlight only when reaching
      // the very bottom of the page.
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
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">
          Pasindu Kavishka
        </h1>

        <div className="hidden md:flex gap-6 text-sm">
          <a
            href="#projects"
            className={`transition-colors duration-300 ${activeSection === "projects"
              ? "text-cyan-400 font-semibold"
              : "text-white hover:text-cyan-300"
              }`}
          >
            Projects
          </a>

          <a
            href="#experience"
            className={`transition-colors duration-300 ${activeSection === "experience"
              ? "text-cyan-400 font-semibold"
              : "text-white hover:text-cyan-300"
              }`}
          >
            Experience
          </a>

          <a
            href="#skills"
            className={`transition-colors duration-300 ${activeSection === "skills"
              ? "text-cyan-400 font-semibold"
              : "text-white hover:text-cyan-300"
              }`}
          >
            Skills
          </a>

          <a
            href="#contact"
            className={`transition-colors duration-300 ${activeSection === "contact"
              ? "text-cyan-400 font-semibold"
              : "text-white hover:text-cyan-300"
              }`}
          >
            Contact
          </a>
        </div>

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
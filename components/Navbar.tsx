"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";

const waypoints = [
  { id: "projects", index: "01", label: "PROJECTS" },
  { id: "experience", index: "02", label: "EXPERIENCE" },
  { id: "skills", index: "03", label: "SKILLS" },
  { id: "contact", index: "04", label: "CONTACT" },
] as const;

type WaypointId = (typeof waypoints)[number]["id"];

const VISOR_CLIP_PATH = "polygon(0 0, 100% 0, 97% 100%, 3% 100%)";

const visorVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -18,
    scaleX: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleX: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delayChildren: 0.25,
      staggerChildren: 0.12,
    },
  },
};

const flankVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const reticleCorners = [
  {
    glyph: "┌",
    position: "left-0 top-0",
    idle: "-translate-x-1 -translate-y-1 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:translate-y-0.5",
    engaged: "translate-x-0.5 translate-y-0.5",
  },
  {
    glyph: "┐",
    position: "right-0 top-0",
    idle: "translate-x-1 -translate-y-1 group-hover:-translate-x-0.5 group-hover:translate-y-0.5 group-focus-visible:-translate-x-0.5 group-focus-visible:translate-y-0.5",
    engaged: "-translate-x-0.5 translate-y-0.5",
  },
  {
    glyph: "└",
    position: "bottom-0 left-0",
    idle: "-translate-x-1 translate-y-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5",
    engaged: "translate-x-0.5 -translate-y-0.5",
  },
  {
    glyph: "┘",
    position: "bottom-0 right-0",
    idle: "translate-x-1 translate-y-1 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:-translate-x-0.5 group-focus-visible:-translate-y-0.5",
    engaged: "-translate-x-0.5 -translate-y-0.5",
  },
] as const;

function formatElapsed(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

// Shared mission clock: one interval drives every MET readout, and readouts
// mounted later (e.g. the mobile menu) show the same elapsed time.
let missionStartedAt: number | null = null;
let missionElapsedSeconds = 0;
let missionClockInterval: number | undefined;
const missionClockListeners = new Set<() => void>();

function subscribeToMissionClock(listener: () => void) {
  if (missionStartedAt === null) {
    missionStartedAt = Date.now();
  }

  missionClockListeners.add(listener);

  if (missionClockInterval === undefined) {
    missionClockInterval = window.setInterval(() => {
      missionElapsedSeconds = Math.floor(
        (Date.now() - (missionStartedAt ?? Date.now())) / 1000
      );
      missionClockListeners.forEach((notify) => notify());
    }, 1000);
  }

  return () => {
    missionClockListeners.delete(listener);

    if (missionClockListeners.size === 0) {
      window.clearInterval(missionClockInterval);
      missionClockInterval = undefined;
    }
  };
}

const getMissionElapsed = () => missionElapsedSeconds;
const getServerMissionElapsed = () => 0;

// Isolated so the 1s tick only re-renders this readout, not the whole HUD.
function MissionElapsedTime() {
  const elapsed = useSyncExternalStore(
    subscribeToMissionClock,
    getMissionElapsed,
    getServerMissionElapsed
  );

  return (
    <span className="tabular-nums">
      T+ {formatElapsed(elapsed)}
    </span>
  );
}

function Reticle({ engaged }: { engaged: boolean }) {
  return (
    <>
      {reticleCorners.map((corner) => (
        <span
          key={corner.glyph}
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            text-[10px]
            leading-none
            transition-all
            duration-300
            ease-out
            ${corner.position}
            ${engaged
              ? `${corner.engaged} text-[#E0FFFF] opacity-100 [text-shadow:0_0_6px_rgba(0,255,255,0.85)]`
              : `${corner.idle} text-cyan-400/45 opacity-70 group-hover:text-[#E0FFFF] group-hover:opacity-100 group-hover:[text-shadow:0_0_6px_rgba(0,255,255,0.85)] group-focus-visible:text-[#E0FFFF] group-focus-visible:opacity-100`
            }
          `}
        >
          {corner.glyph}
        </span>
      ))}
    </>
  );
}

function SignalBars() {
  return (
    <span aria-hidden="true" className="flex h-2.5 items-end gap-[2px]">
      {[0.4, 0.6, 0.8, 1].map((height) => (
        <span
          key={height}
          className="w-[2px] bg-[#00FFFF] shadow-[0_0_4px_rgba(0,255,255,0.8)]"
          style={{ height: `${height * 100}%` }}
        />
      ))}
    </span>
  );
}

interface NavbarProps {
  isPoweredOn?: boolean;
}

export default function Navbar({ isPoweredOn = true }: NavbarProps) {
  const [activeSection, setActiveSection] =
    useState<WaypointId>("projects");

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  useEffect(() => {
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

      let currentSection: WaypointId = "projects";

      for (const waypoint of waypoints) {
        const element =
          document.getElementById(waypoint.id);

        if (!element) continue;

        const rect =
          element.getBoundingClientRect();

        // Probe line sits just below the visor HUD.
        if (
          rect.top <= 120 &&
          rect.bottom >= 120
        ) {
          currentSection = waypoint.id;
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
    <MotionConfig reducedMotion="user">
      <header className="pointer-events-none fixed left-0 top-0 z-50 w-full">
        <nav
          aria-label="Primary navigation"
          className="mx-auto w-full max-w-[1440px] font-mono"
        >
          <motion.div
            variants={visorVariants}
            initial="hidden"
            animate={isPoweredOn ? "visible" : "hidden"}
            style={{
              clipPath: VISOR_CLIP_PATH,
              WebkitClipPath: VISOR_CLIP_PATH,
            }}
            className="
              pointer-events-auto
              relative
              origin-top
              overflow-hidden
              border-t
              border-cyan-400/40
              bg-slate-950/45
              backdrop-blur-md
            "
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/5 to-transparent"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-60 bg-[repeating-linear-gradient(0deg,rgba(165,243,252,0.025)_0,rgba(165,243,252,0.025)_1px,transparent_1px,transparent_4px)]"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(0,255,255,0.7)_25%,rgba(224,255,255,0.95)_50%,rgba(167,139,250,0.5)_75%,transparent)]"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[3%] bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent"
            />

            {isPoweredOn && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-120%", opacity: 0 }}
                animate={{ x: "120%", opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.4, delay: 0.35, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-300/10 to-transparent"
              />
            )}

            <div
              className="
                relative
                flex
                h-14
                items-center
                justify-between
                gap-4
                px-[6%]
                sm:h-16
                md:px-[5%]
                lg:grid
                lg:h-[68px]
                lg:grid-cols-[1fr_auto_1fr]
                lg:gap-6
                lg:px-[4.5%]
              "
            >
              <motion.div
                variants={flankVariants}
                className="flex min-w-0 items-center gap-2.5 sm:gap-3"
              >
                <span
                  aria-hidden="true"
                  className="relative flex h-2 w-2 shrink-0"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                </span>

                <div className="min-w-0 leading-tight">
                  <p className="truncate text-[11px] font-semibold tracking-[0.2em] text-[#E0FFFF] [text-shadow:0_0_10px_rgba(0,255,255,0.45)] sm:text-xs">
                    <span aria-hidden="true">PASINDU K.</span>
                    <span className="sr-only">Pasindu Kavishka</span>
                  </p>

                  <p
                    aria-hidden="true"
                    className="mt-0.5 truncate text-[10px] tracking-[0.14em] text-cyan-200/55"
                  >
                    <span className="md:hidden xl:inline">EVA-01{" // "}</span>
                    SUIT:{" "}
                    <span className="text-emerald-300/85">NOMINAL</span>
                  </p>
                </div>
              </motion.div>

              <motion.ul
                variants={flankVariants}
                className="hidden items-center gap-2 md:flex xl:gap-3"
              >
                {waypoints.map((waypoint) => {
                  const isActive = activeSection === waypoint.id;

                  return (
                    <li key={waypoint.id}>
                      <a
                        href={`#${waypoint.id}`}
                        aria-current={isActive ? "location" : undefined}
                        className="
                          group
                          relative
                          block
                          whitespace-nowrap
                          px-2.5
                          py-2.5
                          text-[10px]
                          tracking-[0.08em]
                          outline-none
                          focus-visible:bg-cyan-400/[0.06]
                          xl:px-3
                          xl:tracking-[0.12em]
                        "
                      >
                        <Reticle engaged={isActive} />

                        <span
                          className={`relative z-10 transition-colors duration-300 ${isActive
                            ? "text-[#E0FFFF] [text-shadow:0_0_12px_rgba(0,255,255,0.65)]"
                            : "text-cyan-200/70 group-hover:text-[#E0FFFF] group-focus-visible:text-[#E0FFFF]"
                            }`}
                        >
                          [
                          <span
                            className={`transition-colors duration-300 ${isActive
                              ? "text-[#00FFFF]"
                              : "text-cyan-400/60 group-hover:text-[#00FFFF]"
                              }`}
                          >
                            {waypoint.index}
                          </span>
                          {" // "}
                          {waypoint.label}]
                        </span>

                        {isActive && (
                          <motion.span
                            layoutId="visor-target-lock"
                            aria-hidden="true"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                            className="pointer-events-none absolute inset-x-2 -bottom-1.5 flex justify-center"
                          >
                            <span className="absolute -bottom-1 h-4 w-full rounded-full bg-cyan-400/25 blur-md" />
                            <span className="relative h-px w-full bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent shadow-[0_0_8px_rgba(0,255,255,0.9)]" />
                            <span className="absolute -top-[3px] h-1 w-1 rotate-45 bg-[#00FFFF] shadow-[0_0_6px_rgba(0,255,255,0.9)]" />
                          </motion.span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </motion.ul>

              <motion.div
                variants={flankVariants}
                aria-hidden="true"
                className="hidden items-center justify-end gap-4 lg:flex"
              >
                <div className="text-right leading-tight">
                  <p className="text-[10px] tracking-[0.16em] text-cyan-200/55">
                    SYS.VER{" // "}
                    <span className="text-cyan-200">2.6.0</span>
                  </p>

                  <p className="mt-0.5 text-[11px] tracking-[0.12em] text-[#E0FFFF]">
                    <span className="text-cyan-200/60">MET:</span>{" "}
                    <MissionElapsedTime />
                  </p>
                </div>

                <div className="hidden items-center gap-2 border border-cyan-400/30 bg-cyan-400/[0.06] px-2 py-1 shadow-[0_0_12px_rgba(0,255,255,0.08)] min-[1360px]:flex">
                  <SignalBars />
                  <span className="whitespace-nowrap text-[10px] tracking-[0.14em] text-cyan-200">
                    COM-LINK:{" "}
                    <span className="text-emerald-300">ACTIVE</span>
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={flankVariants}
                className="flex items-center gap-3 md:hidden"
              >
                <p
                  aria-hidden="true"
                  className="hidden text-[10px] tracking-[0.12em] text-cyan-200/80 sm:block"
                >
                  MET: <MissionElapsedTime />
                </p>

                <button
                  type="button"
                  aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isMenuOpen}
                  aria-controls="mobile-navigation"
                  onClick={() =>
                    setIsMenuOpen(!isMenuOpen)
                  }
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    border
                    border-cyan-400/35
                    bg-cyan-400/[0.06]
                    text-cyan-200
                    transition-colors
                    duration-300
                    hover:border-[#00FFFF]/70
                    hover:text-[#E0FFFF]
                    focus-visible:outline
                    focus-visible:outline-1
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#00FFFF]
                  "
                >
                  {isMenuOpen ? (
                    <X size={18} />
                  ) : (
                    <Menu size={18} />
                  )}
                </button>
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                id="mobile-navigation"
                initial={{
                  opacity: 0,
                  y: -12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -12,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="
                  pointer-events-auto
                  relative
                  mx-[4%]
                  mt-1
                  border
                  border-cyan-400/25
                  bg-slate-950/85
                  backdrop-blur-md
                  md:hidden
                "
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-cyan-400/5 to-transparent"
                />

                <ul className="relative flex flex-col px-5 py-3">
                  {waypoints.map((waypoint) => {
                    const isActive = activeSection === waypoint.id;

                    return (
                      <li key={waypoint.id}>
                        <a
                          href={`#${waypoint.id}`}
                          aria-current={isActive ? "location" : undefined}
                          onClick={() => setIsMenuOpen(false)}
                          className={`
                            flex
                            items-center
                            gap-2
                            py-2.5
                            text-[11px]
                            tracking-[0.12em]
                            transition-colors
                            duration-300
                            ${isActive
                              ? "text-[#E0FFFF] [text-shadow:0_0_10px_rgba(0,255,255,0.6)]"
                              : "text-cyan-200/70 hover:text-[#E0FFFF]"
                            }
                          `}
                        >
                          <span
                            aria-hidden="true"
                            className={isActive ? "text-[#00FFFF]" : "text-cyan-400/40"}
                          >
                            {isActive ? "▸" : "·"}
                          </span>
                          [{waypoint.index}{" // "}{waypoint.label}]
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <div
                  aria-hidden="true"
                  className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-cyan-400/15 px-5 py-2 text-[10px] tracking-[0.12em] text-cyan-200/60"
                >
                  <span className="whitespace-nowrap">
                    MET: <MissionElapsedTime />
                  </span>
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <SignalBars />
                    COM-LINK: <span className="text-emerald-300">ACTIVE</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </MotionConfig>
  );
}

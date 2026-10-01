"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useVelocity,
} from "framer-motion";

import {
  JourneyPhase,
  journeyPhases,
} from "./journeyConfig";

export type JourneyDirection = "backward" | "forward" | "idle";

export interface JourneyState {
  progress: MotionValue<number>;
  targetProgress: MotionValue<number>;
  velocity: MotionValue<number>;
  direction: JourneyDirection;
  currentPhase: JourneyPhase;
  phaseProgress: MotionValue<number>;
}

interface JourneyControllerProps {
  children: ReactNode;
  isLoading?: boolean;
}

const loadingPhase = journeyPhases[0];
const scrollPhases = journeyPhases.slice(1);

const JourneyContext = createContext<JourneyState | null>(null);

interface JourneyProgressStop {
  scrollY: number;
  progress: number;
}

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value));
}

function getPhase(progress: number): JourneyPhase {
  return (
    scrollPhases.find((phase) => progress < phase.end) ??
    scrollPhases[scrollPhases.length - 1]
  );
}

function getPhaseProgress(progress: number, phase: JourneyPhase) {
  const duration = phase.end - phase.start;

  if (duration <= 0) {
    return 0;
  }

  return clampProgress((progress - phase.start) / duration);
}

export default function JourneyController({
  children,
  isLoading = false,
}: JourneyControllerProps) {
  const targetProgress = useMotionValue(0);
  const progress = useSpring(targetProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.0001,
    restSpeed: 0.001,
  });
  const velocity = useVelocity(progress);
  const phaseProgress = useMotionValue(0);

  const initialPhase = scrollPhases[0];
  const [currentScrollPhase, setCurrentScrollPhase] =
    useState<JourneyPhase>(initialPhase);
  const [direction, setDirection] =
    useState<JourneyDirection>("idle");

  const phaseIdRef = useRef(currentScrollPhase.id);
  const directionRef = useRef<JourneyDirection>("idle");
  const progressStopsRef = useRef<JourneyProgressStop[]>([
    { scrollY: 0, progress: 0 },
    { scrollY: 1, progress: 1 },
  ]);

  useEffect(() => {
    const updateTargetProgress = () => {
      const nextProgress = getJourneyProgress(
        window.scrollY,
        progressStopsRef.current
      );

      targetProgress.set(nextProgress);
    };

    const refreshProgressStops = () => {
      const scrollableDistance = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const stops: JourneyProgressStop[] = [{ scrollY: 0, progress: 0 }];
      const visitedSections = new Set<string>();

      scrollPhases.forEach((phase) => {
        if (
          !("sectionId" in phase) ||
          phase.start === 0 ||
          visitedSections.has(phase.sectionId)
        ) {
          return;
        }

        const section = document.getElementById(phase.sectionId);

        if (!section) return;

        visitedSections.add(phase.sectionId);
        const sectionScrollY =
          phase.id === "complete"
            ? scrollableDistance - window.innerHeight * 0.35
            : section.getBoundingClientRect().top +
              window.scrollY -
              window.innerHeight * 0.15;

        stops.push({
          scrollY: Math.min(
            scrollableDistance,
            Math.max(0, sectionScrollY)
          ),
          progress: phase.start,
        });
      });

      stops.push({ scrollY: scrollableDistance, progress: 1 });
      progressStopsRef.current = stops.sort((a, b) => a.scrollY - b.scrollY);
      updateTargetProgress();
    };

    const frameId = window.requestAnimationFrame(refreshProgressStops);
    const resizeObserver = new ResizeObserver(refreshProgressStops);

    resizeObserver.observe(document.documentElement);

    window.addEventListener("scroll", updateTargetProgress, {
      passive: true,
    });
    window.addEventListener("resize", refreshProgressStops);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateTargetProgress);
      window.removeEventListener("resize", refreshProgressStops);
    };
  }, [targetProgress]);

  useMotionValueEvent(progress, "change", (latest) => {
    const clampedProgress = clampProgress(latest);
    const nextPhase = getPhase(clampedProgress);

    phaseProgress.set(getPhaseProgress(clampedProgress, nextPhase));

    if (phaseIdRef.current !== nextPhase.id) {
      phaseIdRef.current = nextPhase.id;
      setCurrentScrollPhase(nextPhase);
    }
  });

  useMotionValueEvent(velocity, "change", (latest) => {
    const nextDirection: JourneyDirection =
      Math.abs(latest) < 0.001
        ? "idle"
        : latest > 0
          ? "forward"
          : "backward";

    if (directionRef.current !== nextDirection) {
      directionRef.current = nextDirection;
      setDirection(nextDirection);
    }
  });

  const currentPhase = isLoading ? loadingPhase : currentScrollPhase;

  return (
    <JourneyContext.Provider
      value={{
        progress,
        targetProgress,
        velocity,
        direction,
        currentPhase,
        phaseProgress,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const journey = useContext(JourneyContext);

  if (!journey) {
    throw new Error("useJourney must be used within JourneyController");
  }

  return journey;
}

function getJourneyProgress(
  scrollY: number,
  stops: readonly JourneyProgressStop[]
) {
  const endIndex = stops.findIndex((stop) => stop.scrollY >= scrollY);
  const resolvedEndIndex = endIndex === -1 ? stops.length - 1 : endIndex;
  const start = stops[Math.max(0, resolvedEndIndex - 1)];
  const end = stops[resolvedEndIndex];
  const distance = end.scrollY - start.scrollY;

  if (distance <= 0) return end.progress;

  const amount = clampProgress((scrollY - start.scrollY) / distance);

  return start.progress + (end.progress - start.progress) * amount;
}
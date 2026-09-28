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

  useEffect(() => {
    const updateTargetProgress = () => {
      const scrollableDistance = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const nextProgress =
        scrollableDistance > 0
          ? clampProgress(window.scrollY / scrollableDistance)
          : 0;

      targetProgress.set(nextProgress);
    };

    updateTargetProgress();

    window.addEventListener("scroll", updateTargetProgress, {
      passive: true,
    });
    window.addEventListener("resize", updateTargetProgress);

    return () => {
      window.removeEventListener("scroll", updateTargetProgress);
      window.removeEventListener("resize", updateTargetProgress);
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
"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TypewriterText from "@/components/UI/TypewriterText";
import { useJourney } from "./JourneyController";
import {
  type StoryBeat,
  speakerLabels,
  storyBeats,
} from "./storyScript";

/** How long the last boot line stays up before fading. */
const BOOT_HOLD_MS = 4500;
/** Journey progress at which the opening (boot) dialogue is cut off for good. */
const BOOT_END_PROGRESS = 0.045;
const BAR_DELAYS = [0, 0.18, 0.36, 0.09, 0.27];

type BootBeat = StoryBeat & { trigger: { type: "boot"; delay: number } };
type ScrollBeat = StoryBeat & {
  trigger: { type: "scroll"; from: number; to: number };
};

const isBootBeat = (beat: StoryBeat): beat is BootBeat =>
  beat.trigger.type === "boot";
const isScrollBeat = (beat: StoryBeat): beat is ScrollBeat =>
  beat.trigger.type === "scroll";

function VoiceBars({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className="flex h-3 shrink-0 items-end gap-[2px]">
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          data-active={active}
          className="radio-bar h-full w-[2px] bg-caution/80"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  );
}

interface RadioTranscriptProps {
  beats?: readonly StoryBeat[];
}

/**
 * Film-subtitle style radio lines. Boot beats play in sequence once the
 * journey leaves the loading screen; scroll beats show while journey progress
 * is inside their range. Text is real text in an aria-live region.
 */
export default function RadioTranscript({
  beats = storyBeats,
}: RadioTranscriptProps) {
  const { currentPhase, progress } = useJourney();
  const reduceMotion = useReducedMotion();
  const isReady = currentPhase.id !== "loading";
  const bootBeats = useMemo(() => beats.filter(isBootBeat), [beats]);
  const scrollBeats = useMemo(() => beats.filter(isScrollBeat), [beats]);
  const findScrollBeatId = useCallback(
    (value: number) =>
      scrollBeats.find(
        (beat) => value >= beat.trigger.from && value < beat.trigger.to
      )?.id ?? null,
    [scrollBeats]
  );

  // -1 waiting for power-on, bootBeats.length once the boot sequence is over.
  const [bootIndex, setBootIndex] = useState(-1);
  const [scrollBeatId, setScrollBeatId] = useState(() =>
    findScrollBeatId(progress.get())
  );
  const [typedId, setTypedId] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  // Boot dialogue belongs to the opening shot; once the visitor scrolls on, it
  // is over for good (a late timer must not revive it further down the page).
  const bootEnded = useRef(false);

  useEffect(() => {
    const pending = timers.current;

    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  useEffect(() => {
    if (!isReady || bootBeats.length === 0) return;

    const timer = window.setTimeout(
      () => {
        if (!bootEnded.current) setBootIndex(0);
      },
      bootBeats[0].trigger.delay * 1000
    );

    return () => window.clearTimeout(timer);
  }, [isReady, bootBeats]);

  useMotionValueEvent(progress, "change", (value) => {
    const id = findScrollBeatId(value);

    setScrollBeatId((previous) => (previous === id ? previous : id));

    if (!bootEnded.current && value >= BOOT_END_PROGRESS) {
      bootEnded.current = true;
      setBootIndex(bootBeats.length);
    }
  });

  const handleTyped = (beat: StoryBeat, index: number) => {
    setTypedId(beat.id);

    if (index < 0) return;

    const next = bootBeats[index + 1];
    const wait = next ? next.trigger.delay * 1000 : BOOT_HOLD_MS;

    timers.current.push(
      window.setTimeout(() => {
        if (!bootEnded.current) setBootIndex(index + 1);
      }, wait)
    );
  };

  const scrollBeat = scrollBeats.find((beat) => beat.id === scrollBeatId);
  const bootBeat =
    bootIndex >= 0 && bootIndex < bootBeats.length
      ? bootBeats[bootIndex]
      : undefined;
  const activeBeat: StoryBeat | undefined = scrollBeat ?? bootBeat;
  const activeBootIndex = activeBeat && activeBeat === bootBeat ? bootIndex : -1;
  const isTyping = activeBeat !== undefined && typedId !== activeBeat.id;

  const isOrbitIntro = currentPhase.id === "space" || activeBeat === bootBeat;

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 z-[44] flex ${
        isOrbitIntro
          ? "top-[88px] justify-center px-6 md:top-auto md:bottom-9"
          : "bottom-6 justify-start pl-6 pr-[76px] sm:bottom-8 sm:justify-center sm:px-20 md:bottom-9"
      }`}
    >
      <AnimatePresence mode="wait">
        {activeBeat && (
          <motion.p
            key={activeBeat.id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            className="flex max-w-xl items-baseline gap-3 font-radio text-[15px] leading-snug text-suit [text-shadow:0_1px_14px_rgba(0,0,0,0.9)] sm:text-base"
          >
            <span
              className={`font-hud text-[10px] font-medium uppercase tracking-[0.24em] ${activeBeat.speaker === "PK" ? "text-caution" : "text-suit/60"
                }`}
            >
              {speakerLabels[activeBeat.speaker]}
            </span>

            <TypewriterText
              text={activeBeat.line}
              speed={32}
              restartKey={activeBeat.id}
              cursorClassName="text-caution"
              showCursor={isTyping}
              onComplete={() => handleTyped(activeBeat, activeBootIndex)}
            />

            <VoiceBars active={isTyping} />
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

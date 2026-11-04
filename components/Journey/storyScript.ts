export type StorySpeaker = "PK" | "CONTROL";

export type StoryTrigger =
  /** Plays in order after the visor powers on. `delay` is seconds after the previous beat ends. */
  | { type: "boot"; delay: number }
  /** Shown while journey progress (0–1) is inside [from, to). */
  | { type: "scroll"; from: number; to: number };

export interface StoryBeat {
  id: string;
  /** Act number from docs/DESIGN_PLAN.md §2. */
  act: number;
  speaker: StorySpeaker;
  line: string;
  trigger: StoryTrigger;
}

export const speakerLabels: Record<StorySpeaker, string> = {
  PK: "PK",
  CONTROL: "CONTROL",
};

/**
 * Narration for the EVA journey, in one place.
 *
 * Rules (docs/DESIGN_PLAN.md §3):
 * - Every factual statement must come from data/*.ts, never invented here.
 * - Acts are added in the phase that builds their scene; do not pre-fill
 *   acts that have no scene yet.
 */
export const storyBeats: readonly StoryBeat[] = [
  {
    id: "boot-control-check",
    act: 0,
    speaker: "CONTROL",
    line: "Suit check, Pasindu. Report.",
    trigger: { type: "boot", delay: 0.9 },
  },
  {
    id: "boot-pk-report",
    act: 0,
    speaker: "PK",
    line: "Power on. O2 nominal. Comms clear.",
    trigger: { type: "boot", delay: 0.7 },
  },
  {
    id: "orbit-pk-intro",
    act: 1,
    speaker: "PK",
    line: "This is Pasindu Kavishka. Software engineer.",
    trigger: { type: "boot", delay: 1.3 },
  },
  {
    id: "orbit-pk-focus",
    act: 1,
    speaker: "PK",
    line: "I build scalable web, mobile, cloud and AI-powered solutions.",
    trigger: { type: "boot", delay: 1.1 },
  },
  {
    id: "orbit-control-hatch",
    act: 1,
    speaker: "CONTROL",
    line: "Copy. Hatch is yours.",
    trigger: { type: "boot", delay: 1.2 },
  },

  // Act 2 — Spacewalk. The manifest figures are the ones in missionStats.ts.
  {
    id: "walk-control-manifest",
    act: 2,
    speaker: "CONTROL",
    line: "Give me your manifest on the way down.",
    trigger: { type: "scroll", from: 0.055, to: 0.085 },
  },
  {
    id: "walk-pk-manifest",
    act: 2,
    speaker: "PK",
    line: "Six hundred plus internship hours. Four major projects. Twenty-plus technologies. One research project.",
    trigger: { type: "scroll", from: 0.085, to: 0.115 },
  },
  {
    id: "walk-control-fullload",
    act: 2,
    speaker: "CONTROL",
    line: "Full load. Where are you headed?",
    trigger: { type: "scroll", from: 0.115, to: 0.135 },
  },
  {
    id: "walk-pk-outpost",
    act: 2,
    speaker: "PK",
    line: "The outpost. Everything I've built is down there.",
    trigger: { type: "scroll", from: 0.135, to: 0.165 },
  },
];

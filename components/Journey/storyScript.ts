import { aboutBio } from "@/data/aboutData";

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
    line: "Full load. Who's wearing it?",
    trigger: { type: "scroll", from: 0.115, to: 0.122 },
  },
  {
    id: "walk-pk-bio-1",
    act: 2,
    speaker: "PK",
    line: aboutBio.lines[0],
    trigger: { type: "scroll", from: 0.122, to: 0.138 },
  },
  {
    id: "walk-pk-bio-2",
    act: 2,
    speaker: "PK",
    line: aboutBio.lines[1],
    trigger: { type: "scroll", from: 0.138, to: 0.15 },
  },
  {
    id: "walk-control-headed",
    act: 2,
    speaker: "CONTROL",
    line: "Where are you headed?",
    trigger: { type: "scroll", from: 0.15, to: 0.158 },
  },
  {
    id: "walk-pk-outpost",
    act: 2,
    speaker: "PK",
    line: "The outpost. Everything I've built is down there.",
    trigger: { type: "scroll", from: 0.158, to: 0.166 },
  },

  // Act 3 — Descent. Silence follows touchdown, on purpose.
  {
    id: "descent-control-entry",
    act: 3,
    speaker: "CONTROL",
    line: "Entry interface in three… two… one.",
    trigger: { type: "scroll", from: 0.166, to: 0.192 },
  },
  {
    id: "descent-pk-holding",
    act: 3,
    speaker: "PK",
    line: "Holding steady.",
    trigger: { type: "scroll", from: 0.192, to: 0.224 },
  },

  // Act 4 — Landfall & Outpost Overview.
  {
    id: "landfall-pk-boots",
    act: 4,
    speaker: "PK",
    line: "Boots on the surface. Outpost in sight.",
    trigger: { type: "scroll", from: 0.258, to: 0.288 },
  },
  {
    id: "landfall-control-sitemap",
    act: 4,
    speaker: "CONTROL",
    line: "Nine structures on your visor. Walk the line when ready.",
    trigger: { type: "scroll", from: 0.288, to: 0.318 },
  },

  // Acts 5–8 — Project structures. One pattern, four times: CONTROL asks,
  // PK answers with the project description from data/portfolioData.ts.
  {
    id: "hb-control-ask",
    act: 5,
    speaker: "CONTROL",
    line: "What's in the Med-Lab?",
    trigger: { type: "scroll", from: 0.322, to: 0.345 },
  },
  {
    id: "hb-pk-answer",
    act: 5,
    speaker: "PK",
    line: "HealthBridge. An ML-based kidney donor matching platform. It reads medical reports with OCR, extracts HLA data and predicts compatibility.",
    trigger: { type: "scroll", from: 0.345, to: 0.4 },
  },
  {
    id: "ezy-control-ask",
    act: 6,
    speaker: "CONTROL",
    line: "Next structure. The depot?",
    trigger: { type: "scroll", from: 0.402, to: 0.425 },
  },
  {
    id: "ezy-pk-answer",
    act: 6,
    speaker: "PK",
    line: "Ezy Map. Backend for a ride hailing, delivery and marketplace platform, built during my internship: authentication, drivers, rides, sellers and the database, on NestJS and PostgreSQL.",
    trigger: { type: "scroll", from: 0.425, to: 0.47 },
  },
  {
    id: "kv-control-ask",
    act: 7,
    speaker: "CONTROL",
    line: "What's stored in the hangar?",
    trigger: { type: "scroll", from: 0.472, to: 0.495 },
  },
  {
    id: "kv-pk-answer",
    act: 7,
    speaker: "PK",
    line: "KV Audio. A full-stack MERN app for audio equipment rentals, with booking management, inventory tracking and an admin dashboard.",
    trigger: { type: "scroll", from: 0.495, to: 0.54 },
  },
  {
    id: "sb-control-ask",
    act: 8,
    speaker: "CONTROL",
    line: "And the greenhouse?",
    trigger: { type: "scroll", from: 0.542, to: 0.565 },
  },
  {
    id: "sb-pk-answer",
    act: 8,
    speaker: "PK",
    line: "StoryBloom. A Flutter storytelling app prototype with a modern, responsive interface.",
    trigger: { type: "scroll", from: 0.565, to: 0.61 },
  },
];

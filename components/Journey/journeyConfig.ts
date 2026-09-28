export const journeyPhaseIds = [
  "loading",
  "space",
  "planet-approach",
  "planet-surface",
  "city",
  "healthbridge",
  "ezy-map",
  "kv-audio",
  "story-bloom",
  "experience",
  "data",
  "creative",
  "future",
  "contact",
  "complete",
] as const;

export type JourneyPhaseId = (typeof journeyPhaseIds)[number];

export type JourneySectionId =
  | "home"
  | "projects"
  | "experience"
  | "skills"
  | "contact";

export type JourneyLandmarkId =
  | "healthbridge"
  | "ezymap"
  | "kvaudio"
  | "storybloom"
  | "experience-tower"
  | "data-center"
  | "creative-studio"
  | "future-lab"
  | "contact-center";

export interface JourneyPhase {
  readonly id: JourneyPhaseId;
  readonly label: string;
  readonly start: number;
  readonly end: number;
  readonly sectionId?: JourneySectionId;
  readonly landmarkId?: JourneyLandmarkId;
}

export const journeyPhases = [
  { id: "loading", label: "Loading", start: 0, end: 0 },
  {
    id: "space",
    label: "Outer Space",
    start: 0,
    end: 0.08,
    sectionId: "home",
  },
  {
    id: "planet-approach",
    label: "Planet Approach",
    start: 0.08,
    end: 0.16,
  },
  {
    id: "planet-surface",
    label: "Planet Surface",
    start: 0.16,
    end: 0.24,
  },
  {
    id: "city",
    label: "Digital City",
    start: 0.24,
    end: 0.32,
    sectionId: "projects",
  },
  {
    id: "healthbridge",
    label: "HealthBridge District",
    start: 0.32,
    end: 0.4,
    sectionId: "projects",
    landmarkId: "healthbridge",
  },
  {
    id: "ezy-map",
    label: "Ezy Map District",
    start: 0.4,
    end: 0.47,
    sectionId: "projects",
    landmarkId: "ezymap",
  },
  {
    id: "kv-audio",
    label: "KV Audio District",
    start: 0.47,
    end: 0.54,
    sectionId: "projects",
    landmarkId: "kvaudio",
  },
  {
    id: "story-bloom",
    label: "Story Bloom District",
    start: 0.54,
    end: 0.61,
    sectionId: "projects",
    landmarkId: "storybloom",
  },
  {
    id: "experience",
    label: "Experience Tower",
    start: 0.61,
    end: 0.69,
    sectionId: "experience",
    landmarkId: "experience-tower",
  },
  {
    id: "data",
    label: "Data Center",
    start: 0.69,
    end: 0.77,
    sectionId: "skills",
    landmarkId: "data-center",
  },
  {
    id: "creative",
    label: "Creative Studio",
    start: 0.77,
    end: 0.85,
    landmarkId: "creative-studio",
  },
  {
    id: "future",
    label: "Future Lab",
    start: 0.85,
    end: 0.92,
    landmarkId: "future-lab",
  },
  {
    id: "contact",
    label: "Contact Center",
    start: 0.92,
    end: 0.98,
    sectionId: "contact",
    landmarkId: "contact-center",
  },
  {
    id: "complete",
    label: "Journey Complete",
    start: 0.98,
    end: 1,
  },
] as const satisfies readonly JourneyPhase[];
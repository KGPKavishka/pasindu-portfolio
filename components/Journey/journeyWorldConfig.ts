export type JourneyWorldPoint = readonly [number, number, number];

/** Direction toward the sun for the planet-approach shot (unit vector is derived at use). */
export const journeySunDirection: JourneyWorldPoint = [0.8, 0.4, -0.45];

export const journeyWorld = {
  groundY: -3,
  planet: [1, -0.2, -28],
  planetRadius: 4.8,
  landing: [0, -3, -52],
  cityEntrance: [0, -2.6, -102],
  cityCore: [0, -2.6, -112],
  healthbridge: [-7, -2.6, -128],
  ezymap: [7, -2.6, -148],
  kvaudio: [-8, -2.6, -168],
  storybloom: [7, -2.6, -188],
  experience: [0, -2.6, -210],
  data: [-7, -2.6, -232],
  creative: [-7, -2.6, -252],
  future: [7, -2.6, -274],
  contact: [0, -2.6, -296],
  complete: [0, 2.5, -320],
} as const satisfies Record<string, number | JourneyWorldPoint>;

export interface OutpostStructureSpec {
  readonly id: string;
  readonly act: number;
  readonly code: string;
  readonly name: string;
  readonly structure: string;
  readonly summary: string;
  readonly position: JourneyWorldPoint;
  readonly targetProgress: number;
}

/**
 * Authoritative registry of the 9 outpost structures ahead on the surface.
 * Used by the Visor Site Map (Act 4) and the Heading Tape & Waypoint Marker.
 */
export const outpostStructures: readonly OutpostStructureSpec[] = [
  {
    id: "healthbridge",
    act: 5,
    code: "MOD-01",
    name: "HealthBridge",
    structure: "Med-Lab Module",
    summary: "ML-Based Kidney Donor Matching Platform",
    position: journeyWorld.healthbridge,
    targetProgress: 0.36,
  },
  {
    id: "ezymap",
    act: 6,
    code: "DEP-02",
    name: "Ezy Map",
    structure: "Logistics Depot",
    summary: "Multi-Service Taxi, Delivery and Marketplace Platform",
    position: journeyWorld.ezymap,
    targetProgress: 0.435,
  },
  {
    id: "kvaudio",
    act: 7,
    code: "HGR-03",
    name: "KV Audio",
    structure: "Equipment Hangar",
    summary: "Audio Equipment Rental Management Platform",
    position: journeyWorld.kvaudio,
    targetProgress: 0.505,
  },
  {
    id: "storybloom",
    act: 8,
    code: "BIO-04",
    name: "StoryBloom",
    structure: "Greenhouse Pod",
    summary: "Flutter Storytelling Application",
    position: journeyWorld.storybloom,
    targetProgress: 0.575,
  },
  {
    id: "experience",
    act: 9,
    code: "HAB-05",
    name: "Pure Heart Family",
    structure: "Crew Habitat",
    summary: "Backend Developer Intern · Feb 2026 - May 2026",
    position: journeyWorld.experience,
    targetProgress: 0.65,
  },
  {
    id: "data",
    act: 10,
    code: "PWR-06",
    name: "Power Grid",
    structure: "Solar Array Field",
    summary: "5 Engineering Systems · Frontend, Backend, DB, Cloud, AI",
    position: journeyWorld.data,
    targetProgress: 0.73,
  },
  {
    id: "creative",
    act: 11,
    code: "QTR-07",
    name: "Off-Shift Quarters",
    structure: "Habitat Interior",
    summary: "Art, UI Design, Logos & Research Poster",
    position: journeyWorld.creative,
    targetProgress: 0.81,
  },
  {
    id: "future",
    act: 12,
    code: "OBS-08",
    name: "Ridge Observatory",
    structure: "Deep-Sky Array",
    summary: "8 Active Learning Targets · Signal Lock Telemetry",
    position: journeyWorld.future,
    targetProgress: 0.885,
  },
  {
    id: "contact",
    act: 13,
    code: "COM-09",
    name: "Comms Mast",
    structure: "Long-Range Uplink",
    summary: "Direct Channel · Email, Phone, GitHub, LinkedIn, CV",
    position: journeyWorld.contact,
    targetProgress: 0.955,
  },
] as const;

export const journeyTransitPoints = [
  journeyWorld.landing,
  [0, journeyWorld.groundY, -76],
  journeyWorld.cityEntrance,
  journeyWorld.cityCore,
  [0, journeyWorld.groundY, -128],
  [0, journeyWorld.groundY, -148],
  [0, journeyWorld.groundY, -168],
  [0, journeyWorld.groundY, -188],
  [0, journeyWorld.groundY, -210],
  [0, journeyWorld.groundY, -232],
  [0, journeyWorld.groundY, -252],
  [0, journeyWorld.groundY, -274],
  [0, journeyWorld.groundY, -296],
  [0, journeyWorld.groundY, -320],
] as const satisfies readonly JourneyWorldPoint[];

export const journeyLandmarkBranches = [
  { id: "healthbridge", point: journeyWorld.healthbridge },
  { id: "ezymap", point: journeyWorld.ezymap },
  { id: "kvaudio", point: journeyWorld.kvaudio },
  { id: "storybloom", point: journeyWorld.storybloom },
  { id: "data", point: journeyWorld.data },
  { id: "creative", point: journeyWorld.creative },
  { id: "future", point: journeyWorld.future },
] as const;
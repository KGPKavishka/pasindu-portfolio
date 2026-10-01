export type JourneyWorldPoint = readonly [number, number, number];

export const journeyWorld = {
  groundY: -3,
  planet: [1, -0.2, -28],
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
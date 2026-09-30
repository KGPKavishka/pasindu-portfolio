import { journeyWorld } from "./journeyWorldConfig";

export type JourneyVector = readonly [number, number, number];
export type JourneyCameraMoment = "travel" | "approach" | "focus" | "departure";

export interface JourneyCameraKeyframe {
  readonly progress: number;
  readonly position: JourneyVector;
  readonly target: JourneyVector;
  readonly moment: JourneyCameraMoment;
}

const target = (
  point: JourneyVector,
  yOffset = 3.2
): JourneyVector => [point[0], point[1] + yOffset, point[2]];

export const journeyCameraKeyframes = [
  { progress: 0, position: [0, 0.2, 12], target: [0, 0, -24], moment: "travel" },
  { progress: 0.055, position: [0.25, 0.35, 8], target: target(journeyWorld.planet, 0.2), moment: "approach" },
  { progress: 0.1, position: [0.8, 0.45, 1], target: target(journeyWorld.planet, 0.15), moment: "focus" },
  { progress: 0.16, position: [1.2, 0.2, -16], target: target(journeyWorld.planet, 0.1), moment: "departure" },
  { progress: 0.19, position: [5.5, 0.9, -29], target: [1, -1, -39], moment: "approach" },
  { progress: 0.22, position: [2.8, 2.8, -46], target: [0, -2.2, -70], moment: "focus" },
  { progress: 0.245, position: [0.8, 3.2, -62], target: [0, -1.2, -88], moment: "departure" },
  { progress: 0.275, position: [0, 3.8, -78], target: target(journeyWorld.cityEntrance, 3.2), moment: "approach" },
  { progress: 0.3, position: [0, 4, -90], target: target(journeyWorld.cityCore, 3.6), moment: "focus" },
  { progress: 0.32, position: [0, 3.5, -105], target: [0, 0.4, -124], moment: "departure" },
  { progress: 0.335, position: [-0.4, 3.35, -111], target: [-4, 0.4, -126], moment: "approach" },
  { progress: 0.36, position: [-1.5, 3.2, -117], target: target(journeyWorld.healthbridge), moment: "focus" },
  { progress: 0.39, position: [-0.7, 3.2, -126], target: [0, 0.4, -143], moment: "departure" },
  { progress: 0.41, position: [0.5, 3.25, -132], target: [4.5, 0.3, -147], moment: "approach" },
  { progress: 0.435, position: [2, 3.1, -138], target: target(journeyWorld.ezymap), moment: "focus" },
  { progress: 0.46, position: [0.8, 3.2, -146], target: [0, 0.4, -162], moment: "departure" },
  { progress: 0.48, position: [-0.5, 3.25, -152], target: [-5, 0.3, -167], moment: "approach" },
  { progress: 0.505, position: [-2, 3.2, -158], target: target(journeyWorld.kvaudio), moment: "focus" },
  { progress: 0.53, position: [-0.8, 3.2, -166], target: [0, 0.4, -182], moment: "departure" },
  { progress: 0.55, position: [0.5, 3.2, -172], target: [4.5, 0.3, -187], moment: "approach" },
  { progress: 0.575, position: [2, 3.1, -178], target: target(journeyWorld.storybloom), moment: "focus" },
  { progress: 0.605, position: [0.7, 3.3, -187], target: [0, 0.5, -203], moment: "departure" },
  { progress: 0.625, position: [0.3, 3.7, -193], target: [0, 0.8, -208], moment: "approach" },
  { progress: 0.65, position: [1.5, 4.2, -199], target: target(journeyWorld.experience, 6.6), moment: "focus" },
  { progress: 0.68, position: [0.5, 3.7, -208], target: [0, 0.5, -225], moment: "departure" },
  { progress: 0.705, position: [-0.3, 3.4, -215], target: [-4.5, 0.3, -231], moment: "approach" },
  { progress: 0.73, position: [-1, 3.4, -221], target: target(journeyWorld.data), moment: "focus" },
  { progress: 0.76, position: [-0.5, 3.4, -230], target: [0, 0.4, -246], moment: "departure" },
  { progress: 0.785, position: [-0.7, 3.6, -236], target: [-4.5, 0.3, -251], moment: "approach" },
  { progress: 0.81, position: [-1.5, 3.8, -242], target: target(journeyWorld.creative), moment: "focus" },
  { progress: 0.84, position: [-0.6, 3.5, -251], target: [0, 0.4, -268], moment: "departure" },
  { progress: 0.86, position: [0.5, 3.6, -257], target: [4.5, 0.4, -273], moment: "approach" },
  { progress: 0.885, position: [1.5, 3.8, -264], target: target(journeyWorld.future), moment: "focus" },
  { progress: 0.915, position: [0.6, 3.5, -273], target: [0, 0.4, -290], moment: "departure" },
  { progress: 0.935, position: [0.2, 3.5, -279], target: [0, 0.4, -294], moment: "approach" },
  { progress: 0.955, position: [0, 3.6, -286], target: target(journeyWorld.contact), moment: "focus" },
  { progress: 0.98, position: [0, 3.2, -298], target: [0, 0.5, -316], moment: "departure" },
  { progress: 1, position: [0, 2.8, -309], target: journeyWorld.complete, moment: "focus" },
] as const satisfies readonly JourneyCameraKeyframe[];
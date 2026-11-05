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
  yOffset = 2.6
): JourneyVector => [point[0], point[1] + yOffset, point[2]];

/** Eye level on the surface plain (GROUND_Y = -3, EYE_HEIGHT = 1.7). */
export const SURFACE_EYE_Y = -1.3;

/**
 * Camera pose of the opening shot (orbit, hatch open). The orbit scene is laid
 * out relative to this pose, and the spacewalk path starts from it.
 */
export const openingCameraPose = {
  position: [0, 0.2, 12],
  target: [-6, 1.2, -32],
} as const satisfies { position: JourneyVector; target: JourneyVector };

/** Progress at which the spacewalk hands over to the first static keyframe below. */
export const spacewalkEndProgress = 0.14;

/**
 * Keyframes from the end of the spacewalk onward. The orbit/spacewalk part of
 * the path (progress 0 – spacewalkEndProgress) follows the station truss, which
 * is placed per screen shape, so it is built at runtime from the orbit layout
 * (see createSpacewalkKeyframes) and prepended by JourneyCameraRig.
 */
export const journeyCameraKeyframes = [
  { progress: 0.14, position: [-2.2, 3.6, -3], target: target(journeyWorld.planet, 0.2), moment: "approach" },
  // Descent: dive toward the planet, cross its surface under the entry plasma
  // (the planet is hidden from there on), then arrive at eye height on the
  // landing plain, which rises up to meet the camera (see LandingWorld).
  { progress: 0.165, position: [0.2, 1.6, -11.5], target: [1, 0, -28], moment: "approach" },
  { progress: 0.19, position: [0.6, 0.5, -19.5], target: [1, -0.2, -28], moment: "focus" },
  { progress: 0.205, position: [0.92, -0.1, -24.6], target: [1, -0.6, -40], moment: "departure" },
  { progress: 0.25, position: [0.95, SURFACE_EYE_Y, -24.6], target: [1, -1.1, -45], moment: "focus" },
  { progress: 0.28, position: [0.95, SURFACE_EYE_Y, -24.6], target: [0.6, -1.0, -56], moment: "focus" },
  // Surface walk: step out of the lander, cross the plain and turn the head
  // toward each outpost structure in turn.
  { progress: 0.3, position: [0.4, SURFACE_EYE_Y, -68], target: [0, -0.8, -118], moment: "focus" },
  { progress: 0.32, position: [0, SURFACE_EYE_Y, -98], target: [-2.5, -0.8, -124], moment: "departure" },
  { progress: 0.335, position: [-0.4, SURFACE_EYE_Y, -111], target: [-4.5, -0.6, -126], moment: "approach" },
  { progress: 0.36, position: [-1.5, SURFACE_EYE_Y, -117], target: target(journeyWorld.healthbridge, 2.2), moment: "focus" },
  { progress: 0.39, position: [-0.7, SURFACE_EYE_Y, -126], target: [0.5, -0.9, -143], moment: "departure" },
  { progress: 0.41, position: [0.5, SURFACE_EYE_Y, -132], target: [4.5, -0.7, -147], moment: "approach" },
  { progress: 0.435, position: [2, SURFACE_EYE_Y, -138], target: target(journeyWorld.ezymap, 2.0), moment: "focus" },
  { progress: 0.46, position: [0.8, SURFACE_EYE_Y, -146], target: [-0.5, -0.9, -162], moment: "departure" },
  { progress: 0.48, position: [-0.5, SURFACE_EYE_Y, -152], target: [-5, -0.7, -167], moment: "approach" },
  { progress: 0.505, position: [-2, SURFACE_EYE_Y, -158], target: target(journeyWorld.kvaudio, 2.0), moment: "focus" },
  { progress: 0.53, position: [-0.8, SURFACE_EYE_Y, -166], target: [0.5, -0.9, -182], moment: "departure" },
  { progress: 0.55, position: [0.5, SURFACE_EYE_Y, -172], target: [4.5, -0.7, -187], moment: "approach" },
  { progress: 0.575, position: [2, SURFACE_EYE_Y, -178], target: target(journeyWorld.storybloom, 1.9), moment: "focus" },
  { progress: 0.605, position: [0.7, SURFACE_EYE_Y, -187], target: [0, -0.8, -203], moment: "departure" },
  { progress: 0.625, position: [0.3, SURFACE_EYE_Y, -193], target: [0, -0.4, -208], moment: "approach" },
  { progress: 0.65, position: [1.5, SURFACE_EYE_Y, -199], target: target(journeyWorld.experience, 3.2), moment: "focus" },
  { progress: 0.68, position: [0.5, SURFACE_EYE_Y, -208], target: [-1, -0.8, -225], moment: "departure" },
  { progress: 0.705, position: [-0.3, SURFACE_EYE_Y, -215], target: [-4.5, -0.7, -231], moment: "approach" },
  { progress: 0.73, position: [-1, SURFACE_EYE_Y, -221], target: target(journeyWorld.data, 1.8), moment: "focus" },
  { progress: 0.76, position: [-0.5, SURFACE_EYE_Y, -230], target: [-1, -0.8, -246], moment: "departure" },
  { progress: 0.785, position: [-0.7, SURFACE_EYE_Y, -236], target: [-4.5, -0.7, -251], moment: "approach" },
  { progress: 0.81, position: [-1.5, SURFACE_EYE_Y, -242], target: target(journeyWorld.creative, 2.1), moment: "focus" },
  { progress: 0.84, position: [-0.6, SURFACE_EYE_Y, -251], target: [1, -0.8, -268], moment: "departure" },
  { progress: 0.86, position: [0.5, SURFACE_EYE_Y, -257], target: [4.5, -0.6, -273], moment: "approach" },
  { progress: 0.885, position: [1.5, SURFACE_EYE_Y, -264], target: target(journeyWorld.future, 2.2), moment: "focus" },
  { progress: 0.915, position: [0.6, SURFACE_EYE_Y, -273], target: [0, -0.7, -290], moment: "departure" },
  { progress: 0.935, position: [0.2, SURFACE_EYE_Y, -279], target: [0, -0.4, -294], moment: "approach" },
  { progress: 0.955, position: [0, SURFACE_EYE_Y, -286], target: target(journeyWorld.contact, 2.4), moment: "focus" },
  { progress: 0.98, position: [0, SURFACE_EYE_Y, -298], target: [0, 0.2, -316], moment: "departure" },
  { progress: 1, position: [0, SURFACE_EYE_Y, -309], target: journeyWorld.complete, moment: "focus" },
] as const satisfies readonly JourneyCameraKeyframe[];
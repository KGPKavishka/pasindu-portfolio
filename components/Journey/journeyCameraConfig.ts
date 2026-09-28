export type JourneyVector = readonly [number, number, number];

export interface JourneyCameraKeyframe {
  readonly progress: number;
  readonly position: JourneyVector;
  readonly target: JourneyVector;
}

export const journeyCameraKeyframes = [
  {
    progress: 0,
    position: [0, 0.2, 12],
    target: [0, 0, -24],
  },
  {
    progress: 0.08,
    position: [0.7, 0.45, 4],
    target: [1, 0, -28],
  },
  {
    progress: 0.16,
    position: [1.2, 0.2, -16],
    target: [1, -0.2, -28],
  },
  {
    progress: 0.2,
    position: [7.5, 0.8, -28],
    target: [1, -1, -36],
  },
  {
    progress: 0.24,
    position: [2.8, 2.8, -46],
    target: [0, -2.2, -70],
  },
  {
    progress: 0.32,
    position: [0, 4.2, -78],
    target: [0, 1, -108],
  },
  {
    progress: 0.4,
    position: [-1.5, 3.2, -117],
    target: [-7, 2.5, -128],
  },
  {
    progress: 0.47,
    position: [2, 3.1, -138],
    target: [7, 2.4, -148],
  },
  {
    progress: 0.54,
    position: [-2, 3.2, -158],
    target: [-8, 2.5, -168],
  },
  {
    progress: 0.61,
    position: [2, 3.1, -178],
    target: [7, 2.4, -188],
  },
  {
    progress: 0.69,
    position: [2, 4.2, -199],
    target: [0, 4, -210],
  },
  {
    progress: 0.77,
    position: [-1, 3.4, -221],
    target: [-7, 2.4, -232],
  },
  {
    progress: 0.85,
    position: [-1.5, 3.8, -242],
    target: [-7, 2.3, -252],
  },
  {
    progress: 0.92,
    position: [1.5, 3.8, -264],
    target: [7, 2.5, -274],
  },
  {
    progress: 0.98,
    position: [0, 3.6, -286],
    target: [0, 2.4, -296],
  },
  {
    progress: 1,
    position: [0, 2.8, -309],
    target: [0, 2.5, -320],
  },
] as const satisfies readonly JourneyCameraKeyframe[];
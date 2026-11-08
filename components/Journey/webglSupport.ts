"use client";

import { useSyncExternalStore } from "react";

let cachedSupport: boolean | null = null;
const noopSubscribe = () => () => {};

/**
 * Checks whether the current browser environment can create a WebGL1 or WebGL2
 * rendering context. Used to automatically fall back to the plain single-page
 * Mission Summary view when WebGL is unavailable or disabled (docs/DESIGN_PLAN.md §8).
 */
export function isWebGLSupported(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  if (cachedSupport !== null) {
    return cachedSupport;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    cachedSupport = Boolean(
      gl &&
        (typeof WebGLRenderingContext !== "undefined" ||
          typeof WebGL2RenderingContext !== "undefined")
    );
  } catch {
    cachedSupport = false;
  }

  return cachedSupport;
}

/**
 * Hydration-safe hook that returns `true` during SSR and the real WebGL
 * capability on the client.
 */
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(noopSubscribe, isWebGLSupported, () => true);
}

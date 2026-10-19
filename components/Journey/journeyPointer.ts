"use client";

import { useEffect } from "react";

export interface JourneyPointer {
  /** Normalized horizontal position: -1 (left) to 1 (right). */
  x: number;
  /** Normalized vertical position: -1 (bottom) to 1 (top). */
  y: number;
}

type PointerListener = (pointer: JourneyPointer) => void;

// One shared window listener feeds both the 3D rig and the DOM layer, since the
// canvas itself is pointer-events: none.
const pointer: JourneyPointer = { x: 0, y: 0 };
const listeners = new Set<PointerListener>();
let subscriberCount = 0;

function notify() {
  listeners.forEach((listener) => listener(pointer));
}

function handlePointerMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
  notify();
}

function resetPointer() {
  pointer.x = 0;
  pointer.y = 0;
  notify();
}

function subscribe(listener?: PointerListener) {
  subscriberCount += 1;

  if (subscriberCount === 1) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.documentElement.addEventListener("mouseleave", resetPointer);
  }

  if (listener) listeners.add(listener);

  return () => {
    if (listener) listeners.delete(listener);
    subscriberCount -= 1;

    if (subscriberCount === 0) {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
      document.documentElement.removeEventListener("mouseleave", resetPointer);
    }
  };
}

/**
 * Returns the live, mutable pointer sample (read it inside useFrame) and
 * optionally calls `onChange` whenever it moves.
 */
export function useJourneyPointer(onChange?: PointerListener) {
  useEffect(() => subscribe(onChange), [onChange]);

  return pointer;
}

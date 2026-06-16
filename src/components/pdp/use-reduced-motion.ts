"use client";

import { usePdpRuntime } from "./pdp-runtime-context";

/** Runtime reduced-motion preference — updates when OS setting changes */
export function useReducedMotion(): boolean {
  return usePdpRuntime().reducedMotion;
}

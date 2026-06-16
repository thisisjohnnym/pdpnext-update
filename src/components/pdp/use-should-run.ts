"use client";

import { usePdpRuntime } from "./pdp-runtime-context";

/** Gate continuous work — false when tab is hidden or frozen */
export function useShouldRun(): boolean {
  return usePdpRuntime().shouldRun;
}

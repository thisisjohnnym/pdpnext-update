"use client";

import { usePdpRuntime } from "./pdp-runtime-context";

/** Shared low-power signal — battery + saveData/effectiveType heuristics */
export function useLowPowerMode(): boolean {
  return usePdpRuntime().lowPowerMode;
}

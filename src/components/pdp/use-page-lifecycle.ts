"use client";

import { usePdpRuntime, type PageLifecycleState } from "./pdp-runtime-context";

/** Page lifecycle — visibility, freeze/resume, and combined active state */
export function usePageLifecycle(): PageLifecycleState {
  return usePdpRuntime().lifecycle;
}

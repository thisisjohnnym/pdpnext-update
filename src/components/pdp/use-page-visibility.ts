"use client";

import { usePdpRuntime } from "./pdp-runtime-context";

/** Document visibility — false when tab is hidden or backgrounded */
export function usePageVisibility(): boolean {
  return usePdpRuntime().lifecycle.isVisible;
}

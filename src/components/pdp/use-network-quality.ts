"use client";

import { usePdpRuntime } from "./pdp-runtime-context";

/** Network-aware preload and autoplay policy */
export function useNetworkQuality() {
  return usePdpRuntime().network;
}

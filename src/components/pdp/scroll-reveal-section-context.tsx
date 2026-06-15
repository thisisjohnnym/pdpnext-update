"use client";

import { createContext, useContext } from "react";

type ScrollRevealSectionContextValue = {
  /** Parent PdpScrollReveal has entered the viewport */
  sectionVisible: boolean;
};

export const ScrollRevealSectionContext =
  createContext<ScrollRevealSectionContextValue | null>(null);

export function useScrollRevealSection() {
  return useContext(ScrollRevealSectionContext);
}

/** Delay text reveal until the section shell is partway through its fade */
export const NESTED_TEXT_REVEAL_BASE_DELAY_MS = 780;

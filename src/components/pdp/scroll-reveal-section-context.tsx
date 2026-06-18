"use client";

import { createContext } from "react";

type ScrollRevealSectionContextValue = {
  /** Section is mounted in the viewport (used for media priority, etc.) */
  sectionVisible: boolean;
};

export const ScrollRevealSectionContext =
  createContext<ScrollRevealSectionContextValue | null>(null);

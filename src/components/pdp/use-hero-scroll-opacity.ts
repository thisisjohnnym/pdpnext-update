"use client";

import { useEffect, useState } from "react";

import { useScrollSnapshot } from "./use-coalesced-scroll";

/** Smoothstep — gentle ease in/out, no hard stops */
function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

/**
 * Hero overlay opacity — hold full visibility, then ease out over a long band.
 * Fade starts after ~12% viewport scroll, completes by ~72%.
 */
export function getHeroScrollOpacity(scrollY: number, viewportHeight: number) {
  const fadeStart = viewportHeight * 0.12;
  const fadeEnd = viewportHeight * 0.72;

  if (scrollY <= fadeStart) return 1;
  if (scrollY >= fadeEnd) return 0;

  return 1 - smoothstep((scrollY - fadeStart) / (fadeEnd - fadeStart));
}

export function useHeroScrollOpacity() {
  const [opacity, setOpacity] = useState(1);
  const { scrollY, viewportHeight } = useScrollSnapshot();

  useEffect(() => {
    setOpacity(getHeroScrollOpacity(scrollY, viewportHeight));
  }, [scrollY, viewportHeight]);

  return opacity;
}

/** Keep mounted but non-interactive when fully faded */
export function isHeroOverlayVisible(opacity: number) {
  return opacity > 0.02;
}

"use client";

import { useEffect, useState } from "react";

/** Smoothstep — gentle ease in/out, no hard stops */
function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

/**
 * Hero overlay opacity — hold full visibility, then ease out over a long band.
 * Fade starts after ~12% viewport scroll, completes by ~72%.
 */
export function getHeroScrollOpacity(scrollY: number) {
  const vh = window.innerHeight;
  const fadeStart = vh * 0.12;
  const fadeEnd = vh * 0.72;

  if (scrollY <= fadeStart) return 1;
  if (scrollY >= fadeEnd) return 0;

  return 1 - smoothstep((scrollY - fadeStart) / (fadeEnd - fadeStart));
}

export function useHeroScrollOpacity() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setOpacity(getHeroScrollOpacity(window.scrollY));
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return opacity;
}

/** Keep mounted but non-interactive when fully faded */
export function isHeroOverlayVisible(opacity: number) {
  return opacity > 0.02;
}

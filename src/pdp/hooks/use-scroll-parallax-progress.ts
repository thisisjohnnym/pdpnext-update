"use client";

import { useCallback, useState, type RefObject } from "react";

import { useReducedMotion } from "./use-reduced-motion";

import { useCoalescedScroll } from "./use-coalesced-scroll";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

type ScrollParallaxProgressOptions = {
  /** Delays progress start by a viewport fraction (0..1). */
  entryOffsetViewport?: number;
  /** Scales section height to compute progress travel distance. */
  travelSectionRatio?: number;
  /** Minimum travel distance as a viewport fraction. */
  minTravelViewportRatio?: number;
};

const DEFAULT_ENTRY_OFFSET_VIEWPORT = 0;
const DEFAULT_TRAVEL_SECTION_RATIO = 0.72;
const DEFAULT_MIN_TRAVEL_VIEWPORT_RATIO = 0.45;

/** Scroll-scrubbed 0→1 progress, reversible — drives assets de-overlap and inset morphs */
export function useScrollParallaxProgress(
  sectionRef: RefObject<HTMLElement | null>,
  options: ScrollParallaxProgressOptions = {},
): number {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(reducedMotion ? 1 : 0);
  const entryOffsetViewport =
    options.entryOffsetViewport ?? DEFAULT_ENTRY_OFFSET_VIEWPORT;
  const travelSectionRatio =
    options.travelSectionRatio ?? DEFAULT_TRAVEL_SECTION_RATIO;
  const minTravelViewportRatio =
    options.minTravelViewportRatio ?? DEFAULT_MIN_TRAVEL_VIEWPORT_RATIO;

  const measure = useCallback(() => {
    if (reducedMotion) {
      return;
    }

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const sectionRect = section.getBoundingClientRect();

    if (sectionRect.top >= viewportHeight) {
      setProgress((current) => (current === 0 ? current : 0));
      return;
    }

    if (sectionRect.bottom <= 0) {
      setProgress((current) => (current === 1 ? current : 1));
      return;
    }

    const travel = Math.max(
      sectionRect.height * travelSectionRatio,
      viewportHeight * minTravelViewportRatio,
    );
    const scrolled =
      viewportHeight - sectionRect.top - viewportHeight * entryOffsetViewport;
    const next = clamp01(scrolled / travel);

    setProgress((current) =>
      Math.abs(current - next) < 0.001 ? current : next,
    );
  }, [
    entryOffsetViewport,
    minTravelViewportRatio,
    reducedMotion,
    sectionRef,
    travelSectionRatio,
  ]);

  useCoalescedScroll(measure);

  return reducedMotion ? 1 : progress;
}

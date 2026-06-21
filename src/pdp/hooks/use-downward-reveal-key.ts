"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

type DownwardRevealOptions = {
  threshold?: number;
  enterThreshold?: number;
  exitThreshold?: number;
  rootMargin?: string;
};

/**
 * Returns a monotonically increasing key when a target enters the viewport
 * while scrolling downward. Upward scrolling never retriggers the reveal.
 */
export function useDownwardRevealKey(
  targetRef: RefObject<Element | null>,
  {
    threshold,
    enterThreshold = threshold ?? 0.2,
    exitThreshold = 0.04,
    rootMargin = "0px 0px -8% 0px",
  }: DownwardRevealOptions = {},
) {
  const [revealKey, setRevealKey] = useState(0);
  const didInitRef = useRef(false);
  const isInsideRef = useRef(false);
  const lastTopRef = useRef<number | null>(null);
  const normalizedEnterThreshold = Math.min(1, Math.max(0, enterThreshold));
  const normalizedExitThreshold = Math.min(
    normalizedEnterThreshold,
    Math.max(0, exitThreshold),
  );
  const observerThresholds = useMemo(() => {
    const values = [0, normalizedExitThreshold, normalizedEnterThreshold, 1];
    return [...new Set(values)].sort((a, b) => a - b);
  }, [normalizedEnterThreshold, normalizedExitThreshold]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      return;
    }

    didInitRef.current = false;
    isInsideRef.current = false;
    lastTopRef.current = null;

    const observer = new IntersectionObserver(([entry]) => {
      const currentTop = entry.boundingClientRect.top;
      const previousTop = lastTopRef.current;
      const movingUp = previousTop == null ? false : currentTop < previousTop - 0.5;
      const isVisibleEnough =
        entry.isIntersecting && entry.intersectionRatio >= normalizedEnterThreshold;
      const hasExited =
        !entry.isIntersecting || entry.intersectionRatio <= normalizedExitThreshold;

      if (!didInitRef.current) {
        didInitRef.current = true;
        isInsideRef.current = isVisibleEnough;
        lastTopRef.current = currentTop;
        return;
      }

      if (!isInsideRef.current && isVisibleEnough && movingUp) {
        setRevealKey((current) => current + 1);
      }

      if (hasExited) {
        isInsideRef.current = false;
      } else if (isVisibleEnough) {
        isInsideRef.current = true;
      }

      lastTopRef.current = currentTop;
    }, { threshold: observerThresholds, rootMargin });

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [
    targetRef,
    rootMargin,
    normalizedEnterThreshold,
    normalizedExitThreshold,
    observerThresholds,
  ]);

  return revealKey;
}

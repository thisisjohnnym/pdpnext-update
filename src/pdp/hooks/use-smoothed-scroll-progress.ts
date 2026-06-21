"use client";

import { useEffect, useRef, useState } from "react";

import { useReducedMotion } from "./use-reduced-motion";

type SmoothedScrollProgressOptions = {
  lerp?: number;
  maxStep?: number;
  snapEpsilon?: number;
};

const DEFAULT_LERP = 0.16;
const DEFAULT_MAX_STEP = 0.032;
const DEFAULT_SNAP_EPSILON = 0.001;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Smooths scroll progress with subtle momentum while respecting reduced-motion. */
export function useSmoothedScrollProgress(
  targetProgress: number,
  options: SmoothedScrollProgressOptions = {},
): number {
  const reducedMotion = useReducedMotion();
  const [smoothedProgress, setSmoothedProgress] = useState(targetProgress);
  const smoothedRef = useRef(targetProgress);
  const lerp = options.lerp ?? DEFAULT_LERP;
  const maxStep = options.maxStep ?? DEFAULT_MAX_STEP;
  const snapEpsilon = options.snapEpsilon ?? DEFAULT_SNAP_EPSILON;

  useEffect(() => {
    smoothedRef.current = smoothedProgress;
  }, [smoothedProgress]);

  useEffect(() => {
    if (reducedMotion) {
      smoothedRef.current = targetProgress;
      return;
    }

    let frame = 0;

    const tick = () => {
      const current = smoothedRef.current;
      const delta = targetProgress - current;

      if (Math.abs(delta) <= snapEpsilon) {
        if (current !== targetProgress) {
          smoothedRef.current = targetProgress;
          setSmoothedProgress(targetProgress);
        }
        return;
      }

      const step = Math.sign(delta) * Math.min(maxStep, Math.abs(delta) * lerp);
      const next = clamp01(current + step);
      smoothedRef.current = next;
      setSmoothedProgress((previous) =>
        Math.abs(previous - next) < 0.0005 ? previous : next,
      );
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [lerp, maxStep, reducedMotion, snapEpsilon, targetProgress]);

  return reducedMotion ? targetProgress : smoothedProgress;
}

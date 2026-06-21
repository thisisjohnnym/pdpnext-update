"use client";

import { useEffect, useRef } from "react";

import { readBrowserBottomInset } from "./use-browser-bottom-inset";

const LERP = 0.2;
const HYSTERESIS_PX = 1;

/** Smooth --pdp-browser-bottom-inset for fixed CTA stack only */
export function useSmoothedBrowserBottomInset() {
  const smoothed = useRef(0);
  const target = useRef(0);
  const frame = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    const apply = () => {
      const nextTarget = readBrowserBottomInset();
      if (Math.abs(nextTarget - target.current) >= HYSTERESIS_PX) {
        target.current = nextTarget;
      }

      const delta = target.current - smoothed.current;
      if (Math.abs(delta) < 0.25) {
        smoothed.current = target.current;
      } else {
        smoothed.current += delta * LERP;
      }

      document.documentElement.style.setProperty(
        "--pdp-browser-bottom-inset",
        `${smoothed.current}px`,
      );

      if (Math.abs(target.current - smoothed.current) <= 0.25) {
        running.current = false;
        frame.current = 0;
        return;
      }

      frame.current = window.requestAnimationFrame(apply);
    };

    const startSmoothing = () => {
      if (running.current) {
        return;
      }
      running.current = true;
      frame.current = window.requestAnimationFrame(apply);
    };

    target.current = readBrowserBottomInset();
    smoothed.current = target.current;
    document.documentElement.style.setProperty(
      "--pdp-browser-bottom-inset",
      `${smoothed.current}px`,
    );

    const onViewportChange = () => {
      target.current = readBrowserBottomInset();
      startSmoothing();
    };

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", onViewportChange);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);

    return () => {
      viewport?.removeEventListener("resize", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      if (frame.current) {
        window.cancelAnimationFrame(frame.current);
      }
      running.current = false;
      document.documentElement.style.removeProperty("--pdp-browser-bottom-inset");
    };
  }, []);
}

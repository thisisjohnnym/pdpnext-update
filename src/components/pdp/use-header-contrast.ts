"use client";

import { useEffect, useState, type RefObject } from "react";

import {
  luminanceToForeground,
  sampleBackdropLuminance,
  type HeaderForeground,
} from "@/lib/header-contrast";

export function useHeaderContrast(
  headerRef: RefObject<HTMLElement | null>,
): HeaderForeground {
  const [foreground, setForeground] = useState<HeaderForeground>("light");

  useEffect(() => {
    let frame = 0;
    let lastMeasureAt = 0;
    let mutationTimer = 0;
    const SCROLL_SAMPLE_MS = 120;

    const measure = () => {
      const header = headerRef.current;
      if (!header) return;

      const rect = header.getBoundingClientRect();
      if (rect.height <= 0 || rect.width <= 0) return;

      const luminance = sampleBackdropLuminance(rect);
      if (luminance === null) return;

      setForeground((current) => {
        const next = luminanceToForeground(luminance, current);
        return next === current ? current : next;
      });
    };

    const schedule = (force = false) => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const now = performance.now();
        if (!force && now - lastMeasureAt < SCROLL_SAMPLE_MS) {
          return;
        }
        lastMeasureAt = now;
        measure();
      });
    };

    const handleImageLoad = () => schedule(true);

    const bindImageLoads = () => {
      document.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", handleImageLoad, { once: true });
        }
      });
    };

    const onScroll = () => schedule();
    const onResize = () => schedule(true);

    schedule(true);
    bindImageLoads();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const observer = new MutationObserver(() => {
      if (mutationTimer) return;
      mutationTimer = window.setTimeout(() => {
        mutationTimer = 0;
        bindImageLoads();
        schedule(true);
      }, 400);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      if (mutationTimer) window.clearTimeout(mutationTimer);
    };
  }, [headerRef]);

  return foreground;
}

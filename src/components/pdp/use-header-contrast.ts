"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

import {
  luminanceToForeground,
  sampleBackdropLuminance,
  type HeaderForeground,
} from "@/lib/header-contrast";

import { useScrollSnapshot } from "./use-coalesced-scroll";

const SCROLL_SAMPLE_MS = 120;

export function useHeaderContrast(
  headerRef: RefObject<HTMLElement | null>,
): HeaderForeground {
  const [foreground, setForeground] = useState<HeaderForeground>("light");
  const { scrollY } = useScrollSnapshot();
  const lastMeasureAt = useRef(0);

  const measure = useCallback(() => {
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
  }, [headerRef]);

  useEffect(() => {
    const now = performance.now();
    if (now - lastMeasureAt.current < SCROLL_SAMPLE_MS) {
      return;
    }

    lastMeasureAt.current = now;
    measure();
  }, [scrollY, measure]);

  useEffect(() => {
    let mutationTimer = 0;

    const handleImageLoad = () => {
      measure();
    };

    const bindImageLoads = () => {
      document.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", handleImageLoad, { once: true });
        }
      });
    };

    const onResize = () => {
      measure();
    };

    measure();
    bindImageLoads();
    window.addEventListener("resize", onResize);

    const observer = new MutationObserver(() => {
      if (mutationTimer) return;
      mutationTimer = window.setTimeout(() => {
        mutationTimer = 0;
        bindImageLoads();
        measure();
      }, 400);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      if (mutationTimer) window.clearTimeout(mutationTimer);
    };
  }, [measure]);

  return foreground;
}

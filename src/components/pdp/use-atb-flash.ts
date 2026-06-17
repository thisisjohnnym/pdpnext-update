"use client";

import { useLayoutEffect, type RefObject } from "react";

import { ensureGsapPlugins, gsap } from "./pdp-gsap";
import { useReducedMotion } from "./use-reduced-motion";
import { useShouldRun } from "./use-should-run";

type UseAtbFlashOptions = {
  enabled?: boolean;
};

const NEUTRAL_INK = "#171717";
const FLASH_PEAK_OPACITY = 0.92;
const FLASH_IN_S = 0.18;
const FLASH_HOLD_S = 0.12;
const FLASH_OUT_S = 0.5;
const FLASH_GLOW = "drop-shadow(0 6px 20px rgba(37,99,235,0.4))";
const FLASH_GLOW_REST = "drop-shadow(0 0 0 rgba(37,99,235,0))";
const FLASH_GAP_MIN_S = 6.5;
const FLASH_GAP_RANGE_S = 7;
const FLASH_INITIAL_DELAY_S = 3;

/**
 * Occasional, quick blue flash across the (white) Add to bag CTA — a luxurious
 * "pay attention here" teaser. Recolors the fill, ink, and glow, then settles
 * back to white.
 */
export function useAtbFlash(
  buttonRef: RefObject<HTMLButtonElement | null>,
  flashRef: RefObject<HTMLSpanElement | null>,
  contentRef: RefObject<HTMLSpanElement | null>,
  { enabled = true }: UseAtbFlashOptions = {},
) {
  const shouldRun = useShouldRun();
  const reducedMotion = useReducedMotion();

  // fallow-ignore-next-line complexity
  useLayoutEffect(() => {
    if (!enabled || reducedMotion || !shouldRun) {
      return;
    }

    const button = buttonRef.current;
    const flash = flashRef.current;
    const content = contentRef.current;
    if (!button || !flash || !content) {
      return;
    }

    ensureGsapPlugins();

    let gapCall: gsap.core.Tween | null = null;
    let flashTl: gsap.core.Timeline | null = null;

    const reset = () => {
      gsap.set(flash, { opacity: 0 });
      gsap.set(content, { color: NEUTRAL_INK });
      gsap.set(button, { filter: FLASH_GLOW_REST });
    };

    const runFlash = () => {
      if (!shouldRun) {
        return;
      }

      flashTl?.kill();
      flashTl = gsap.timeline({ onComplete: scheduleNext });
      flashTl
        .to(flash, { opacity: FLASH_PEAK_OPACITY, duration: FLASH_IN_S, ease: "power2.out" }, 0)
        .to(content, { color: "#ffffff", duration: FLASH_IN_S, ease: "power2.out" }, 0)
        .to(button, { filter: FLASH_GLOW, duration: FLASH_IN_S, ease: "power2.out" }, 0)
        .to({}, { duration: FLASH_HOLD_S })
        .to(flash, { opacity: 0, duration: FLASH_OUT_S, ease: "power2.inOut" })
        .to(content, { color: NEUTRAL_INK, duration: FLASH_OUT_S, ease: "power2.inOut" }, "<")
        .to(button, { filter: FLASH_GLOW_REST, duration: FLASH_OUT_S, ease: "power2.inOut" }, "<");
    };

    const scheduleNext = () => {
      gapCall?.kill();
      const gap = FLASH_GAP_MIN_S + Math.random() * FLASH_GAP_RANGE_S;
      gapCall = gsap.delayedCall(gap, runFlash);
    };

    reset();
    gapCall = gsap.delayedCall(FLASH_INITIAL_DELAY_S, runFlash);

    return () => {
      gapCall?.kill();
      flashTl?.kill();
      gsap.killTweensOf([flash, content, button]);
      gsap.set(flash, { opacity: 0 });
      gsap.set(content, { clearProps: "color" });
      gsap.set(button, { clearProps: "filter" });
    };
  }, [buttonRef, flashRef, contentRef, enabled, reducedMotion, shouldRun]);
}

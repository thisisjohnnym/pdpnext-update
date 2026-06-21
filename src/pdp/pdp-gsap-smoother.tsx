"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";
const IOS_BROWSER_EXCLUSIONS = /CriOS|FxiOS|EdgiOS|OPiOS/;
const IOS_SAFARI_SMOOTH = 0.22;
const IOS_SAFARI_SMOOTH_TOUCH = 0;
const DESKTOP_SMOOTH = 0.8;

type PdpGsapSmootherProps = {
  children: ReactNode;
};

/** Global smooth scroll layer for the PDP stack. */
export function PdpGsapSmoother({ children }: PdpGsapSmootherProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const content = contentRef.current;
      if (!wrapper || !content) {
        return;
      }

      ScrollSmoother.get()?.kill();
      const prefersReducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const isTouchDevice = window.matchMedia(TOUCH_QUERY).matches;
      const ua = navigator.userAgent;
      const isIosSafari =
        isTouchDevice && /Safari/.test(ua) && !IOS_BROWSER_EXCLUSIONS.test(ua);

      if (prefersReducedMotion) {
        ScrollTrigger.config({ ignoreMobileResize: false });
        ScrollTrigger.normalizeScroll(false);
        return;
      }

      // Keep native scrolling on touch devices by default; only opt iOS Safari
      // into a conservative smoother profile for A/B testing.
      if (isTouchDevice && !isIosSafari) {
        ScrollTrigger.config({ ignoreMobileResize: false });
        ScrollTrigger.normalizeScroll(false);
        return;
      }

      const touchSmootherProfile = isIosSafari;
      ScrollTrigger.config({ ignoreMobileResize: !touchSmootherProfile });
      ScrollTrigger.normalizeScroll(!touchSmootherProfile);

      const smoother = ScrollSmoother.create({
        wrapper,
        content,
        smooth: touchSmootherProfile ? IOS_SAFARI_SMOOTH : DESKTOP_SMOOTH,
        smoothTouch: touchSmootherProfile ? IOS_SAFARI_SMOOTH_TOUCH : 0,
        effects: false,
        normalizeScroll: !touchSmootherProfile,
      });

      ScrollTrigger.refresh();

      return () => {
        smoother.kill();
        ScrollTrigger.normalizeScroll(false);
        ScrollTrigger.config({ ignoreMobileResize: false });
      };
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

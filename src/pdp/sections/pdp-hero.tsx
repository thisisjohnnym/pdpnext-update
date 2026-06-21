"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

import { useCoalescedScroll } from "../hooks/use-coalesced-scroll";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import { PdpHeroGallery } from "./pdp-hero-gallery";
import { PdpHeroProductBlock } from "../primitives/pdp-hero-product-block";

gsap.registerPlugin(useGSAP, CustomEase);

// Px of downward movement before immersive mode auto-reverts.
const IMMERSIVE_SCROLL_EXIT_PX = 3;

// On land the hero shows the immersive (video-forward) state, then settles.
const IMMERSIVE_INTRO_HOLD_MS = 1000;

type PdpHeroProps = {
  bagCount?: number;
  onOpenMenu?: () => void;
};

/** Design Hero — isolated: 90% gallery container + bottom product overlap */
export function PdpHero({ bagCount = 0, onOpenMenu }: PdpHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lastHeroTopRef = useRef<number | null>(null);
  const didInitPlaybackRef = useRef(false);
  // Start in the immersive state on land; an intro timer settles it to normal.
  const [immersive, setImmersive] = useState(true);
  const reducedMotion = useReducedMotion();

  // Build the orchestrated tap-to-immersive timeline once, paused at the normal state.
  useGSAP(
    () => {
      // Matches the PDP-wide signature ease (cubic-bezier(0.77, 0, 0.18, 1)).
      const premiumEase = CustomEase.create(
        "pdpImmersive",
        "M0,0 C0.77,0 0.18,1 1,1",
      );

      const timeline = gsap.timeline({
        paused: true,
        defaults: { duration: 0.9, ease: premiumEase },
      });

      timeline
        .to('[data-hero-immersive="nav"]', { autoAlpha: 0 }, 0)
        .to('[data-hero-immersive="editorial"]', { autoAlpha: 0 }, 0.08)
        .to('[data-hero-immersive="rail"]', { autoAlpha: 0 }, 0.16)
        .to(
          '[data-hero-immersive="desc"]',
          { autoAlpha: 0, y: 6, marginTop: 0 },
          0.3,
        )
        .fromTo(
          '[data-hero-immersive="card"]',
          { width: "90%" },
          { width: "100%" },
          0.3,
        );

      timelineRef.current = timeline;
    },
    { scope: heroRef },
  );

  // Drive playback from state — reverse() replays the sequence backwards (clean exit order).
  useGSAP(
    () => {
      const timeline = timelineRef.current;
      if (!timeline) {
        return;
      }

      // First run reflects the initial (immersive) state instantly — no intro-in
      // animation; the reveal happens when the intro timer flips it to normal.
      if (reducedMotion || !didInitPlaybackRef.current) {
        didInitPlaybackRef.current = true;
        timeline.progress(immersive ? 1 : 0).pause();
        return;
      }

      if (immersive) {
        timeline.play();
      } else {
        timeline.reverse();
      }
    },
    { dependencies: [immersive, reducedMotion] },
  );

  // Land in the immersive state, then ease back to normal after a brief hold.
  useEffect(() => {
    const timer = window.setTimeout(
      () => setImmersive(false),
      IMMERSIVE_INTRO_HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  // Scrolling the page down auto-restores the normal UI, so the hero is never
  // left "empty" when the user scrolls back up later.
  const handleScroll = useCallback(() => {
    const section = heroRef.current;
    if (!section) {
      return;
    }

    const top = section.getBoundingClientRect().top;
    const previousTop = lastHeroTopRef.current;
    lastHeroTopRef.current = top;

    if (previousTop === null) {
      return;
    }

    // Section moving up (top decreasing) means the page scrolled down.
    if (top < previousTop - IMMERSIVE_SCROLL_EXIT_PX) {
      setImmersive((current) => (current ? false : current));
    }
  }, []);

  useCoalescedScroll(handleScroll);

  return (
    <section
      id="pdp-hero"
      ref={heroRef}
      data-header-surface="dark"
      className="relative w-full shrink-0 overflow-visible bg-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-[1] bg-black"
        style={{
          top: "calc(var(--pdp-safe-area-top) * -1)",
          height: "var(--pdp-safe-area-top)",
        }}
      />
      <div className="pdp-hero-root relative z-[2] w-full">
        <PdpHeroGallery
          bagCount={bagCount}
          onOpenMenu={onOpenMenu}
          onToggleImmersive={() => setImmersive((value) => !value)}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[15]">
          <div className="pointer-events-auto">
            <PdpHeroProductBlock />
          </div>
        </div>
      </div>
    </section>
  );
}

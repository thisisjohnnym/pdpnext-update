"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PDP_SCRUBBED_VIDEO_SRC } from "../pdp-media";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Last frame of the video to scrub to (seconds). Rest of the clip is never shown. */
const SCRUB_DURATION = 12;
/** Threshold below which we skip re-seeking the video to avoid decode thrash. */
const SEEK_EPSILON = 1 / 30;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeInOut(value: number) {
  return value < 0.5
    ? 2 * value * value
    : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

type Keyframe = {
  /** Video time in seconds. */
  t: number;
  /** Zoom factor applied to the stage. */
  scale: number;
  /** Horizontal pan as a fraction of stage width (resize-safe). */
  x: number;
  /** Vertical pan as a fraction of stage height (resize-safe). */
  y: number;
};

/**
 * Zoom/pan keyframes mirroring the Paper "scrubbed video" frames.
 * Base state is centered at 1x; two callout zones zoom in on the brass
 * clasp (~1s) and the detachable strap (~5s), then settle back to 1x.
 */
const KEYFRAMES: Keyframe[] = [
  { t: 0, scale: 1, x: 0, y: 0 },
  { t: 1, scale: 1.42, x: -0.12, y: -0.03 },
  { t: 2.5, scale: 1.42, x: -0.12, y: -0.03 },
  { t: 4, scale: 1, x: 0, y: 0 },
  { t: 5, scale: 2.06, x: 0.186, y: 0 },
  { t: 7, scale: 2.06, x: 0.186, y: 0 },
  { t: 8.5, scale: 1, x: 0, y: 0 },
  { t: SCRUB_DURATION, scale: 1, x: 0, y: 0 },
];

type Callout = {
  id: string;
  text: string;
  /** Visible window in video seconds. */
  start: number;
  end: number;
  /** Fade in/out ramp in seconds. */
  fade: number;
  /** Inline position within the overlay, scaled by --pdp-scale. */
  style: React.CSSProperties;
};

const CALLOUTS: Callout[] = [
  {
    id: "clasp",
    text: 'Signature Brass "C" Clasp',
    start: 1,
    end: 3.5,
    fade: 0.45,
    style: {
      // Lift above the fixed CTA bar (height + inset) plus the design's 40px gap.
      bottom:
        "calc(var(--pdp-cta-height) + var(--pdp-cta-inset) + (40 * var(--pdp-scale) * 1px))",
      right: "calc(24 * var(--pdp-scale) * 1px)",
    },
  },
  {
    id: "strap",
    text: "Detachable strap",
    start: 5,
    end: 7.5,
    fade: 0.45,
    style: {
      top: "50%",
      left: "calc(24 * var(--pdp-scale) * 1px)",
      transform: "translateY(-50%)",
    },
  },
];

function interpolateTransform(time: number): {
  scale: number;
  x: number;
  y: number;
} {
  if (time <= KEYFRAMES[0].t) {
    return KEYFRAMES[0];
  }

  const last = KEYFRAMES[KEYFRAMES.length - 1];
  if (time >= last.t) {
    return last;
  }

  for (let i = 0; i < KEYFRAMES.length - 1; i += 1) {
    const from = KEYFRAMES[i];
    const to = KEYFRAMES[i + 1];

    if (time >= from.t && time <= to.t) {
      const span = to.t - from.t || 1;
      const eased = easeInOut((time - from.t) / span);

      return {
        scale: from.scale + (to.scale - from.scale) * eased,
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased,
      };
    }
  }

  return last;
}

function calloutOpacity(time: number, callout: Callout): number {
  if (time <= callout.start || time >= callout.end) {
    return 0;
  }

  const fadeIn = clamp01((time - callout.start) / callout.fade);
  const fadeOut = clamp01((callout.end - time) / callout.fade);

  return Math.min(fadeIn, fadeOut);
}

/**
 * Scroll-scrubbed product video.
 *
 * Architecture: the <section> stays inside the ScrollSmoother content tree to
 * provide 600svh of scroll space and serve as the ScrollTrigger anchor. The
 * visible overlay (video + callouts) is portalled into #pdp-scrubbed-video-portal,
 * which is a sibling of the ScrollSmoother wrapper. This makes the overlay
 * position:fixed relative to the viewport with no transformed ancestor, removing
 * the iOS Safari jitter that occurs when ScrollTrigger pins fight the smoother's
 * translateY.
 */
export function PdpScrubbedVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const calloutRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);

  useEffect(() => {
    // Defer to a rAF so React has committed to the DOM (portal slot exists)
    // and setState fires inside a callback, satisfying the hooks lint rule.
    const id = window.requestAnimationFrame(() => {
      setPortalTarget(
        document.getElementById("pdp-scrubbed-video-portal") ?? document.body,
      );
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const overlay = overlayRef.current;
      const stage = stageRef.current;
      const video = videoRef.current;
      if (!section || !overlay || !stage || !video) {
        return;
      }

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const applyFrame = (time: number) => {
        const { scale, x, y } = interpolateTransform(time);
        stage.style.transform = `translate(${(x * 100).toFixed(3)}%, ${(y * 100).toFixed(3)}%) scale(${scale.toFixed(4)})`;

        if (
          Number.isFinite(video.duration) &&
          Math.abs(video.currentTime - time) > SEEK_EPSILON
        ) {
          video.currentTime = Math.min(time, SCRUB_DURATION);
        }

        CALLOUTS.forEach((callout, index) => {
          const node = calloutRefs.current[index];
          if (node) {
            node.style.opacity = String(calloutOpacity(time, callout));
          }
        });
      };

      if (prefersReducedMotion) {
        overlay.style.display = "";
        applyFrame(0);
        return;
      }

      // iOS Safari ignores preload="auto" — call load() explicitly so the
      // browser starts buffering immediately.
      video.muted = true;
      video.load();

      const showOverlay = () => {
        overlay.style.display = "";
      };
      const hideOverlay = () => {
        overlay.style.display = "none";
      };
      // Slide the overlay by a percentage of its own height (100% = one viewport).
      // Positive = below viewport, negative = above viewport.
      const setOverlayY = (percent: number) => {
        overlay.style.transform = `translateY(${percent.toFixed(2)}%)`;
      };

      // Scrub trigger — covers the 500svh locked window. Shows the overlay when
      // the section fills the viewport, drives the video frame and stage transform.
      const scrubTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onEnter: () => { showOverlay(); setOverlayY(0); },
        onLeave: () => applyFrame(SCRUB_DURATION),
        onEnterBack: () => { showOverlay(); setOverlayY(0); },
        onLeaveBack: () => { setOverlayY(0); hideOverlay(); },
        onUpdate: (self) => applyFrame(self.progress * SCRUB_DURATION),
        onRefresh: (self) => {
          applyFrame(self.progress * SCRUB_DURATION);
          if (self.isActive) { showOverlay(); setOverlayY(0); }
        },
      });

      // Exit trigger — slides the overlay upward over the ~100svh "exit tail"
      // after the scrub ends (section bottom bottom → bottom top). The overlay
      // tracks the section's natural scroll-out, letting the next section enter
      // from below without being covered.
      const exitTrigger = ScrollTrigger.create({
        trigger: section,
        start: "bottom bottom",
        end: "bottom top",
        onEnter: () => { showOverlay(); setOverlayY(0); },
        onLeave: () => { setOverlayY(0); hideOverlay(); },
        onEnterBack: () => showOverlay(),
        onLeaveBack: () => setOverlayY(0),
        onUpdate: (self) => setOverlayY(-self.progress * 100),
        onRefresh: (self) => {
          if (self.isActive) {
            showOverlay();
            setOverlayY(-self.progress * 100);
          }
        },
      });

      // Stable reference for the warm-up decoder resync.
      const trigger = scrubTrigger;

      // iOS Safari: the video decoder won't accept seeks until play() has been
      // called at least once near a user gesture. A silent play→pause on the
      // first touchstart unlocks it so all subsequent seeks resolve instantly.
      let decoderReady = false;
      const warmUpDecoder = () => {
        if (decoderReady) return;
        decoderReady = true;
        const p = video.play();
        if (p instanceof Promise) {
          p.then(() => {
            video.pause();
            applyFrame(trigger.progress * SCRUB_DURATION);
          }).catch(() => {});
        }
      };

      document.addEventListener("touchstart", warmUpDecoder, {
        once: true,
        passive: true,
      });

      const seekOnLoad = () => applyFrame(trigger.progress * SCRUB_DURATION);
      video.addEventListener("loadedmetadata", seekOnLoad);

      return () => {
        document.removeEventListener("touchstart", warmUpDecoder);
        video.removeEventListener("loadedmetadata", seekOnLoad);
        scrubTrigger.kill();
        exitTrigger.kill();
        hideOverlay();
      };
    },
    // Re-run once the portal target is resolved so overlayRef.current is set.
    { scope: sectionRef, dependencies: [!!portalTarget] },
  );

  const overlayContent = (
    <div
      ref={overlayRef}
      className="pdp-scrubbed-video-overlay"
      // Hidden by default; ScrollTrigger onEnter/onLeave toggle display.
      style={{ display: "none" }}
      aria-hidden
    >
      <div ref={stageRef} className="pdp-scrubbed-video-stage">
        <video
          ref={videoRef}
          className="size-full object-cover object-center"
          src={PDP_SCRUBBED_VIDEO_SRC}
          muted
          playsInline
          webkit-playsinline="true"
          preload="auto"
          aria-label="Close-up walkthrough of the Tabby Shoulder Bag 26 hardware and strap"
        />
      </div>

      {CALLOUTS.map((callout, index) => (
        <div
          key={callout.id}
          ref={(node) => {
            calloutRefs.current[index] = node;
          }}
          className="pdp-scrubbed-video-callout"
          style={{ opacity: 0, ...callout.style }}
        >
          <span className="font-extended">{callout.text}</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/*
       * Scroll-space anchor — stays inside the smoother so ScrollTrigger
       * can track it. Renders as an empty 600svh block; the visible content
       * is in the portal below.
       */}
      <section
        id="pdp-scrubbed-video"
        ref={sectionRef}
        className="pdp-scrubbed-video-section"
        aria-label="Tabby Shoulder Bag 26 detail walkthrough"
      />
      {portalTarget ? createPortal(overlayContent, portalTarget) : null}
    </>
  );
}

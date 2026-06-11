"use client";

import { useEffect } from "react";

import { PDP_PANEL_SCROLL } from "./pdp-panel-scroll";

/**
 * Disables document scroll-snap once commerce modules enter the viewport — panel
 * snap only while browsing full-height gallery panels above the fold.
 */
export function usePanelScrollRelease(galleryEndRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!PDP_PANEL_SCROLL) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("pdp-panel-scroll");

    const sync = () => {
      const end = galleryEndRef.current;
      if (!end) {
        return;
      }

      const { top } = end.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Marker sits between gallery and commerce — once it crosses into the
      // viewport, mandatory y-snap fights free scroll through carousels below.
      const inCommerceZone = top < viewportHeight;

      if (inCommerceZone) {
        root.classList.remove("pdp-panel-scroll");
      } else if (top >= viewportHeight) {
        root.classList.add("pdp-panel-scroll");
      }
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    const end = galleryEndRef.current;
    let observer: IntersectionObserver | undefined;

    if (end) {
      observer = new IntersectionObserver(() => sync(), { threshold: 0 });
      observer.observe(end);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      root.classList.remove("pdp-panel-scroll");
    };
  }, [galleryEndRef]);
}

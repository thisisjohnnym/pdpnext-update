"use client";

import { useEffect, useRef, useState } from "react";

/** Fade nav action icons on page scroll down; restore on scroll up. Logo stays visible. */
export function useHeroNavVisibility() {
  const [iconsVisible, setIconsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    let frame = 0;

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollY = window.scrollY;
        const delta = scrollY - lastScrollY.current;

        if (Math.abs(delta) < 4) {
          return;
        }

        if (delta > 0 && scrollY > 48) {
          setIconsVisible(false);
        } else if (delta < 0) {
          setIconsVisible(true);
        }

        lastScrollY.current = scrollY;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return iconsVisible;
}

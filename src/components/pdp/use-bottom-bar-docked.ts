"use client";

import { useEffect, useState } from "react";

/** Hero rest — bar is flush to the viewport bottom; past this it floats */
function getBottomBarDocked(scrollY: number) {
  return scrollY <= window.innerHeight * 0.12;
}

/** Frost scrim ramps in once the bar floats over page content */
function getBottomFrostOpacity(scrollY: number) {
  const viewport = window.innerHeight;
  const start = viewport * 0.06;
  const end = viewport * 0.22;

  if (scrollY <= start) {
    return 0;
  }

  if (scrollY >= end) {
    return 1;
  }

  const progress = (scrollY - start) / (end - start);
  // Ease-out so the fade reads sooner as you leave the hero
  return 1 - (1 - progress) * (1 - progress);
}

export function useBottomBarDocked() {
  const [docked, setDocked] = useState(true);
  const [frostOpacity, setFrostOpacity] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      setDocked(getBottomBarDocked(scrollY));
      setFrostOpacity(getBottomFrostOpacity(scrollY));
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { docked, frostOpacity };
}

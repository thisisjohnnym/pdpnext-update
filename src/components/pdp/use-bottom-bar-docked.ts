"use client";

import { useEffect, useState } from "react";

import { useScrollSnapshot } from "./use-coalesced-scroll";

/** Hero rest — bar is flush to the viewport bottom; past this it floats */
function getBottomBarDocked(scrollY: number, viewportHeight: number) {
  return scrollY <= viewportHeight * 0.12;
}

/** Frost scrim ramps in once the bar floats over page content */
function getBottomFrostOpacity(scrollY: number, viewportHeight: number) {
  const start = viewportHeight * 0.06;
  const end = viewportHeight * 0.22;

  if (scrollY <= start) {
    return 0;
  }

  if (scrollY >= end) {
    return 1;
  }

  const progress = (scrollY - start) / (end - start);
  return 1 - (1 - progress) * (1 - progress);
}

export function useBottomBarDocked() {
  const [docked, setDocked] = useState(true);
  const [frostOpacity, setFrostOpacity] = useState(0);
  const { scrollY, viewportHeight } = useScrollSnapshot();

  useEffect(() => {
    setDocked(getBottomBarDocked(scrollY, viewportHeight));
    setFrostOpacity(getBottomFrostOpacity(scrollY, viewportHeight));
  }, [scrollY, viewportHeight]);

  return { docked, frostOpacity };
}

"use client";

import { useEffect, useState } from "react";

/** Hero rest — bar is flush to the viewport bottom; past this it floats */
function getBottomBarDocked(scrollY: number) {
  return scrollY <= window.innerHeight * 0.12;
}

export function useBottomBarDocked() {
  const [docked, setDocked] = useState(true);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setDocked(getBottomBarDocked(window.scrollY));
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

  return docked;
}

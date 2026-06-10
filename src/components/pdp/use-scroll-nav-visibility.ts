"use client";

import { useEffect, useRef, useState } from "react";

const TOP_ALWAYS_VISIBLE = 32;
const SCROLL_DELTA = 10;

/** Hide chrome on scroll down, reveal on scroll up */
export function useScrollNavVisibility() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let frame = 0;
    lastScrollY.current = window.scrollY;

    const update = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;

      if (scrollY <= TOP_ALWAYS_VISIBLE) {
        setVisible(true);
      } else if (delta > SCROLL_DELTA) {
        setVisible(false);
      } else if (delta < -SCROLL_DELTA) {
        setVisible(true);
      }

      lastScrollY.current = scrollY;
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return visible;
}

"use client";

import { useEffect, useRef, useState } from "react";

import { useScrollSnapshot } from "./use-coalesced-scroll";

const TOP_ALWAYS_VISIBLE = 32;
const SCROLL_DELTA = 10;

/** Hide chrome on scroll down, reveal on scroll up */
export function useScrollNavVisibility() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const initialized = useRef(false);
  const { scrollY } = useScrollSnapshot();

  useEffect(() => {
    if (!initialized.current) {
      lastScrollY.current = scrollY;
      initialized.current = true;
      return;
    }

    const delta = scrollY - lastScrollY.current;

    if (scrollY <= TOP_ALWAYS_VISIBLE) {
      setVisible(true);
    } else if (delta > SCROLL_DELTA) {
      setVisible(false);
    } else if (delta < -SCROLL_DELTA) {
      setVisible(true);
    }

    lastScrollY.current = scrollY;
  }, [scrollY]);

  return visible;
}

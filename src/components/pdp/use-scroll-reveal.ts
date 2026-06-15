"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type UseScrollRevealOptions = {
  /** Fraction of element visible before reveal */
  threshold?: number;
  /** IntersectionObserver rootMargin */
  rootMargin?: string;
  /** When false, observer is skipped (e.g. text inside PdpScrollReveal) */
  enabled?: boolean;
};

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.04,
  rootMargin = "0px 0px -2% 0px",
  enabled = true,
}: UseScrollRevealOptions = {}): {
  ref: RefObject<T | null>;
  visible: boolean;
} {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const node = ref.current;
    if (!node || visible) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, visible, enabled]);

  return { ref, visible };
}

"use client";

import { useEffect, useRef, useState } from "react";

type UseScrollRevealOptions = {
  /** Fraction of element visible before reveal */
  threshold?: number;
  /** IntersectionObserver rootMargin */
  rootMargin?: string;
};

export function useScrollReveal({
  threshold = 0.06,
  rootMargin = "0px 0px -5% 0px",
}: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
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
  }, [threshold, rootMargin]);

  return { ref, visible };
}

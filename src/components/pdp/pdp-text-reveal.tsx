"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import {
  NESTED_TEXT_REVEAL_BASE_DELAY_MS,
  useScrollRevealSection,
} from "./scroll-reveal-section-context";
import { useScrollReveal } from "./use-scroll-reveal";

type PdpTextRevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** Stagger offset in ms */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Subtle fade + rise for copy as it enters the scroll viewport */
export function PdpTextReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  delay = 0,
  style,
  ...props
}: PdpTextRevealProps<T>) {
  const Tag = as ?? "div";
  const section = useScrollRevealSection();
  const nestedInSection = section !== null;

  const { ref, visible: inView } = useScrollReveal<HTMLElement>({
    threshold: 0.05,
    rootMargin: "0px 0px 12% 0px",
    enabled: !nestedInSection,
  });

  const [revealed, setRevealed] = useState(() => prefersReducedMotion());

  useEffect(() => {
    if (revealed || prefersReducedMotion()) {
      setRevealed(true);
      return;
    }

    if (nestedInSection) {
      if (!section.sectionVisible) {
        return;
      }

      const timeout = window.setTimeout(
        () => setRevealed(true),
        NESTED_TEXT_REVEAL_BASE_DELAY_MS + delay,
      );

      return () => {
        window.clearTimeout(timeout);
      };
    }

    if (inView) {
      setRevealed(true);
    }
  }, [nestedInSection, section?.sectionVisible, inView, delay, revealed]);

  return (
    <Tag
      ref={nestedInSection ? undefined : (ref as never)}
      className={cn(
        "pdp-text-reveal",
        revealed && "pdp-text-reveal--visible",
        className,
      )}
      style={{
        ...style,
        transitionDelay: nestedInSection
          ? undefined
          : `${delay + 180}ms`,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

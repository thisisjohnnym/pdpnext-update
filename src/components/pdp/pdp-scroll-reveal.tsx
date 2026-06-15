"use client";

import { cn } from "@/lib/cn";

import { ScrollRevealSectionContext } from "./scroll-reveal-section-context";
import { useScrollReveal } from "./use-scroll-reveal";

type PdpScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** rise — modules below gallery · subtle — full-bleed gallery frames */
  variant?: "rise" | "subtle";
  /** Opaque shell color — prevents color flashes during opacity fade */
  surface?: "dark" | "light" | "muted" | "transparent";
  /** Defer mounting children until the section is near the viewport */
  lazyMount?: boolean;
  /** Placeholder height while lazy content is not yet mounted */
  reserveMinHeight?: string;
};

/** Fade + rise into view once as the user scrolls */
export function PdpScrollReveal({
  children,
  className,
  variant = "rise",
  surface,
  lazyMount = false,
  reserveMinHeight = "70dvh",
}: PdpScrollRevealProps) {
  const { ref, visible, nearView } = useScrollReveal({ prefetch: lazyMount });
  const resolvedSurface = surface ?? "light";
  const shouldMount = !lazyMount || nearView;

  return (
    <div
      ref={ref}
      className={cn(
        "pdp-scroll-reveal isolate overflow-hidden",
        resolvedSurface === "dark" && "bg-black",
        resolvedSurface === "light" && "bg-white",
        resolvedSurface === "muted" && "bg-neutral-100",
        resolvedSurface === "transparent" && "bg-transparent",
        variant === "subtle" && "pdp-scroll-reveal--subtle",
        className,
      )}
      style={!shouldMount ? { minHeight: reserveMinHeight } : undefined}
    >
      {shouldMount ? (
        <ScrollRevealSectionContext.Provider value={{ sectionVisible: visible }}>
          <div
            className={cn(
              "pdp-scroll-reveal__inner",
              visible && "pdp-scroll-reveal__inner--visible",
            )}
          >
            {children}
          </div>
        </ScrollRevealSectionContext.Provider>
      ) : null}
    </div>
  );
}

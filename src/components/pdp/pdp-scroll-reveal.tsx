"use client";

import { cn } from "@/lib/cn";

import { useScrollReveal } from "./use-scroll-reveal";

type PdpScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  /** rise — modules below gallery · subtle — full-bleed gallery frames */
  variant?: "rise" | "subtle";
  /** Opaque shell color — prevents color flashes during opacity fade */
  surface?: "dark" | "light" | "muted" | "transparent";
};

/** Fade + rise into view once as the user scrolls */
export function PdpScrollReveal({
  children,
  className,
  variant = "rise",
  surface,
}: PdpScrollRevealProps) {
  const { ref, visible } = useScrollReveal();
  const resolvedSurface = surface ?? "light";

  return (
    <div
      ref={ref}
      className={cn(
        "pdp-scroll-reveal overflow-hidden",
        resolvedSurface === "dark" && "bg-black",
        resolvedSurface === "light" && "bg-white",
        resolvedSurface === "muted" && "bg-neutral-100",
        variant === "subtle" && "pdp-scroll-reveal--subtle",
        className,
      )}
    >
      <div
        className={cn(
          "pdp-scroll-reveal__inner",
          visible && "pdp-scroll-reveal__inner--visible",
        )}
      >
        {children}
      </div>
    </div>
  );
}

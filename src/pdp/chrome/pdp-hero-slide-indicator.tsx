"use client";

import { cn } from "@/lib/cn";

import { PDP_HERO_GALLERY_SLIDE_COUNT } from "../pdp-media";

type PdpHeroSlideIndicatorProps = {
  activeIndex?: number;
  onSelect?: (index: number) => void;
  className?: string;
};

/** Gallery slide scroll indicator — 14 pills in production; active = 30px */
export function PdpHeroSlideIndicator({
  activeIndex = 0,
  onSelect,
  className,
}: PdpHeroSlideIndicatorProps) {
  return (
    <div
      aria-hidden={!onSelect}
      className={cn(
        "pointer-events-none absolute left-0 top-1/2 z-20 flex -translate-y-1/2 flex-col items-start pl-2.5",
        onSelect && "pointer-events-auto",
        className,
      )}
    >
      {Array.from({ length: PDP_HERO_GALLERY_SLIDE_COUNT }, (_, index) => (
        <button
          key={index}
          type="button"
          tabIndex={onSelect ? 0 : -1}
          aria-label={onSelect ? `Go to slide ${index + 1}` : undefined}
          onClick={onSelect ? () => onSelect(index) : undefined}
          className={cn(
            "flex shrink-0 items-center py-[3px] pr-4",
            onSelect && "pointer-events-auto",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "w-[3px] shrink-0 rounded-full bg-white transition-[height] duration-300 ease-[cubic-bezier(0.77,0,0.18,1)]",
              index === activeIndex ? "h-[30px]" : "h-1.5",
            )}
          />
        </button>
      ))}
    </div>
  );
}

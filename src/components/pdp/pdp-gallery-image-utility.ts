import { cn } from "@/lib/cn";

/** Left-center rail for frosted utilities on gallery stills */
export const GALLERY_IMAGE_UTILITY_RAIL_CLASS =
  "absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col items-start gap-2 lg:left-5";

/** Circular icon control — Shop the look, etc. */
export function galleryImageUtilityIconClass(className?: string) {
  return cn(
    "flex size-11 shrink-0 items-center justify-center rounded-full border border-white/55 bg-white/80 text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors active:bg-white/95",
    className,
  );
}

/** Frosted pill with label — sound hints, etc. */
export function galleryImageUtilityPillClass(className?: string) {
  return cn(
    "flex max-w-[min(100%,14rem)] items-center gap-2 rounded-full border border-white/55 bg-white/80 py-1.5 pl-1.5 pr-3 text-left text-neutral-900 shadow-[0_4px_20px_rgba(0,0,0,0.14)] backdrop-blur-md transition-colors active:bg-white/95",
    className,
  );
}

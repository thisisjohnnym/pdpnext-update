import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { GALLERY_IMAGE_UTILITY_RAIL_CLASS } from "./pdp-gallery-image-utility";

/** Stacks frosted gallery utilities — vertically centered, left aligned on photo */
export function PdpGalleryImageUtilityRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(GALLERY_IMAGE_UTILITY_RAIL_CLASS, className)}>{children}</div>
  );
}

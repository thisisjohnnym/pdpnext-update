import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { PDP_PANEL_SCROLL } from "./pdp-panel-scroll";
import { SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";

/** Full-viewport gallery panel — one snap stop per experiential module */
export function experiencePanelSectionProps(isLastPanel = false) {
  return {
    className: cn(
      "relative flex w-full shrink-0 flex-col overflow-hidden bg-white",
      galleryPanelClassName(isLastPanel),
    ),
    style: PDP_PANEL_SCROLL
      ? { ...SCREEN_HEIGHT_STYLE, paddingBottom: BOTTOM_CTA_OFFSET }
      : {
          paddingBottom: BOTTOM_CTA_OFFSET,
          minHeight: "min(100dvh, 720px)",
        },
  } as const;
}

export const EXPERIENCE_PANEL_GRID_CLASS = "h-full min-h-0";

export const EXPERIENCE_PANEL_ITEM_CLASS =
  "flex h-full min-h-0 flex-col gap-3 py-5 lg:py-6";

export const EXPERIENCE_PANEL_HEADER_CLASS = "shrink-0 flex flex-col gap-0.5";

export const EXPERIENCE_PANEL_BODY_CLASS =
  "flex min-h-0 flex-1 flex-col gap-2";

/** Primary media — grows to fill panel below header + controls */
export const EXPERIENCE_PANEL_MEDIA_CLASS =
  "relative min-h-0 w-full flex-1 overflow-hidden";

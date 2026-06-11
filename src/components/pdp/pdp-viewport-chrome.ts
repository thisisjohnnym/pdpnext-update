/** Fixed bottom chrome sits above Safari toolbars + home indicator */
export const BOTTOM_CHROME_OFFSET =
  "calc(var(--pdp-browser-bottom-inset, 0px) + env(safe-area-inset-bottom, 0px))";

/** Floating pill height (gallery scroll) */
export const BOTTOM_PILL_HEIGHT_PX = 48;

/** Docked hero bar height */
export const BOTTOM_DOCKED_HEIGHT_PX = 54;

/** Space for fixed bottom CTAs (buttons + spacing + browser chrome) */
export const BOTTOM_CTA_OFFSET = `calc(${BOTTOM_PILL_HEIGHT_PX}px + 0.625rem + var(--pdp-browser-bottom-inset, 0px) + env(safe-area-inset-bottom, 0px))`;

/** Full layout viewport — immersive panels fill width + height at every breakpoint */
export const SCREEN_HEIGHT_STYLE = {
  width: "100%",
  minHeight: "100dvh",
  height: "var(--pdp-screen-height, 100dvh)",
} as const;

export const PANEL_MEDIA_FRAME_CLASS = "pdp-gallery-panel__frame";
export const PANEL_MEDIA_FILL_CLASS = "relative size-full";
export const PANEL_MEDIA_COVER_CLASS = "pdp-gallery-panel__cover";

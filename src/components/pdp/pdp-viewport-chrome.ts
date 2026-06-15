/** Fixed bottom chrome sits above Safari toolbars + home indicator */
export const BOTTOM_CHROME_OFFSET = "var(--pdp-fixed-bottom-offset)";

/** Floating pill height (gallery scroll) */
export const BOTTOM_PILL_HEIGHT_PX = 48;

/** Docked hero bar height */
export const BOTTOM_DOCKED_HEIGHT_PX = 54;

/** Space for fixed bottom CTAs (buttons + spacing + browser chrome) */
export const BOTTOM_CTA_OFFSET = `calc(${BOTTOM_PILL_HEIGHT_PX}px + 0.625rem + var(--pdp-fixed-bottom-offset))`;

/** Full layout viewport — immersive panels fill visible screen on mobile Safari */
export const SCREEN_HEIGHT_STYLE = {
  width: "100%",
  minHeight: "var(--pdp-immersive-height, 100svh)",
  height: "var(--pdp-immersive-height, 100svh)",
} as const;

/** Immersive hero — edge-to-edge under notch / Dynamic Island (opt-out of SafeAreaMain) */
export const HERO_IMMERSIVE_CLASS = "pdp-hero-immersive";
export const HERO_IMMERSIVE_MEDIA_CLASS = "pdp-hero-immersive__media";

/** Generic edge-to-edge section (galleries, fullscreen experiences) */
export const EDGE_TO_EDGE_CLASS = "pdp-edge-to-edge";
export const EDGE_TO_EDGE_MEDIA_CLASS = "pdp-edge-to-edge__media";

export const PANEL_MEDIA_FRAME_CLASS = "pdp-gallery-panel__frame";
export const PANEL_MEDIA_FILL_CLASS = "relative size-full";
export const PANEL_MEDIA_COVER_CLASS = "pdp-gallery-panel__cover";

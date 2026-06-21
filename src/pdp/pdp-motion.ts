/** Shared PDP motion tokens — min 600ms, Coach easing */
export const PDP_EASE = "cubic-bezier(0.77, 0, 0.18, 1)";
export const PDP_DURATION_MS = 600;
export const PDP_BROWSER_CHROME_TRANSITION_MS = 320;
export const PDP_FRAME_PX = 430;
export const PDP_SCROLL_LATE_START = 0.18;

/**
 * Delays onset of scroll-driven transforms so movement does not start immediately.
 * Keeps output normalized to 0..1 after the dead-zone.
 */
export function getLateStartProgress(
  progress: number,
  start = PDP_SCROLL_LATE_START,
) {
  if (progress <= start) return 0;
  return Math.min(1, (progress - start) / (1 - start));
}

import type { CSSProperties } from "react";

export type PdpInsetMorphVariant = "centered" | "left";
type PdpInsetMorphOptions = {
  padVar?: string;
  widthVar?: string;
};

/**
 * Scroll-scrubbed 0→1 progress → absolute box geometry, full-bleed to inset.
 * "centered" pads both sides equally (ways to wear, capacity).
 * "left" keeps a fixed left inset + fixed width (360).
 */
export function getInsetMorphStyle(
  progress: number,
  variant: PdpInsetMorphVariant,
  options?: PdpInsetMorphOptions,
): CSSProperties {
  const padVar =
    options?.padVar ??
    (variant === "left" ? "var(--pdp-inset-pad)" : "var(--pdp-inset-pad-lg)");
  const insetWidthVar = options?.widthVar ?? "var(--pdp-inset-width)";
  const top = `calc(${padVar} * ${progress})`;
  const height = `calc(100% * ${1 - progress} + var(--pdp-inset-media-height) * ${progress})`;
  const width =
    variant === "left"
      ? `calc(100% * ${1 - progress} + ${insetWidthVar} * ${progress})`
      : `calc(100% - (${padVar} * 2 * ${progress}))`;

  return {
    position: "absolute",
    top,
    left: top,
    width,
    height,
  };
}

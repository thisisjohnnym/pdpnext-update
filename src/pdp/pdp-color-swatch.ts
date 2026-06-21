import { PDP_COLORS } from "./data/pdp-product-data";

/** Deployed swatch paths — PDP_COLORS points at missing /images/colors/* */
const PDP_COLOR_SWATCHES: Record<string, string> = {
  black: "/img/tabby25/ccx04_b4bk_a0.webp",
  canyon: "/img/tabby25/ccx04_b4bk_a5.webp",
  ivory: "/img/tabby25/ccx04_b4bk_a8.webp",
  maple: "/img/tabby25/ccx04_b4bk_a61.webp",
};

export function getPdpColorSwatch(colorId: string): string {
  return (
    PDP_COLOR_SWATCHES[colorId] ??
    PDP_COLORS.find((color) => color.id === colorId)?.swatch ??
    PDP_COLOR_SWATCHES.black!
  );
}

import { PDP_COLORS } from "./data/pdp-product-data";

export function getPdpColorSwatch(colorId: string): string {
  return (
    PDP_COLORS.find((color) => color.id === colorId)?.swatch ??
    "/img/tabby25/thumbnails/ccx04_b4bk_a0.webp"
  );
}

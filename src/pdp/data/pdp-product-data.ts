import { PDP_PRODUCT_CARD } from "../pdp-media";

// ---------------------------------------------------------------------------
// Variant dimensions
// ---------------------------------------------------------------------------

export type PdpStyle = {
  id: string;
  name: string;
  /** Product image used as texture preview in the style card */
  imageSrc: string;
};

export const PDP_STYLES: PdpStyle[] = [
  {
    id: "classic",
    name: "Classic",
    imageSrc: "/img/tabby25/thumbnails/ccx04_b4bk_a0.webp",
  },
  {
    id: "quilted",
    name: "Quilted",
    imageSrc: "/img/tabby25/thumbnails/ccw91_b4bk_a0.webp",
  },
  {
    id: "pillow",
    name: "Pillow",
    imageSrc: "/img/tabby25/thumbnails/cen52_b4il_a0.webp",
  },
  {
    id: "signature",
    name: "Signature",
    imageSrc: "/img/tabby25/thumbnails/ceg40_b4bk_a0.webp",
  },
];

export const PDP_SIZES = [20, 26, 33, 36] as const;
export type PdpSize = (typeof PDP_SIZES)[number];

export const DEFAULT_STYLE_ID = "classic";
export const DEFAULT_SIZE: PdpSize = 26;

// ---------------------------------------------------------------------------
// Colors — pure color dimension only, no style/material conflated in
// ---------------------------------------------------------------------------

export type PdpColor = {
  id: string;
  name: string;
  swatch: string;
  hero: string;
  heroAlt: string;
  chromeSample: string;
};

export const PDP_COLORS: PdpColor[] = [
  {
    id: "black",
    name: "Black",
    swatch: "/img/tabby25/thumbnails/ccx04_b4bk_a0.webp",
    hero: "/img/tabby25/ccx04_b4bk_a0.webp",
    heroAlt: "Tabby Shoulder Bag 26 in black leather",
    chromeSample: "#1a1a1a",
  },
  {
    id: "canyon",
    name: "Canyon",
    swatch: "/img/tabby25/thumbnails/ccx04_b4nd7_a0.webp",
    hero: "/img/tabby25/ccx04_b4bk_a10.webp",
    heroAlt: "Tabby Shoulder Bag 26 in canyon leather",
    chromeSample: "#a34e3d",
  },
  {
    id: "oxblood",
    name: "Oxblood",
    swatch: "/img/tabby25/thumbnails/ccx04_b4mpl_a0.webp",
    hero: "/img/tabby25/ccx04_b4bk_a21.webp",
    heroAlt: "Tabby Shoulder Bag 26 in oxblood leather",
    chromeSample: "#6b2c32",
  },
  {
    id: "tan",
    name: "Tan",
    swatch: "/img/tabby25/thumbnails/ccx04_b4bic_a0.webp",
    hero: "/img/tabby25/ccx04_b4bk_a6.webp",
    heroAlt: "Tabby Shoulder Bag 26 in tan suede",
    chromeSample: "#c4a06a",
  },
  {
    id: "chalk",
    name: "Chalk",
    swatch: "/img/tabby25/thumbnails/ccx04_b4ha_a0.webp",
    hero: "/img/tabby25/ccx04_b4bk_a0.webp",
    heroAlt: "Tabby Shoulder Bag 26 in chalk leather",
    chromeSample: "#e8e4df",
  },
  {
    id: "olive",
    name: "Olive",
    swatch: "/img/tabby25/thumbnails/cen52_b4z0g_a0.webp",
    hero: "/img/tabby25/ccx04_b4bk_a62.webp",
    heroAlt: "Tabby Shoulder Bag 26 in olive suede",
    chromeSample: "#556847",
  },
  {
    id: "mustard",
    name: "Mustard",
    swatch: "/img/tabby25/ccx04_b4bk_a8.webp",
    hero: "/img/tabby25/ccx04_b4bk_a8.webp",
    heroAlt: "Tabby Shoulder Bag 26 in mustard suede",
    chromeSample: "#c9a227",
  },
];

export const DEFAULT_COLOR_ID = "black";

/** Single product copy — hero and ATB sheet must match */
export const PDP_PRODUCT = {
  name: "Tabby 26",
  subtitle: PDP_PRODUCT_CARD.lineTwoLeft,
  price: PDP_PRODUCT_CARD.lineTwoRight,
  imageSrc: "/img/tabby25/ccx04_b4bk_a0.webp",
  imageAlt:
    "Tabby Shoulder Bag 26 in black quilted leather with gold C clasp and detachable straps",
} as const;

export type PdpBagUpsell = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

export const PDP_BAG_UPSELLS: PdpBagUpsell[] = [
  {
    id: "charm",
    name: "Cherry Bag Charm",
    price: "$45",
    imageSrc: "/img/tabby25/ccx04_b4bk_a88.webp",
    imageAlt: "Red cherry bag charm on gold chain",
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: "$68",
    imageSrc: "/img/tabby25/ccx04_b4bk_a92.webp",
    imageAlt: "Gold chain strap with leather weave detail",
  },
];

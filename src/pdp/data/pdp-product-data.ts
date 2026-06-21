import { PDP_PRODUCT_CARD } from "../pdp-media";

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
    swatch: "/img/tabby25/ccx04_b4bk_a0.webp",
    hero: "/img/tabby25/ccx04_b4bk_a0.webp",
    heroAlt: "Tabby Shoulder Bag 26 in black leather",
    chromeSample: "#1a1a1a",
  },
  {
    id: "canyon",
    name: "Canyon",
    swatch: "/img/tabby25/ccx04_b4bk_a10.webp",
    hero: "/img/tabby25/ccx04_b4bk_a10.webp",
    heroAlt: "Tabby Shoulder Bag 26 in canyon suede",
    chromeSample: "#a34e3d",
  },
  {
    id: "oxblood",
    name: "Oxblood",
    swatch: "/img/tabby25/ccx04_b4bk_a21.webp",
    hero: "/img/tabby25/ccx04_b4bk_a21.webp",
    heroAlt: "Tabby Shoulder Bag 26 in oxblood leather",
    chromeSample: "#6b2c32",
  },
  {
    id: "black-charm",
    name: "Black Charm",
    swatch: "/img/tabby25/ccx04_b4bk_a3.webp",
    hero: "/img/tabby25/ccx04_b4bk_a3.webp",
    heroAlt: "Tabby Shoulder Bag 26 in black with bag charms",
    chromeSample: "#1a1a1a",
  },
  {
    id: "beaded",
    name: "Beaded Floral",
    swatch: "/img/tabby25/ccx04_b4bk_a5.webp",
    hero: "/img/tabby25/ccx04_b4bk_a5.webp",
    heroAlt: "Tabby Shoulder Bag 26 in beaded floral",
    chromeSample: "#8a7a6a",
  },
  {
    id: "tan-fringe",
    name: "Tan Fringe",
    swatch: "/img/tabby25/ccx04_b4bk_a6.webp",
    hero: "/img/tabby25/ccx04_b4bk_a6.webp",
    heroAlt: "Tabby Shoulder Bag 26 in tan suede with fringe",
    chromeSample: "#c4a06a",
  },
  {
    id: "black-fringe",
    name: "Black Fringe",
    swatch: "/img/tabby25/ccx04_b4bk_a61.webp",
    hero: "/img/tabby25/ccx04_b4bk_a61.webp",
    heroAlt: "Tabby Shoulder Bag 26 in black suede with fringe",
    chromeSample: "#1a1a1a",
  },
  {
    id: "olive",
    name: "Olive",
    swatch: "/img/tabby25/ccx04_b4bk_a62.webp",
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

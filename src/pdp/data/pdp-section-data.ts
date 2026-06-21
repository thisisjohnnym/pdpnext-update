export type PdpProductHotspot = {
  id: string;
  x: number;
  y: number;
  title: string;
  body: string;
};

export const PDP_PRODUCT_HOTSPOTS: PdpProductHotspot[] = [
  {
    id: "c-clasp",
    x: 44,
    y: 66,
    title: "The iconic C",
    body: "Archival turn-lock DNA — the sculpted C clasp has defined Tabby since 2018.",
  },
  {
    id: "full-grain-leather",
    x: 58,
    y: 39,
    title: "Full-grain leather",
    body: "Genuine full-grain leather with a refined pebbled finish — structured, durable, and made to age beautifully.",
  },
  {
    id: "accordion-interior",
    x: 34,
    y: 17,
    title: "Accordion interior",
    body: "Three gusseted compartments expand to hold your everyday essentials without losing shape.",
  },
];

export type PdpImmersiveSlide = {
  type: "immersive";
  src: string;
  alt: string;
  objectPosition?: string;
  hotspots?: PdpProductHotspot[];
};

export const PDP_CAPACITY_ALT =
  "What fits inside Tabby Shoulder Bag 26";

export const PDP_UGC_VIDEOS = [
  {
    id: "ugc-lolalilylang",
    src: "/videos/ugc-lolalilylang.mp4",
    poster: "/images/reviews/ugc-lolalilylang.png",
    alt: "TikTok creator @lolalilylang styling Tabby Shoulder Bag 26",
    handle: "@lolalilylang",
    context: "Tabby styling",
    verified: true,
  },
  {
    id: "ugc-itsnani333",
    src: "/videos/ugc-itsnani333.mp4",
    poster: "/images/reviews/ugc-itsnani333.png",
    alt: "TikTok creator @itsnani333 styling Tabby Shoulder Bag 26",
    handle: "@itsnani333",
    context: "Tabby styling",
    verified: true,
  },
  {
    id: "ugc-katiemcev0y",
    src: "/videos/ugc-katiemcev0y.mp4",
    poster: "/images/reviews/ugc-katiemcev0y.png",
    alt: "TikTok creator @katiemcev0y styling Tabby Shoulder Bag 26",
    handle: "@katiemcev0y",
    context: "Tabby styling",
    verified: true,
  },
] as const;

export const PDP_UGC_FOLLOW = {
  label: "Follow us on TikTok",
  href: "https://www.tiktok.com/@coach",
} as const;

import {
  PDP_CAPACITY_ALT,
  PDP_PRODUCT_HOTSPOTS,
  PDP_UGC_FOLLOW,
  PDP_UGC_VIDEOS,
  type PdpImmersiveSlide,
} from "./data/pdp-section-data";

/** Deployed media — paths under public/ */
export const PDP_MEDIA = {
  heroVideo: "/video/tabby-hero.mp4",
  heroPoster: "/img/hero-poster.jpg",
  modelShot: "/img/tabby25/ccx04_b4bk_a62.webp",
  productShot: "/img/tabby25/ccx04_b4bk_a10.webp",
  wearPrimary: "/img/tabby25/ccx04_b4bk_a21.webp",
  wearSecondary: "/img/tabby25/ccx04_b4bk_a3.webp",
  capacityVideo: "/videos/what-fits-inside.mp4",
  capacityPoster: "/img/tabby25/ccx04_b4bk_a10.webp",
  spinVideo: "/video/spin-tabby25.mp4",
  spinPoster: "/img/tabby25/ccx04_b4bk_a0.webp",
  hotspotsImage: "/img/tabby25/ccx04_b4bk_a88.webp",
} as const;

/** Hero gallery stills — slides 2–14 (slide 1 is video; poster is separate) */
export const PDP_HERO_GALLERY_STILLS = [
  "/img/tabby25/ccx04_b4bk_a0.webp",
  "/img/tabby25/ccx04_b4bk_a10.webp",
  "/img/tabby25/ccx04_b4bk_a21.webp",
  "/img/tabby25/ccx04_b4bk_a3.webp",
  "/img/tabby25/ccx04_b4bk_a5.webp",
  "/img/tabby25/ccx04_b4bk_a6.webp",
  "/img/tabby25/ccx04_b4bk_a61.webp",
  "/img/tabby25/ccx04_b4bk_a62.webp",
  "/img/tabby25/ccx04_b4bk_a8.webp",
  "/img/tabby25/ccx04_b4bk_a88.webp",
  "/img/tabby25/ccx04_b4bk_a92.webp",
  "/img/tabby25/ccx04_b4bk_a99.webp",
  "/img/tabby25/en_US-ToroImg_ccx04_b4bk_a101.webp",
] as const;

export const PDP_HERO_GALLERY_SLIDE_COUNT =
  1 + PDP_HERO_GALLERY_STILLS.length;

export const PDP_PRODUCT_CARD = {
  lineOneLeft: "Tabby 26",
  lineOneRight: "— shoulder bag",
  lineTwoLeft: "w/ quilted leather",
  lineTwoRight: "$575",
  description: "Our signature shoulder bag\nin full-grain leather.",
} as const;

export const PDP_ZOOM_HINT = "Tap and hold to zoom in";

export const PDP_WAYS_TO_WEAR_CAPTION =
  "Shoulder or crossbody,\nyour call.";

export const PDP_CAPACITY_CAPTION =
  "Three compartments.\nRoom for the whole day,\nnever overstuffed.";

export const PDP_CAPACITY_CTA = {
  label: "See what fits inside",
  href: "#pdp-capacity",
} as const;

export const PDP_360_CAPTION =
  "See it from every angle — signature C clasp, detachable straps, and glovetanned leather throughout.";

export const PDP_HERO = {
  videoSrc: PDP_MEDIA.heroVideo,
  poster: PDP_MEDIA.heroPoster,
  objectPosition: "center 40%",
  alt: "Model carrying Tabby Shoulder Bag 26 on a city street",
} as const;

export const PDP_ASSETS = {
  model: {
    src: PDP_MEDIA.modelShot,
    alt: "Tabby Shoulder Bag 26 open, showing the leather-lined interior",
    objectPosition: "center top",
  },
  product: {
    src: PDP_MEDIA.productShot,
    alt: "Tabby Shoulder Bag 26 in black full-grain leather, front view",
    objectPosition: "center top",
  },
  overlapTopPx: 512,
  modelFramePx: 624,
  productHeightPx: 482,
  sectionHeightPx: 1182,
} as const;

export const PDP_WEAR_STYLES = [
  {
    id: "shoulder",
    label: "Shoulder carry",
    src: PDP_MEDIA.wearPrimary,
    alt: "Tabby worn on the shoulder",
  },
  {
    id: "crossbody",
    label: "Crossbody",
    src: PDP_MEDIA.wearSecondary,
    alt: "Tabby worn crossbody",
  },
] as const;

export const PDP_CAPACITY = {
  videoSrc: PDP_MEDIA.capacityVideo,
  poster: PDP_MEDIA.capacityPoster,
  alt: PDP_CAPACITY_ALT,
} as const;

export const PDP_360 = {
  videoSrc: PDP_MEDIA.spinVideo,
  poster: PDP_MEDIA.spinPoster,
  alt: "360° rotating view of Tabby Shoulder Bag 26",
} as const;

export const PDP_HOTSPOTS: PdpImmersiveSlide = {
  type: "immersive",
  src: PDP_MEDIA.hotspotsImage,
  alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and hardware",
  objectPosition: "center center",
  hotspots: PDP_PRODUCT_HOTSPOTS,
};

export const PDP_UGC = {
  heading: { primary: "Tabby 26", secondary: "— on TikTok" },
  followCta: {
    label: "Follow us",
    href: PDP_UGC_FOLLOW.href,
  },
  videos: PDP_UGC_VIDEOS,
} as const;

export const PDP_RAIL_COUNTS = {
  likes: "1.2M",
  chat: "128",
  share: "3.4k",
} as const;

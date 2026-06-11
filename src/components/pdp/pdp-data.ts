export const PDP_PRODUCT = {
  name: "Tabby Shoulder Bag 26",
  subtitle: "Our signature shoulder bag in full-grain leather.",
  price: "$550",
  imageSrc: "/images/gallery/tabby-leather-product-front.png",
  imageAlt:
    "Tabby Shoulder Bag 26 in black full-grain leather with gold C clasp and detachable straps",
} as const;

export type PdpBagUpsell = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

/** Upsells shown in the add-to-bag confirmation tray */
export const PDP_BAG_UPSELLS: PdpBagUpsell[] = [
  {
    id: "cherry-charm",
    name: "Cherry Bag Charm",
    price: "$45",
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Red cherry bag charm on gold chain",
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: "$68",
    imageSrc: "/images/gallery/tabby-leather-detail-hardware.png",
    imageAlt: "Gold chain strap with leather weave detail",
  },
  {
    id: "strap-extender",
    name: "Bag Strap Extender",
    price: "$38",
    imageSrc: "/images/gallery/tabby-leather-side-gusset.png",
    imageAlt: "Adjustable bag strap extender in black leather",
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: "$42",
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Gold heart bag charm on chain",
  },
  {
    id: "leather-key-ring",
    name: "Leather Key Ring",
    price: "$35",
    imageSrc: "/images/gallery/tabby-leather-back.png",
    imageAlt: "Black leather key ring with gold hardware",
  },
  {
    id: "card-case-clip",
    name: "Card Case & Clip",
    price: "$52",
    imageSrc: "/images/gallery/tabby-leather-interior-packed.png",
    imageAlt: "Compact card case with bag clip attachment",
  },
];

export type PdpBundleItem = {
  id: string;
  name: string;
  /** Whole-dollar price */
  price: number;
  imageSrc: string;
  imageAlt: string;
  defaultSelected?: boolean;
  /** Current PDP — always included in bundle */
  locked?: boolean;
};

export type PdpBundleAddPayload = {
  items: PdpBundleItem[];
  subtotal: number;
  total: number;
};

/** Multi-select bundle — Tabby + accessories */
export const PDP_BUNDLE_DISCOUNT = 0.1;

export const PDP_BUNDLE_ITEMS: PdpBundleItem[] = [
  {
    id: "tabby-26",
    name: PDP_PRODUCT.name,
    price: 550,
    imageSrc: PDP_PRODUCT.imageSrc,
    imageAlt: PDP_PRODUCT.imageAlt,
    defaultSelected: true,
    locked: true,
  },
  {
    id: "cherry-charm",
    name: "Cherry Bag Charm",
    price: 45,
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Red cherry bag charm on gold chain",
    defaultSelected: true,
  },
  {
    id: "chain-strap",
    name: "Signature Chain Strap",
    price: 68,
    imageSrc: "/images/gallery/tabby-leather-detail-hardware.png",
    imageAlt: "Gold chain strap with leather weave detail",
    defaultSelected: false,
  },
  {
    id: "heart-charm",
    name: "Heart Bag Charm",
    price: 42,
    imageSrc: "/images/gallery/tabby-leather-front-charm.png",
    imageAlt: "Gold heart bag charm on chain",
    defaultSelected: false,
  },
  {
    id: "card-case-clip",
    name: "Card Case & Clip",
    price: 52,
    imageSrc: "/images/gallery/tabby-leather-interior-packed.png",
    imageAlt: "Compact card case with bag clip attachment",
    defaultSelected: false,
  },
];

export type PdpBagSizeHotspot = {
  id: string;
  /** Horizontal position within the image frame (0–100) */
  x: number;
  /** Vertical position within the image frame (0–100) */
  y: number;
  label: string;
  title: string;
  body: string;
  fits: string[];
};

/** Interactive capacity explorer — tap hotspots on product shot */
export const PDP_BAG_SIZE = {
  title: "What fits inside",
  imageSrc: PDP_PRODUCT.imageSrc,
  imageAlt: PDP_PRODUCT.imageAlt,
  hotspots: [
    {
      id: "main",
      x: 38,
      y: 50,
      label: "Main compartment",
      title: "Main compartment",
      body: "Room for your everyday carry without feeling overstuffed.",
      fits: ["Phone", "Wallet", "Keys", "Sunglasses"],
    },
    {
      id: "size",
      x: 48,
      y: 42,
      label: "Bag size",
      title: "Tabby Shoulder Bag 26 dimensions",
      body: "Structured at a mid-size scale — roomy enough for daily essentials, compact enough for evenings out.",
      fits: ['10.5" wide', '6.5" tall', '3" deep'],
    },
    {
      id: "pocket",
      x: 62,
      y: 60,
      label: "Slip pocket",
      title: "Interior slip pocket",
      body: "Keep small items easy to grab on the go.",
      fits: ["Cards", "Lip balm", "AirPods"],
    },
  ] satisfies PdpBagSizeHotspot[],
} as const;

export type PdpSimilarItem = {
  id: string;
  name: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
};

export type PdpCompareMaterialSwatch = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type PdpCompareItem = PdpSimilarItem & {
  size: string;
  strap: string;
  /** Accessible label — paired with material swatch clip */
  material: string;
  materialSwatch: PdpCompareMaterialSwatch;
  closure: string;
};

export const PDP_COMPARE_CATEGORIES = [
  { id: "size", label: "Size" },
  { id: "strap", label: "Strap" },
  { id: "material", label: "Material" },
  { id: "closure", label: "Closure" },
] as const;

/** Current PDP item — pinned in the compare module */
export const PDP_COMPARE_SELECTED: PdpCompareItem = {
  id: "tabby-26",
  name: PDP_PRODUCT.name,
  price: PDP_PRODUCT.price,
  imageSrc: PDP_PRODUCT.imageSrc,
  imageAlt: PDP_PRODUCT.imageAlt,
  size: '10" W x 6" H x 3" D',
  strap: "Detachable leather",
  material: "Full-grain leather",
  materialSwatch: {
    src: "/images/gallery/tabby-leather-back.png",
    alt: "Close-up of full-grain pebbled leather texture",
    objectPosition: "center 45%",
  },
  closure: "C clasp turn-lock",
};

/** Alternatives shown beside the selected item in compare */
export const PDP_COMPARE_OPTIONS: PdpCompareItem[] = [
  {
    id: "tabby-20",
    name: "Tabby Shoulder Bag 20",
    price: "$495",
    imageSrc: "/images/gallery/tabby-angle.png",
    imageAlt: "Tabby Shoulder Bag 20 in black quilted leather",
    size: '8.5" W x 5" H x 2.5" D',
    strap: "Chain & leather",
    material: "Quilted leather",
    materialSwatch: {
      src: "/images/gallery/tabby-angle.png",
      alt: "Close-up of quilted leather texture",
      objectPosition: "center 55%",
    },
    closure: "C clasp turn-lock",
  },
  {
    id: "soft-tabby",
    name: "Soft Tabby Shoulder Bag",
    price: "$550",
    imageSrc: "/images/gallery/tabby-on-model-front.png",
    imageAlt: "Soft Tabby shoulder bag worn crossbody",
    size: '11" W x 7" H x 3" D',
    strap: "Leather shoulder",
    material: "Soft pebbled leather",
    materialSwatch: {
      src: "/images/gallery/tabby-on-model-front.png",
      alt: "Close-up of soft pebbled leather texture",
      objectPosition: "center 72%",
    },
    closure: "Magnetic snap",
  },
  {
    id: "tabby-chain",
    name: "Tabby Chain Crossbody",
    price: "$425",
    imageSrc: "/images/gallery/tabby-front-charm.png",
    imageAlt: "Tabby chain crossbody with gold hardware",
    size: '9" W x 6" H x 2" D',
    strap: "Chain crossbody",
    material: "Smooth leather",
    materialSwatch: {
      src: "/images/gallery/tabby-front-charm.png",
      alt: "Close-up of smooth leather texture",
      objectPosition: "center 55%",
    },
    closure: "Turn-lock clasp",
  },
  {
    id: "pillow-tabby",
    name: "Pillow Tabby Shoulder Bag",
    price: "$595",
    imageSrc: "/images/gallery/tabby-back.png",
    imageAlt: "Pillow Tabby shoulder bag back view",
    size: '10.5" W x 6.5" H x 3" D',
    strap: "Chain & leather",
    material: "Pillow-quilted leather",
    materialSwatch: {
      src: "/images/gallery/tabby-back.png",
      alt: "Close-up of pillow-quilted leather texture",
      objectPosition: "center 50%",
    },
    closure: "C clasp turn-lock",
  },
];

/** Recommendation carousel — similar bags below gallery */
export const PDP_SIMILAR_ITEMS: PdpSimilarItem[] = [
  {
    id: "tabby-20",
    name: "Tabby Shoulder Bag 20",
    price: "$495",
    imageSrc: "/images/gallery/tabby-angle.png",
    imageAlt: "Tabby Shoulder Bag 20 in black quilted leather",
  },
  {
    id: "soft-tabby",
    name: "Soft Tabby Shoulder Bag",
    price: "$550",
    imageSrc: "/images/gallery/tabby-on-model-front.png",
    imageAlt: "Soft Tabby shoulder bag worn crossbody",
  },
  {
    id: "tabby-chain",
    name: "Tabby Chain Crossbody",
    price: "$425",
    imageSrc: "/images/gallery/tabby-front-charm.png",
    imageAlt: "Tabby chain crossbody with gold hardware",
  },
  {
    id: "pillow-tabby",
    name: "Pillow Tabby Shoulder Bag",
    price: "$595",
    imageSrc: "/images/gallery/tabby-back.png",
    imageAlt: "Pillow Tabby shoulder bag back view",
  },
  {
    id: "tabby-wristlet",
    name: "Tabby Wristlet",
    price: "$195",
    imageSrc: "/images/gallery/tabby-detail-clasp.png",
    imageAlt: "Tabby wristlet with C clasp detail",
  },
  {
    id: "quilted-tabby",
    name: "Quilted Tabby Tote",
    price: "$650",
    imageSrc: "/images/gallery/tabby-on-model-plaid.png",
    imageAlt: "Quilted Tabby tote styled on model",
  },
];

export type PdpRecentlyViewedItem = PdpSimilarItem & {
  viewedLabel: string;
};

/** Browsing history rail — portrait cards with relative time */
export const PDP_RECENTLY_VIEWED: PdpRecentlyViewedItem[] = [
  {
    id: "rowan-satchel",
    name: "Rowan Satchel",
    price: "$395",
    imageSrc: "/images/gallery/tabby-on-model-plaid.png",
    imageAlt: "Rowan satchel styled on model",
    viewedLabel: "Today",
  },
  {
    id: "brooklyn-shoulder",
    name: "Brooklyn Shoulder Bag 34",
    price: "$450",
    imageSrc: "/images/gallery/tabby-patio-pink-dress.png",
    imageAlt: "Brooklyn shoulder bag on model",
    viewedLabel: "Yesterday",
  },
  {
    id: "kira-crossbody",
    name: "Kira Crossbody",
    price: "$298",
    imageSrc: "/images/gallery/tabby-on-model-back.png",
    imageAlt: "Kira crossbody bag on model",
    viewedLabel: "2 days ago",
  },
  {
    id: "morgan-hobo",
    name: "Morgan Hobo",
    price: "$425",
    imageSrc: "/images/gallery/tabby-hero-model.png",
    imageAlt: "Morgan hobo bag on model",
    viewedLabel: "Last week",
  },
  {
    id: "field-tote",
    name: "Field Tote 40",
    price: "$495",
    imageSrc: "/images/gallery/tabby-model-full.png",
    imageAlt: "Field tote styled with denim",
    viewedLabel: "Last week",
  },
];

/** Bottom-of-page AI assistant — prompt + suggested starters */
export const PDP_PRODUCT_SEARCH = {
  title: "Something else on your mind?",
  placeholder: "Ask me anything — styling, sizing, gifts, similar bags…",
  suggestions: [
    "Show me more Tabby styles like this",
    "What's a good crossbody for everyday?",
    "What charms would look good on this bag?",
    "What's new this season?",
    "Help me find a shoulder bag for work",
  ],
} as const;

/** Gallery hero — 9:16 TikTok-style lifestyle shot */
export const PDP_GALLERY_HERO_IMAGE = "/images/gallery/4k-hero1.png";

/** Hero framing — native 9:16 asset, centered cover fill */
export const PDP_GALLERY_HERO_IMAGE_FOCUS = {
  objectPosition: "center center",
  scale: 1,
  translateY: "0%",
} as const;

/** Full-bleed rotating product video for Gallery tab */
export const PDP_GALLERY_HERO_VIDEO = "/videos/soft-tabby-360.webm";

/** Capacity showcase — what fits inside the bag */
export const PDP_GALLERY_WHAT_FITS_INSIDE_VIDEO = "/videos/what-fits-inside.webm";

/** Highlight montage — styling, details, and product moments */
export const PDP_GALLERY_SHOWCASE_VIDEO = "/videos/soft-tabby-showcase.webm";

/** Match studio backdrop so letterboxing feels seamless */
export const PDP_GALLERY_VIDEO_BG = "#e9e9e9";

export type PdpProductHotspot = {
  id: string;
  /** Horizontal position within the image frame (0–100) */
  x: number;
  /** Vertical position within the image frame (0–100) */
  y: number;
  title: string;
  body: string;
};

/** Detail hotspots — quilt close-up studio shot */
export const PDP_PRODUCT_IMMERSIVE_HOTSPOTS: PdpProductHotspot[] = [
  {
    id: "c-clasp",
    x: 50,
    y: 62,
    title: "The iconic C",
    body: "Inspired by a turn-lock from Coach archives, the sculpted C clasp became Tabby's signature when the silhouette returned in 2018.",
  },
  {
    id: "full-grain-leather",
    x: 50,
    y: 38,
    title: "Full-grain leather",
    body: "Genuine full-grain leather with a refined pebbled finish — structured, durable, and made to age beautifully.",
  },
  {
    id: "accordion-interior",
    x: 50,
    y: 16,
    title: "Accordion interior",
    body: "Three gusseted compartments expand to hold your everyday essentials without losing shape.",
  },
];

export type PdpInfluencerCredit = {
  handle: string;
  profileUrl: string;
  platform: "instagram" | "tiktok";
};

export type PdpGalleryImmersiveSlide = {
  type: "immersive";
  src: string;
  alt: string;
  shopTheLookId?: string;
  influencer?: PdpInfluencerCredit;
  /** 12px white inset — matches grid margin; only for select lifestyle shots */
  insetMargins?: boolean;
  /** Image focal point within 4:5 crop */
  objectPosition?: string;
  scale?: string;
  hotspots?: PdpProductHotspot[];
};

export type PdpGalleryEditorialSlide = {
  type: "editorial";
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
  secondarySrc?: string;
  secondaryAlt?: string;
  learnMore?: {
    label: string;
    href: string;
  };
};

export type PdpGalleryVideoSlide = {
  type: "video";
  src: string;
  poster?: string;
  alt: string;
  /** Hide mute toggle — 360 spins are silent by default */
  showMuteControl?: boolean;
  /** Frame ratio — 9:16 for TikTok-style clips, 4:5 for product spins */
  aspect?: "4/5" | "9/16";
};

export type PdpGallerySlide =
  | PdpGalleryImmersiveSlide
  | PdpGalleryEditorialSlide
  | PdpGalleryVideoSlide;

/** First portrait below hero — lifestyle follow-up */
export const PDP_GALLERY_HERO_FOLLOWUP_IMAGE =
  "/images/gallery/tabby-leather-on-model-laugh.png";

/** Product hero — front view with charm (posters, compare, hotspots) */
export const PDP_GALLERY_PRODUCT_IMMERSIVE =
  "/images/gallery/tabby-leather-front-charm.png";

/** Lead product shot — first frame below hero */
export const PDP_GALLERY_PRODUCT_FRONT_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/tabby-leather-product-front.png",
  alt: "Tabby Shoulder Bag 26 in black full-grain leather, front view with gold C clasp and detachable straps",
  objectPosition: "center 62%",
};

/** On-model — second frame below hero */
export const PDP_GALLERY_ON_MODEL_DENIM_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/tabby-leather-on-model-tee.png",
  alt: "Model wearing Tabby Shoulder Bag 26 crossbody with a Coach tee and suede mini skirt",
  objectPosition: "center top",
};

/** Full-length on-model — third frame below hero */
export const PDP_GALLERY_ON_MODEL_FULL_DENIM_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/tabby-leather-on-model-trench.png",
  alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat and plaid mini skirt",
  objectPosition: "center top",
};

/** Interior open — fourth frame below hero */
export const PDP_GALLERY_INTERIOR_OPEN_SLIDE: PdpGalleryImmersiveSlide = {
  type: "immersive",
  src: "/images/gallery/tabby-leather-interior-open.png",
  alt: "Tabby Shoulder Bag 26 interior open showing accordion compartments and gold hardware",
  objectPosition: "center center",
};

/** Capacity editorial break — what fits inside */
export const PDP_GALLERY_CAPACITY_EDITORIAL_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  src: "/images/gallery/tabby-leather-interior-packed.png",
  alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, AirPods, and essentials",
  objectPosition: "center center",
  caption:
    "Designed for every day. Tabby 26's accordion interior holds your phone, wallet, keys, AirPods, and a few extras — organized across three compartments without feeling overstuffed.",
};

/** Craftsmanship editorial break — glovetanned leather story */
export const PDP_GALLERY_EDITORIAL_SLIDE: PdpGalleryEditorialSlide = {
  type: "editorial",
  src: "/images/gallery/tabby-leather-detail-hardware.png",
  alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp hardware",
  caption:
    "Crafted in glovetanned full-grain leather, Tabby 26 is defined by its richness, softness, and enduring character. Finished with signature hardware and meticulous detailing, every element reflects the craftsmanship at the heart of Coach.",
};

/** Standard studio + on-model product photography */
export const PDP_GALLERY_PRODUCT_SHOTS: PdpGalleryImmersiveSlide[] = [
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-front-charm.png",
    alt: "Tabby Shoulder Bag 26 front view with gold C clasp, leather straps, and cherry charm",
    objectPosition: "center 78%",
    scale: "scale-100",
  },
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-back-angle.png",
    alt: "Tabby Shoulder Bag 26 back view at an angle showing pebbled leather and zip pocket",
    objectPosition: "center 62%",
  },
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-back.png",
    alt: "Tabby Shoulder Bag 26 straight back view with zip pocket and leather straps",
    objectPosition: "center 58%",
  },
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-side-gusset.png",
    alt: "Tabby Shoulder Bag 26 side view showing accordion gussets and gold C clasp",
    objectPosition: "center center",
  },
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather, gold C clasp, and accordion interior",
    objectPosition: "center center",
    hotspots: PDP_PRODUCT_IMMERSIVE_HOTSPOTS,
  },
];

/** Tabby Shoulder Bag 26 gallery — product front, on-model, editorial, interiors, video, lifestyle, product shots */
export const PDP_GALLERY_SLIDES: PdpGallerySlide[] = [
  PDP_GALLERY_PRODUCT_FRONT_SLIDE,
  PDP_GALLERY_ON_MODEL_DENIM_SLIDE,
  PDP_GALLERY_EDITORIAL_SLIDE,
  PDP_GALLERY_ON_MODEL_FULL_DENIM_SLIDE,
  PDP_GALLERY_INTERIOR_OPEN_SLIDE,
  PDP_GALLERY_CAPACITY_EDITORIAL_SLIDE,
  {
    type: "video",
    src: PDP_GALLERY_WHAT_FITS_INSIDE_VIDEO,
    poster: "/images/gallery/tabby-leather-interior-packed.png",
    alt: "What fits inside Tabby Shoulder Bag 26",
  },
  {
    type: "video",
    src: PDP_GALLERY_HERO_VIDEO,
    poster: PDP_GALLERY_PRODUCT_IMMERSIVE,
    alt: "360° rotating view of Tabby Shoulder Bag 26",
    showMuteControl: false,
  },
  {
    type: "immersive",
    src: "/images/gallery/tabby-leather-on-model-trench.png",
    alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat and plaid mini skirt",
    shopTheLookId: "trench-daytime",
  },
  {
    type: "video",
    src: PDP_GALLERY_SHOWCASE_VIDEO,
    poster: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Tabby Shoulder Bag 26 highlight montage",
    aspect: "9/16",
  },
  ...PDP_GALLERY_PRODUCT_SHOTS,
  {
    type: "immersive",
    src: PDP_GALLERY_HERO_FOLLOWUP_IMAGE,
    alt: "Model in a tan trench coat and plaid skirt carrying Tabby Shoulder Bag 26",
  },
];

export type PdpGalleryPhoto = {
  id: string;
  src: string;
  alt: string;
};

/** Extended gallery — opened from the bottom "View more photos" affordance */
export const PDP_GALLERY_MORE_PHOTOS: PdpGalleryPhoto[] = [
  {
    id: "on-model-tee",
    src: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Model wearing Tabby Shoulder Bag 26 with a Coach tee and suede mini skirt",
  },
  {
    id: "on-model-trench",
    src: "/images/gallery/tabby-leather-on-model-trench.png",
    alt: "Model wearing Tabby Shoulder Bag 26 with a tan trench coat and plaid mini skirt",
  },
  {
    id: "on-model-laugh",
    src: "/images/gallery/tabby-leather-on-model-laugh.png",
    alt: "Model laughing while wearing Tabby Shoulder Bag 26 with a trench coat and plaid skirt",
  },
  {
    id: "interior-open",
    src: "/images/gallery/tabby-leather-interior-open.png",
    alt: "Tabby Shoulder Bag 26 interior open with accordion compartments and gold hardware",
  },
  {
    id: "interior-packed",
    src: "/images/gallery/tabby-leather-interior-packed.png",
    alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, and everyday essentials",
  },
  {
    id: "product-front",
    src: "/images/gallery/tabby-leather-product-front.png",
    alt: "Tabby Shoulder Bag 26 in black full-grain leather, front view",
  },
  {
    id: "front-charm",
    src: "/images/gallery/tabby-leather-front-charm.png",
    alt: "Tabby Shoulder Bag 26 front view with gold C clasp and cherry charm",
  },
  {
    id: "back-angle",
    src: "/images/gallery/tabby-leather-back-angle.png",
    alt: "Tabby Shoulder Bag 26 back view at an angle",
  },
  {
    id: "back",
    src: "/images/gallery/tabby-leather-back.png",
    alt: "Tabby Shoulder Bag 26 straight back view with zip pocket",
  },
  {
    id: "side-gusset",
    src: "/images/gallery/tabby-leather-side-gusset.png",
    alt: "Tabby Shoulder Bag 26 side view showing accordion gussets",
  },
  {
    id: "detail-hardware",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp",
  },
  {
    id: "product-alt",
    src: "/images/gallery/tabby-leather-product-alt.png",
    alt: "Tabby Shoulder Bag 26 alternate front product shot",
  },
];

export type PdpShopTheLookItem = {
  id: string;
  name: string;
  price: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

export type PdpShopTheLookLook = {
  id: string;
  title: string;
  items: PdpShopTheLookItem[];
};

export const PDP_SHOP_THE_LOOK: Record<string, PdpShopTheLookLook> = {
  "trench-daytime": {
    id: "trench-daytime",
    title: "Shop the look",
    items: [
      {
        id: "tabby-26",
        name: "Tabby Shoulder Bag 26",
        price: "$550",
        href: "https://www.coach.com/shop/women/bags/shoulder-bags/tabby-shoulder-bag/CCZ47.html",
        imageSrc: "/images/gallery/tabby-leather-front-charm.png",
        imageAlt: "Tabby Shoulder Bag 26 in black full-grain leather",
      },
      {
        id: "trench-coat",
        name: "Heritage Trench Coat",
        price: "$695",
        href: "https://www.coach.com/shop/women/ready-to-wear/coats",
        imageSrc: "/images/gallery/tabby-leather-on-model-trench.png",
        imageAlt: "Tan trench coat with leather trim",
      },
      {
        id: "plaid-skirt",
        name: "Plaid Pleated Mini Skirt",
        price: "$225",
        href: "https://www.coach.com/shop/women/ready-to-wear/skirts",
        imageSrc: "/images/gallery/tabby-leather-on-model-laugh.png",
        imageAlt: "Brown plaid pleated mini skirt",
      },
      {
        id: "essential-tee",
        name: "Essential Cotton Tee",
        price: "$75",
        href: "https://www.coach.com/shop/women/ready-to-wear/tops",
        imageSrc: "/images/gallery/tabby-leather-on-model-tee.png",
        imageAlt: "Grey cotton tee with Coach logo",
      },
      {
        id: "hoop-earring",
        name: "Gold Hoop Earring",
        price: "$85",
        href: "https://www.coach.com/shop/women/jewelry/earrings",
        imageSrc: "/images/gallery/tabby-leather-on-model-laugh.png",
        imageAlt: "Gold hoop earring",
      },
    ],
  },
};

/** Editorial — everyday carry capacity */
export const PDP_EVERYDAY_CARRY = {
  src: "/images/gallery/tabby-leather-interior-packed.png",
  alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, keys, and everyday essentials",
  caption:
    "Designed for every day. Tabby comfortably fits your phone, wallet, keys, sunglasses, and a few essentials.",
} as const;

export type PdpWearStyle = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

/** Moment #3 — styling validation */
export const PDP_HOW_TO_WEAR = {
  moment: "Moment #3",
  title: "How to wear it",
  caption: "One icon, multiple ways to wear it.",
  styles: [
    {
      id: "shoulder",
      label: "Shoulder carry",
      src: "/images/gallery/tabby-leather-on-model-tee.png",
      alt: "Tabby Shoulder Bag 26 worn on the shoulder",
    },
    {
      id: "crossbody",
      label: "Crossbody",
      src: "/images/gallery/tabby-leather-on-model-trench.png",
      alt: "Tabby Shoulder Bag 26 worn crossbody with a trench coat",
    },
    {
      id: "tucked-chain",
      label: "Strap detail",
      src: "/images/gallery/tabby-leather-product-alt.png",
      alt: "Tabby Shoulder Bag 26 with detachable leather strap detail",
    },
    {
      id: "dressed-up",
      label: "Dressed up",
      src: "/images/gallery/tabby-leather-on-model-laugh.png",
      alt: "Tabby Shoulder Bag 26 styled with a trench coat and plaid skirt",
    },
    {
      id: "casual-denim",
      label: "Coach tee",
      src: "/images/gallery/tabby-leather-on-model-tee.png",
      alt: "Tabby Shoulder Bag 26 with a Coach logo tee and suede skirt",
    },
  ] satisfies PdpWearStyle[],
} as const;

export type PdpMaterialDetail = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

/** Craftsmanship editorial — Material Story follows this slide */
export const PDP_CRAFTSMANSHIP_EDITORIAL_SRC =
  "/images/gallery/tabby-leather-front-charm.png";

/** Moment #4 — material & construction details */
export const PDP_MATERIAL_STORY = {
  moment: "Moment #4",
  title: "Material story",
  caption:
    "Full-grain leather and accordion construction define Tabby's structured finish.",
  details: [
    {
      id: "gusset",
      label: "Accordion gusset",
      src: "/images/gallery/tabby-leather-side-gusset.png",
      alt: "Close crop of Tabby Shoulder Bag 26 accordion gussets",
    },
    {
      id: "leather",
      label: "Macro leather texture",
      src: "/images/gallery/tabby-leather-back.png",
      alt: "Macro full-grain leather texture on Tabby Shoulder Bag 26",
    },
    {
      id: "hardware",
      label: "Hardware detail",
      src: "/images/gallery/tabby-leather-detail-hardware.png",
      alt: "Gold hardware detail on Tabby Shoulder Bag 26 C clasp",
    },
  ] satisfies PdpMaterialDetail[],
} as const;

/** Moment #5 — brand heritage */
export const PDP_HERITAGE_STORY = {
  moment: "Moment #5",
  title: "Heritage story",
  src: "/images/gallery/tabby-leather-front-charm.png",
  alt: "Tabby Shoulder Bag 26 — a Coach icon reimagined for today",
  caption:
    "Inspired by a Coach design from the 1970s and reimagined for today.",
} as const;

export type PdpColor = {
  id: string;
  name: string;
  swatch: string;
  hero: string;
  heroAlt: string;
};

export const PDP_COLORS: PdpColor[] = [
  {
    id: "black",
    name: "Black",
    swatch: "/images/colors/soft-tabby/black.png",
    hero: "/images/colors/soft-tabby/black.png",
    heroAlt: "Tabby Shoulder Bag 26 in black leather",
  },
  {
    id: "canyon",
    name: "Canyon",
    swatch: "/images/colors/soft-tabby/canyon.png",
    hero: "/images/colors/soft-tabby/canyon.png",
    heroAlt: "Tabby Shoulder Bag 26 in canyon suede",
  },
  {
    id: "oxblood",
    name: "Oxblood",
    swatch: "/images/colors/soft-tabby/oxblood.png",
    hero: "/images/colors/soft-tabby/oxblood.png",
    heroAlt: "Tabby Shoulder Bag 26 in oxblood leather",
  },
  {
    id: "black-charm",
    name: "Black Charm",
    swatch: "/images/colors/soft-tabby/black-charm.png",
    hero: "/images/colors/soft-tabby/black-charm.png",
    heroAlt: "Tabby Shoulder Bag 26 in black with bag charms",
  },
  {
    id: "beaded",
    name: "Beaded Floral",
    swatch: "/images/colors/soft-tabby/beaded.png",
    hero: "/images/colors/soft-tabby/beaded.png",
    heroAlt: "Tabby Shoulder Bag 26 in beaded floral",
  },
  {
    id: "tan-fringe",
    name: "Tan Fringe",
    swatch: "/images/colors/soft-tabby/tan-fringe.png",
    hero: "/images/colors/soft-tabby/tan-fringe.png",
    heroAlt: "Tabby Shoulder Bag 26 in tan suede with fringe",
  },
  {
    id: "black-fringe",
    name: "Black Fringe",
    swatch: "/images/colors/soft-tabby/black-fringe.png",
    hero: "/images/colors/soft-tabby/black-fringe.png",
    heroAlt: "Tabby Shoulder Bag 26 in black suede with fringe",
  },
  {
    id: "olive",
    name: "Olive",
    swatch: "/images/colors/soft-tabby/olive.png",
    hero: "/images/colors/soft-tabby/olive.png",
    heroAlt: "Tabby Shoulder Bag 26 in olive suede",
  },
  {
    id: "mustard",
    name: "Mustard",
    swatch: "/images/colors/soft-tabby/mustard.png",
    hero: "/images/colors/soft-tabby/mustard.png",
    heroAlt: "Tabby Shoulder Bag 26 in mustard suede",
  },
];

export const PDP_MEDIA_SLIDES = [
  {
    src: "/images/gallery/tabby-leather-on-model-trench.png",
    alt: "Model wearing Tabby Shoulder Bag 26 in black full-grain leather",
  },
  {
    src: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Tabby Shoulder Bag 26 styled on model",
  },
  {
    src: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80",
    alt: "Handbag product detail",
  },
  {
    src: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
    alt: "Coach bag on model",
  },
  {
    src: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=80",
    alt: "Luxury handbag lifestyle shot",
  },
] as const;

export const DEFAULT_COLOR_ID = "black";

export type PdpCommunityMediaItem = {
  id: string;
  label: string;
  type: "photo" | "video";
  src: string;
  alt: string;
  poster?: string;
};

/** Moment #6 — community validation (replaces star-rating reviews) */
export const PDP_COMMUNITY_VALIDATION = {
  moment: "Moment #6",
  title: "Community validation",
  caption: "See how the community styles Tabby.",
  items: [
    {
      id: "customer-photo",
      label: "Real customer photo",
      type: "photo",
      src: "/images/reviews/ugc-on-street.png",
      alt: "Customer styling Tabby Shoulder Bag 26 on the street",
    },
    {
      id: "creator-video",
      label: "Creator styling video",
      type: "video",
      src: "/videos/gallery-360.webm",
      poster: "/images/gallery/hero-modelshot.png",
      alt: "Creator styling Tabby Shoulder Bag 26 in a short video",
    },
    {
      id: "influencer-clip",
      label: "Influencer clip",
      type: "video",
      src: "/videos/gallery-360.webm",
      poster: "/images/gallery/tabby-model-full.png",
      alt: "Influencer clip featuring Tabby Shoulder Bag 26",
    },
  ] satisfies PdpCommunityMediaItem[],
} as const;

export type PdpReviewPhoto = {
  src: string;
  alt: string;
};

export type PdpFeaturedReview = {
  id: string;
  rating: number;
  quote: string;
  author: string;
  date: string;
  verified?: boolean;
  photos?: PdpReviewPhoto[];
  likes: number;
};

export const PDP_CUSTOMER_REVIEWS: PdpFeaturedReview[] = [
  {
    id: "maren",
    rating: 5,
    quote:
      "The perfect everyday bag — fits everything I need without feeling bulky. The quilting feels luxe in person and the gold hardware catches the light beautifully.",
    author: "Maren K.",
    date: "Oct 12, 2025",
    verified: true,
    likes: 42,
  },
  {
    id: "jules",
    rating: 5,
    quote:
      "Wore this on a weekend trip and it held up beautifully. Strap sits comfortably crossbody all day and the flap stays secure.",
    author: "Jules T.",
    date: "Sep 28, 2025",
    verified: true,
    likes: 28,
    photos: [
      {
        src: "/images/reviews/ugc-coffee-run.png",
        alt: "Customer photo of Tabby Shoulder Bag 26 styled with a plaid coat",
      },
    ],
  },
  {
    id: "priya",
    rating: 5,
    quote:
      "Obsessed with the leather finish — photos do not do it justice. Looks elevated with denim and dresses alike.",
    author: "Priya S.",
    date: "Sep 14, 2025",
    verified: true,
    likes: 56,
    photos: [
      {
        src: "/images/reviews/ugc-on-street.png",
        alt: "Customer photo of Tabby Shoulder Bag 26 styled with a tan jacket",
      },
      {
        src: "/images/reviews/ugc-outfit-flat.png",
        alt: "Customer outfit photo featuring Tabby Shoulder Bag 26",
      },
    ],
  },
  {
    id: "elena",
    rating: 4,
    quote:
      "Beautiful craftsmanship and the C clasp feels substantial. Wish the interior pocket were slightly larger, but still my go-to bag.",
    author: "Elena R.",
    date: "Aug 30, 2025",
    verified: true,
    likes: 19,
    photos: [
      {
        src: "/images/reviews/ugc-mirror-selfie.png",
        alt: "Customer mirror selfie with Tabby Shoulder Bag 26",
      },
    ],
  },
  {
    id: "danielle",
    rating: 5,
    quote:
      "Finally a bag that fits my phone, wallet, keys, and sunglasses without looking overstuffed. The chain strap is the perfect length.",
    author: "Danielle M.",
    date: "Aug 18, 2025",
    verified: true,
    likes: 34,
  },
  {
    id: "sofia",
    rating: 5,
    quote:
      "Got the black colorway and it goes with literally everything. Leather has a soft hand-feel but holds its shape well.",
    author: "Sofia L.",
    date: "Jul 22, 2025",
    verified: true,
    likes: 21,
  },
  {
    id: "hannah",
    rating: 5,
    quote:
      "Bought this as a treat-yourself purchase and zero regrets. The cherry charm pairing is so fun — already getting compliments.",
    author: "Hannah W.",
    date: "Jul 9, 2025",
    verified: true,
    likes: 47,
    photos: [
      {
        src: "/images/reviews/ugc-outfit-flat.png",
        alt: "Customer outfit photo featuring Tabby Shoulder Bag 26 with cherry charm",
      },
    ],
  },
  {
    id: "taylor",
    rating: 4,
    quote:
      "Classic Tabby silhouette with a modern leather update. Straps are easy to swap between shoulder and crossbody carry.",
    author: "Taylor B.",
    date: "Jun 25, 2025",
    verified: true,
    likes: 15,
  },
  {
    id: "nicole",
    rating: 5,
    quote:
      "Transitioned from a larger tote and this size is ideal for daily errands. Quality is what you expect from Coach.",
    author: "Nicole A.",
    date: "Jun 3, 2025",
    verified: true,
    likes: 38,
  },
  {
    id: "rachel",
    rating: 5,
    quote:
      "The gold hardware against the black leather is stunning. Interior lining feels durable and wipes clean easily.",
    author: "Rachel P.",
    date: "May 19, 2025",
    verified: true,
    likes: 31,
    photos: [
      {
        src: "/images/reviews/ugc-on-street.png",
        alt: "Customer street-style photo with Tabby Shoulder Bag 26",
      },
    ],
  },
  {
    id: "amanda",
    rating: 4,
    quote:
      "Lovely bag overall. Arrived quickly and packaged well. Strap length works for shoulder or crossbody on my frame (5'6\").",
    author: "Amanda C.",
    date: "May 2, 2025",
    verified: true,
    likes: 12,
  },
  {
    id: "lily",
    rating: 5,
    quote:
      "This has become my default going-out bag. Structured enough for evenings, relaxed enough for daytime coffee runs.",
    author: "Lily H.",
    date: "Apr 14, 2025",
    verified: true,
    likes: 26,
  },
];

export const PDP_FEATURED_REVIEWS = PDP_CUSTOMER_REVIEWS.slice(0, 2);

export const PDP_REVIEWS_SUMMARY = {
  average: 4.8,
  count: 128,
  recommendPercent: 94,
} as const;

export const PDP_LIKE_SUMMARY = {
  count: 100_000,
  label: "100k",
} as const;

export const PDP_SAVE_SUMMARY = {
  count: 3_396,
  label: "3.4k",
} as const;

export const PDP_COMMENTS_SUMMARY = {
  count: 128,
  label: "128",
} as const;

export const PDP_REVIEWS_AI_SUMMARY = {
  headline: "What our customers think",
  body: "Many note that Tabby Shoulder Bag 26 is a refined, well-crafted bag that strikes an appealing balance between structure and style. The full-grain pebbled leather and signature C clasp stand out as premium touches.",
  attribution: "Buyer highlights, summarized by AI",
} as const;

export const PDP_REVIEWS_RATING_BREAKDOWN = [
  { stars: 5, percent: 84 },
  { stars: 4, percent: 8 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
] as const;

/** Customer-uploaded photos — editorial UGC strip */
export const PDP_REVIEW_PHOTOS: PdpReviewPhoto[] = [
  {
    src: "/images/reviews/ugc-on-street.png",
    alt: "Customer photo of Tabby Shoulder Bag 26 styled with a tan jacket",
  },
  {
    src: "/images/reviews/ugc-coffee-run.png",
    alt: "Customer photo of Tabby Shoulder Bag 26 with plaid coat",
  },
  {
    src: "/images/reviews/ugc-mirror-selfie.png",
    alt: "Customer mirror selfie with Tabby Shoulder Bag 26",
  },
  {
    src: "/images/reviews/ugc-outfit-flat.png",
    alt: "Customer outfit photo featuring Tabby Shoulder Bag 26",
  },
];


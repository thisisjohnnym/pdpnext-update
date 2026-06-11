"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";
import { PdpGalleryEditorialSlide } from "./pdp-gallery-editorial-slide";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { PdpGalleryPhotosSheet } from "./pdp-gallery-photos-sheet";
import { PdpGalleryProductHud } from "./pdp-gallery-product-hud";
import { PdpGalleryViewMorePhotos } from "./pdp-gallery-view-more-photos";
import { PdpProductHotspots } from "./pdp-product-hotspots";
import { PdpBundleModule } from "./pdp-bundle-module";
import { PdpCompareModule } from "./pdp-compare-module";
import { PdpProductSearchModule } from "./pdp-product-search-module";
import { PdpRecentlyViewedCarousel } from "./pdp-recently-viewed-carousel";
import { PdpReviewsModule } from "./pdp-reviews-module";
import { PdpSimilarItemsCarousel } from "./pdp-similar-items-carousel";
import { PdpShopTheLookSheet } from "./pdp-shop-the-look-sheet";
import {
  PDP_GALLERY_HERO_IMAGE,
  PDP_GALLERY_HERO_IMAGE_FOCUS,
  PDP_GALLERY_SLIDES,
  PDP_SHOP_THE_LOOK,
} from "./pdp-data";
import type { PdpBundleAddPayload, PdpInfluencerCredit, PdpProductHotspot } from "./pdp-data";
import { pdpType } from "./pdp-type";

/** Space for fixed bottom CTAs (54px button + pt-2.5 + safe area + browser chrome) */
export const BOTTOM_CTA_OFFSET =
  "calc(54px + 0.625rem + env(safe-area-inset-bottom, 0px) + var(--pdp-browser-bottom-inset, 0px))";

const GALLERY_CLASS = "w-full";

/** Reserve scroll space so modules aren't hidden behind the fixed bottom bar */
const GALLERY_SCROLL_PAD = {
  paddingBottom:
    "calc(54px + 0.625rem + env(safe-area-inset-bottom, 0px) + var(--pdp-browser-bottom-inset, 0px))",
} as const;

/** Suit Supply-style hairline between stacked full-bleed gallery frames */
const GALLERY_MEDIA_STACK_CLASS = "flex flex-col gap-[2px] bg-white";

/** Tracks visible viewport — avoids dvh gaps when mobile browser chrome shifts */
const HERO_VIEWPORT_STYLE = {
  height: "var(--pdp-viewport-height, 100dvh)",
  minHeight: "var(--pdp-viewport-height, 100dvh)",
} as const;

/** Hero only — full-viewport immersive with product HUD */
function PdpHeroSlide({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <section
      className="relative w-full shrink-0 overflow-hidden bg-black"
      style={HERO_VIEWPORT_STYLE}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover object-center scale-[1.02]"
        style={{
          objectPosition: PDP_GALLERY_HERO_IMAGE_FOCUS.objectPosition,
        }}
        sizes="100vw"
      />

      <PdpGalleryProductHud />
    </section>
  );
}

type PdpGalleryPortraitSlideProps = {
  src: string;
  alt: string;
  priority?: boolean;
  scale?: string;
  insetMargins?: boolean;
  shopTheLookId?: string;
  influencer?: PdpInfluencerCredit;
  onOpenShopTheLook?: (lookId: string) => void;
  reserveBottomCta?: boolean;
  objectPosition?: string;
  hotspots?: PdpProductHotspot[];
};

/** Immersive 4:5 portrait — full-bleed by default, optional 12px white inset */
function PdpGalleryPortraitSlide({
  src,
  alt,
  priority = false,
  scale = "scale-100",
  insetMargins = false,
  shopTheLookId,
  influencer,
  onOpenShopTheLook,
  reserveBottomCta = false,
  objectPosition = "top",
  hotspots,
}: PdpGalleryPortraitSlideProps) {
  return (
    <section
      className={
        insetMargins
          ? "relative w-full shrink-0 bg-white p-3"
          : "relative w-full shrink-0 overflow-hidden bg-black"
      }
      data-header-surface={insetMargins ? "light" : undefined}
      style={reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-cover ${scale}`}
          style={{ objectPosition }}
          sizes="100vw"
        />

        {hotspots?.length ? <PdpProductHotspots hotspots={hotspots} /> : null}

        {influencer ? (
          <a
            href={influencer.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-black/35 py-2 pl-3 pr-3.5 text-white backdrop-blur-md transition-colors active:bg-black/50 ${pdpType.label}`}
            aria-label={`View ${influencer.handle} on ${influencer.platform === "tiktok" ? "TikTok" : "Instagram"}`}
          >
            <span className="font-extended translate-y-px">{influencer.handle}</span>
            <MaterialIcon name="north_east" size={18} className="text-white/90" />
          </a>
        ) : null}

        {shopTheLookId && onOpenShopTheLook ? (
          <button
            type="button"
            onClick={() => onOpenShopTheLook(shopTheLookId)}
            className={`absolute bottom-4 left-4 flex items-center rounded-full border border-white/50 bg-white/75 py-2.5 pl-3 pr-4 text-neutral-900 backdrop-blur-md ${pdpType.label}`}
          >
            <span className="flex items-center gap-1.5">
              <MaterialIcon name="checkroom" size={18} className="text-neutral-900" />
              <span className="font-extended -translate-y-px">Shop the look</span>
            </span>
          </button>
        ) : null}
      </div>
    </section>
  );
}

/** Immersive gallery video — 4:5 product spin or 9:16 TikTok-style clip */
function PdpGalleryVideoSlide({
  src,
  poster,
  alt,
  showMuteControl = true,
  aspect = "4/5",
  reserveBottomCta = false,
}: {
  src: string;
  poster?: string;
  alt: string;
  showMuteControl?: boolean;
  aspect?: "4/5" | "9/16";
  reserveBottomCta?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full shrink-0 overflow-hidden bg-black"
      style={reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-neutral-100",
          aspect === "9/16" ? "aspect-[9/16]" : "aspect-[4/5]",
        )}
      >
        <PdpGalleryHeroVideo
          src={src}
          poster={poster}
          ariaLabel={alt}
          isActive={isActive}
          showControls
          showMuteControl={showMuteControl}
          className="size-full object-cover object-center"
        />
      </div>
    </section>
  );
}

export function PdpGalleryView({
  onOpenReviews,
  onAddSimilarToBag,
  onAddBundle,
  selectedColorId,
}: {
  onOpenReviews?: () => void;
  onAddSimilarToBag?: () => void;
  onAddBundle?: (payload: PdpBundleAddPayload) => void;
  selectedColorId: string;
}) {
  const [shopLookId, setShopLookId] = useState<string | null>(null);
  const [photosOpen, setPhotosOpen] = useState(false);
  const activeShopLook = shopLookId ? PDP_SHOP_THE_LOOK[shopLookId] ?? null : null;

  return (
    <>
    <div className={GALLERY_CLASS} style={GALLERY_SCROLL_PAD}>
      <div className={GALLERY_MEDIA_STACK_CLASS}>
        <PdpHeroSlide
          src={PDP_GALLERY_HERO_IMAGE}
          alt="Model in a brown shearling jacket carrying Tabby Shoulder Bag 26 outside a wood door"
          priority
        />

        {PDP_GALLERY_SLIDES.flatMap((slide, index) => {
          if (slide.type === "editorial") {
            return [
              <PdpGalleryEditorialSlide
                key={`editorial-${slide.src}`}
                src={slide.src}
                alt={slide.alt}
                caption={slide.caption}
                objectPosition={slide.objectPosition}
                secondarySrc={slide.secondarySrc}
                secondaryAlt={slide.secondaryAlt}
                learnMore={slide.learnMore}
              />,
            ];
          }

          if (slide.type === "video") {
            return [
              <PdpGalleryVideoSlide
                key={`video-${slide.src}`}
                src={slide.src}
                poster={slide.poster}
                alt={slide.alt}
                showMuteControl={slide.showMuteControl}
                aspect={slide.aspect}
              />,
            ];
          }

          return [
            <PdpGalleryPortraitSlide
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              priority={index === 0}
              scale={
                slide.scale ??
                (slide.src.includes("interior-packed") ||
                slide.src.includes("interior-packed-bleed")
                  ? "scale-[1.12]"
                  : "scale-[1.08]")
              }
              shopTheLookId={slide.shopTheLookId}
              influencer={slide.influencer}
              onOpenShopTheLook={setShopLookId}
              insetMargins={slide.insetMargins}
              objectPosition={slide.objectPosition}
              hotspots={slide.hotspots}
            />,
          ];
        })}
      </div>

      <PdpGalleryViewMorePhotos onOpen={() => setPhotosOpen(true)} />
      <PdpSimilarItemsCarousel onAddToBag={() => onAddSimilarToBag?.()} />
      <PdpCompareModule selectedColorId={selectedColorId} />
      <PdpBundleModule onAddBundle={(payload) => onAddBundle?.(payload)} />
      <PdpReviewsModule
        onReadAll={onOpenReviews}
        onWriteReview={onOpenReviews}
      />
      <PdpRecentlyViewedCarousel />
      <PdpProductSearchModule />
    </div>
    <PdpGalleryPhotosSheet open={photosOpen} onClose={() => setPhotosOpen(false)} />
    <PdpShopTheLookSheet
      look={activeShopLook}
      open={shopLookId !== null}
      onClose={() => setShopLookId(null)}
    />
    </>
  );
}

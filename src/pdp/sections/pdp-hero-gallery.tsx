"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";

import { cn } from "@/lib/cn";

import { PdpHeroActionRail } from "../chrome/pdp-hero-action-rail";
import { PdpHeroNav } from "../chrome/pdp-hero-nav";
import { PdpHeroSlideIndicator } from "../chrome/pdp-hero-slide-indicator";
import { useHeroGallerySlide } from "../hooks/use-hero-gallery-slide";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import {
  PDP_HERO,
  PDP_HERO_GALLERY_SLIDE_COUNT,
  PDP_HERO_GALLERY_STILLS,
} from "../pdp-media";

type PdpHeroGalleryProps = {
  bagCount?: number;
  onOpenMenu?: () => void;
  onToggleImmersive?: () => void;
  className?: string;
};

const HERO_MEDIA_PARALLAX_FACTOR = 0.05;

const TEXT_26_TRANSLATE_PX = -40;
const TABBY_TRANSLATE_PX = -70;
const TEXT_BLUR_MAX_PX = 8;

/** Design gallery container — vertical scroll-snap: video + 13 stills */
export function PdpHeroGallery({
  bagCount = 0,
  onOpenMenu,
  onToggleImmersive,
  className,
}: PdpHeroGalleryProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref26 = useRef<HTMLDivElement>(null);
  const refTabby = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [heroChromeVisible, setHeroChromeVisible] = useState(true);
  const { activeIndex, scrollToSlide } = useHeroGallerySlide(
    galleryRef,
    PDP_HERO_GALLERY_SLIDE_COUNT,
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (activeIndex === 0) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [activeIndex]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroChromeVisible(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(frame);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) {
      return;
    }

    const mediaNodes = Array.from(
      gallery.querySelectorAll<HTMLElement>("[data-pdp-hero-media='true']"),
    );
    if (mediaNodes.length === 0) {
      return;
    }

    let frame = 0;

    const applyParallax = () => {
      frame = 0;
      const slideHeight = gallery.clientHeight;
      if (slideHeight <= 0) {
        return;
      }

      const scrollTop = gallery.scrollTop;
      for (const mediaNode of mediaNodes) {
        if (reducedMotion) {
          mediaNode.style.transform = "none";
          continue;
        }

        const slideIndex = Number(mediaNode.dataset.pdpSlideIndex ?? "0");
        const localOffset = scrollTop - slideIndex * slideHeight;
        const translateY = localOffset * HERO_MEDIA_PARALLAX_FACTOR;
        mediaNode.style.transform = `translate3d(0, ${translateY.toFixed(3)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(applyParallax);
    };

    applyParallax();
    gallery.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      gallery.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      for (const mediaNode of mediaNodes) {
        mediaNode.style.transform = "none";
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    const gallery = galleryRef.current;
    const el26 = ref26.current;
    const elTabby = refTabby.current;
    if (!gallery || !el26 || !elTabby) {
      return;
    }

    let frame = 0;

    const apply = () => {
      frame = 0;
      const slideHeight = gallery.clientHeight;
      if (slideHeight <= 0) {
        return;
      }

      const progress = Math.min(1, Math.max(0, gallery.scrollTop / slideHeight));

      if (reducedMotion) {
        const hidden = progress >= 1;
        for (const el of [el26, elTabby]) {
          el.style.opacity = hidden ? "0" : "1";
          el.style.transform = "none";
          el.style.filter = "none";
        }
        return;
      }

      const opacity = String(1 - progress);
      const blur = progress * TEXT_BLUR_MAX_PX;
      const filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : "none";

      el26.style.opacity = opacity;
      el26.style.transform = `translate3d(0, ${(progress * TEXT_26_TRANSLATE_PX).toFixed(2)}px, 0)`;
      el26.style.filter = filter;

      elTabby.style.opacity = opacity;
      elTabby.style.transform = `translate3d(0, ${(progress * TABBY_TRANSLATE_PX).toFixed(2)}px, 0)`;
      elTabby.style.filter = filter;
    };

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }
      frame = window.requestAnimationFrame(apply);
    };

    apply();
    gallery.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      gallery.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
      for (const el of [el26, elTabby]) {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.filter = "";
      }
    };
  }, [reducedMotion]);

  const handleFrameClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      (event.target as HTMLElement).closest("button, a, [data-pdp-no-toggle]")
    ) {
      return;
    }
    onToggleImmersive?.();
  };

  return (
    <div
      ref={frameRef}
      onClick={handleFrameClick}
      className={cn("pdp-hero-gallery-frame relative w-full overflow-visible bg-black", className)}
    >
      <div className="pdp-hero-gallery-bleed absolute inset-x-0 bottom-0 z-0 overflow-hidden">
        <div
          ref={galleryRef}
          className="pdp-hero-gallery absolute inset-0 overflow-y-auto overscroll-y-contain"
          style={{ overscrollBehavior: "contain" }}
        >
          <div className="pdp-hero-gallery__slide relative h-full w-full shrink-0">
            <video
              ref={videoRef}
              data-pdp-hero-media="true"
              data-pdp-slide-index={0}
              className="pdp-hero-media size-full object-cover will-change-transform"
              style={{ objectPosition: PDP_HERO.objectPosition }}
              src={PDP_HERO.videoSrc}
              poster={PDP_HERO.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              aria-label={PDP_HERO.alt}
            />
          </div>

          {PDP_HERO_GALLERY_STILLS.map((src, index) => (
            <div key={src} className="pdp-hero-gallery__slide relative h-full w-full shrink-0">
              <Image
                src={src}
                alt={`Tabby Shoulder Bag 26 — gallery still ${index + 2}`}
                fill
                data-pdp-hero-media="true"
                data-pdp-slide-index={index + 1}
                className="pdp-hero-media object-cover object-center will-change-transform"
                sizes="100vw"
                priority={index < 2}
              />
            </div>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{ background: "var(--pdp-hero-scrim)" }}
        />
      </div>

      {/* Editorial text — direct child of gallery frame so % positions track frame height */}
      <div
        aria-hidden
        data-hero-immersive="editorial"
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      >
        {/* "26" — 64px padding from top; text right-aligned in 83px slot, bleeds ~27px off left */}
        <div
          ref={ref26}
          className="absolute inset-x-0 top-0 flex items-end"
          style={{
            paddingTop: "calc(64 * var(--pdp-scale) * 1px)",
            willChange: "transform, opacity, filter",
          }}
        >
          <div
            className="flex shrink-0 flex-col items-end justify-center"
            style={{ width: "calc(83 * var(--pdp-scale) * 1px)" }}
          >
            <span
              className="font-extended font-light leading-[1.15] text-white"
              style={{ fontSize: "calc(82 * var(--pdp-scale) * 1px)", whiteSpace: "pre" }}
            >
              26
            </span>
          </div>
        </div>

        {/* "Tabby" — bottom-anchored, 62px clip shows only tops of letterforms */}
        <div
          ref={refTabby}
          className="absolute inset-x-0 bottom-0 flex flex-col items-end overflow-hidden"
          style={{
            height: "calc(62 * var(--pdp-scale) * 1px)",
            willChange: "transform, opacity, filter",
          }}
        >
          <span
            className="font-extended font-light leading-[1.15] text-white"
            style={{ fontSize: "calc(82 * var(--pdp-scale) * 1px)", whiteSpace: "pre" }}
          >
            Tabby
          </span>
        </div>
      </div>

      <div data-hero-chrome className={cn(!heroChromeVisible && "hidden")}>
        <PdpHeroNav bagCount={bagCount} onOpenMenu={onOpenMenu} />
        <PdpHeroSlideIndicator activeIndex={activeIndex} onSelect={scrollToSlide} />
        <PdpHeroActionRail />
      </div>
    </div>
  );
}

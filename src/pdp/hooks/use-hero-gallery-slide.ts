"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "./use-reduced-motion";

const SCROLL_SETTLE_DELAY_MS = 130;

function getSlides(gallery: HTMLElement, slideCount: number) {
  return Array.from(
    gallery.querySelectorAll<HTMLElement>(".pdp-hero-gallery__slide"),
  ).slice(0, slideCount);
}

function getSlideTop(gallery: HTMLElement, slide: HTMLElement) {
  const galleryRect = gallery.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  return gallery.scrollTop + (slideRect.top - galleryRect.top);
}

function getNearestSlideIndex(gallery: HTMLElement, slideCount: number) {
  const slides = getSlides(gallery, slideCount);
  if (slides.length === 0) {
    return 0;
  }

  const probe = gallery.scrollTop + gallery.clientHeight * 0.5;
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < slides.length; index += 1) {
    const slide = slides[index]!;
    const slideRect = slide.getBoundingClientRect();
    const center = getSlideTop(gallery, slide) + slideRect.height * 0.5;
    const distance = Math.abs(center - probe);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  }

  return nearestIndex;
}

function snapGalleryToNearestSlide(
  gallery: HTMLElement,
  slideCount: number,
  behavior: ScrollBehavior = "auto",
) {
  if (slideCount <= 0) {
    return;
  }

  const slides = getSlides(gallery, slideCount);
  if (slides.length === 0) {
    return;
  }

  const clamped = Math.min(
    Math.max(0, getNearestSlideIndex(gallery, slideCount)),
    slides.length - 1,
  );
  const targetSlide = slides[clamped];
  const targetTop = targetSlide ? getSlideTop(gallery, targetSlide) : 0;

  if (Math.abs(gallery.scrollTop - targetTop) > 1) {
    gallery.scrollTo({ top: targetTop, behavior });
  }
}

export function useHeroGallerySlide(
  galleryRef: RefObject<HTMLElement | null>,
  slideCount: number,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const measure = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery || slideCount <= 0) {
      return;
    }

    const clamped = Math.min(
      Math.max(0, getNearestSlideIndex(gallery, slideCount)),
      slideCount - 1,
    );

    setActiveIndex((current) => (current === clamped ? current : clamped));
  }, [galleryRef, slideCount]);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) {
      return;
    }

    let frame = 0;
    let settleTimeout = 0;

    const clearSettleTimeout = () => {
      if (settleTimeout !== 0) {
        window.clearTimeout(settleTimeout);
        settleTimeout = 0;
      }
    };

    const scheduleSettle = () => {
      clearSettleTimeout();
      // iOS Safari can emit touch/pointer end before momentum finishes; settle after scroll idle.
      settleTimeout = window.setTimeout(() => {
        settleTimeout = 0;
        snapGalleryToNearestSlide(gallery, slideCount, "auto");
        measure();
      }, SCROLL_SETTLE_DELAY_MS);
    };

    const onScroll = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
        scheduleSettle();
      });
    };

    const onResize = () => {
      snapGalleryToNearestSlide(gallery, slideCount, "auto");
      measure();
    };

    measure();
    gallery.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      gallery.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearSettleTimeout();
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [galleryRef, measure, slideCount]);

  const scrollToSlide = useCallback(
    (index: number) => {
      const gallery = galleryRef.current;
      if (!gallery) {
        return;
      }

      const slides = getSlides(gallery, slideCount);
      const clampedIndex = Math.min(Math.max(0, index), slides.length - 1);
      const targetSlide = slides[clampedIndex];
      if (!targetSlide) {
        return;
      }
      const targetTop = getSlideTop(gallery, targetSlide);

      gallery.scrollTo({
        top: targetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [galleryRef, reducedMotion, slideCount],
  );

  return { activeIndex, scrollToSlide };
}

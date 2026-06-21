"use client";

import Image from "next/image";
import { useRef } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";

import { useScrollParallaxProgress } from "../hooks/use-scroll-parallax-progress";
import { useSmoothedScrollProgress } from "../hooks/use-smoothed-scroll-progress";
import { getLateStartProgress } from "../pdp-motion";
import { PDP_ASSETS, PDP_ZOOM_HINT } from "../pdp-media";
import { PdpDragZoomImage } from "../primitives/pdp-drag-zoom-image";

const px = (value: number) => `calc(${value} * var(--pdp-scale) * 1px)`;
const ASSETS_LATE_START = 0.18;
const ASSETS_ENTRY_OFFSET_VIEWPORT = 0.12;
const ASSETS_TRAVEL_SECTION_RATIO = 1.08;
const ASSETS_MOMENTUM_LERP = 0.16;
const ASSETS_MOMENTUM_MAX_STEP = 0.032;
const ASSETS_MOMENTUM_SNAP_EPSILON = 0.001;

/** Design 41T-0 → 42F-0 — product overlaps model, then de-overlaps on scroll */
export function PdpAssetsParallax() {
  const sectionRef = useRef<HTMLElement>(null);
  const rawProgress = getLateStartProgress(
    useScrollParallaxProgress(sectionRef, {
      entryOffsetViewport: ASSETS_ENTRY_OFFSET_VIEWPORT,
      travelSectionRatio: ASSETS_TRAVEL_SECTION_RATIO,
    }),
    ASSETS_LATE_START,
  );
  const progress = useSmoothedScrollProgress(rawProgress, {
    lerp: ASSETS_MOMENTUM_LERP,
    maxStep: ASSETS_MOMENTUM_MAX_STEP,
    snapEpsilon: ASSETS_MOMENTUM_SNAP_EPSILON,
  });

  const { model, product, overlapTopPx, modelFramePx, productHeightPx, sectionHeightPx } =
    PDP_ASSETS;

  const modelTranslateYPx = -progress * 18;
  const productTranslateYPx = progress * 12;
  const desiredProductTopPx =
    overlapTopPx + (modelFramePx - overlapTopPx) * progress + productTranslateYPx;
  const modelBottomPx = modelFramePx + modelTranslateYPx;
  // Keep overlap while scrubbing, then cap at edge-touch (0px gap, no re-separation).
  const productTopPx = Math.min(desiredProductTopPx, modelBottomPx);

  const sectionHeight = px(sectionHeightPx);
  const modelHeight = px(modelFramePx);
  const productHeight = px(productHeightPx);
  const productTop = px(productTopPx);
  const hintOpacity = Math.min(1, Math.max(0, (progress - 0.35) / 0.45));

  return (
    <section id="pdp-assets" ref={sectionRef} className="bg-white px-0">
      <div
        className="pdp-page relative w-full"
        style={{ height: sectionHeight }}
      >
        <div
          className="absolute inset-x-0 top-0 flex flex-col justify-center pr-6 pt-6"
          style={{
            height: modelHeight,
            transform: `translateY(calc(${modelTranslateYPx} * var(--pdp-scale) * 1px))`,
          }}
        >
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <Image
              src={model.src}
              alt={model.alt}
              fill
              className="object-cover"
              style={{ objectPosition: model.objectPosition }}
              sizes="100vw"
              priority
            />
          </div>
        </div>

        <div
          className="absolute inset-x-0 flex flex-col items-end gap-2 pl-6 py-6"
          style={{
            top: productTop,
          }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ height: productHeight }}
          >
            <PdpDragZoomImage
              src={product.src}
              alt={product.alt}
              objectPosition={product.objectPosition}
              priority
            />
          </div>

          <div
            aria-hidden
            className="pointer-events-none flex w-full items-center justify-center gap-2 px-2 transition-opacity duration-300"
            style={{ opacity: hintOpacity }}
          >
            <MaterialIcon name="touch_app" size={20} className="text-black/70" />
            <span className="font-extended text-center text-[14px] leading-[1.2] text-black/70">
              {PDP_ZOOM_HINT}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

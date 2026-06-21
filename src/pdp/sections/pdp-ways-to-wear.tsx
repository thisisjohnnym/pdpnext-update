"use client";

import Image from "next/image";
import { useRef } from "react";

import { useDownwardRevealKey } from "../hooks/use-downward-reveal-key";
import { useScrollParallaxProgress } from "../hooks/use-scroll-parallax-progress";
import { useSmoothedScrollProgress } from "../hooks/use-smoothed-scroll-progress";
import { getLateStartProgress } from "../pdp-motion";
import { PDP_WAYS_TO_WEAR_CAPTION, PDP_WEAR_STYLES } from "../pdp-media";
import { getInsetMorphStyle } from "../primitives/pdp-inset-morph";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Design 4DV-0 → 4DX-0 — full bleed scrubs into inset carousel, reversible */
export function PdpWaysToWear() {
  const sectionRef = useRef<HTMLElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const rawProgress = getLateStartProgress(useScrollParallaxProgress(sectionRef));
  const progress = useSmoothedScrollProgress(rawProgress);
  const captionRevealKey = useDownwardRevealKey(captionRef);
  const revealOpacity = clamp01((progress - 0.7) / 0.3);
  const revealed = progress > 0.9;
  const captionTop = `calc((var(--pdp-inset-pad-sm) + var(--pdp-inset-media-height) + 16px) * ${progress})`;

  return (
    <section
      id="pdp-ways-to-wear"
      ref={sectionRef}
      className="pdp-inset-module pdp-inset-module--ways-to-wear bg-white px-0 py-0"
    >
      <div className="relative size-full min-h-[inherit]">
        <div
          className="overflow-hidden bg-neutral-100"
          style={getInsetMorphStyle(progress, "centered", {
            padVar: "var(--pdp-inset-pad-sm)",
          })}
        >
          <div
            className="flex size-full"
            style={{
              gap: `calc(8 * var(--pdp-scale) * 1px * ${progress})`,
              padding: `calc(var(--pdp-inset-pad-sm) * ${progress}) calc(var(--pdp-inset-pad-sm) * ${progress}) 0`,
              overflowX: revealed ? "auto" : "hidden",
              overscrollBehaviorX: "contain",
              scrollSnapType: revealed ? "x mandatory" : undefined,
            }}
          >
            {PDP_WEAR_STYLES.map((style, index) => (
              <div
                key={style.id}
                className="relative shrink-0 overflow-hidden"
                style={{
                  flex: "0 0 100%",
                  scrollSnapAlign: "center",
                  opacity: index === 0 ? 1 : revealOpacity,
                }}
              >
                <Image
                  src={style.src}
                  alt={style.alt}
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          ref={captionRef}
          className="pdp-caption-wrap relative z-[1] px-[var(--pdp-inset-pad-sm)]"
          style={{ opacity: revealOpacity, paddingTop: captionTop }}
          aria-hidden={revealOpacity <= 0.05}
        >
          <div
            key={captionRevealKey}
            className={`pdp-text-reveal-target ${
              captionRevealKey > 0
                ? "motion-safe:animate-[pdp-text-reveal_var(--pdp-duration)_var(--pdp-ease)_both]"
                : ""
            }`}
          >
            <p className="pdp-reveal-copy font-extended m-0 whitespace-pre-wrap text-[16px] leading-[1.2] text-black">
              {PDP_WAYS_TO_WEAR_CAPTION}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

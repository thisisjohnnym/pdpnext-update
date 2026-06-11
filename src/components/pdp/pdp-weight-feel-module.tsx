"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_WEIGHT_FEEL } from "./pdp-data";
import {
  EXPERIENCE_PANEL_BODY_CLASS,
  EXPERIENCE_PANEL_GRID_CLASS,
  EXPERIENCE_PANEL_HEADER_CLASS,
  EXPERIENCE_PANEL_ITEM_CLASS,
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";
import { useWeightLift } from "./use-weight-lift";

function triggerLiftHaptic(pattern: readonly number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([...pattern]);
  }
}

/** Weight & feel — press-and-hold lift with haptic, specs as sensation */
export function PdpWeightFeelModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, intro, hint, holdMs, image, reveal, hapticPattern } =
    PDP_WEIGHT_FEEL;
  const panel = experiencePanelSectionProps(isLastPanel);

  const { progress, lifted, revealed, handlePointerDown, handlePointerEnd } =
    useWeightLift({
      holdMs,
      onLift: () => triggerLiftHaptic(hapticPattern),
    });

  const isHolding = progress > 0 && !revealed;
  const showReveal = revealed || lifted;

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <PageGrid fullWidth className={EXPERIENCE_PANEL_GRID_CLASS}>
        <GridItem mobile={12} desktop={24} className={EXPERIENCE_PANEL_ITEM_CLASS}>
          <div className={EXPERIENCE_PANEL_HEADER_CLASS}>
            <p className="font-extended text-xs tracking-[0.2px] text-black">{title}</p>
            <p className={`text-neutral-600 ${pdpType.caption}`}>{intro}</p>
          </div>

          <div className={EXPERIENCE_PANEL_BODY_CLASS}>
            <button
              type="button"
              className={cn(
                EXPERIENCE_PANEL_MEDIA_CLASS,
                "pdp-weight-lift touch-none select-none bg-[#ececec]",
              )}
              aria-label={hint}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
            >
              <div
                aria-hidden
                className={cn(
                  "pdp-weight-lift__stage absolute inset-x-0 bottom-[12%] top-[8%] flex items-end justify-center transition-transform duration-300 ease-out",
                  lifted && "pdp-weight-lift__stage--lifted",
                )}
              >
                <div
                  className={cn(
                    "pdp-weight-lift__shadow absolute bottom-[6%] left-1/2 h-4 w-[50%] -translate-x-1/2 rounded-[100%] bg-black/20 blur-md transition-all duration-300",
                    lifted && "pdp-weight-lift__shadow--lifted",
                  )}
                />
                <div className="relative h-full w-[72%] max-w-xs">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain object-bottom"
                    style={{ objectPosition: image.objectPosition ?? "center bottom" }}
                    sizes="72vw"
                    draggable={false}
                  />
                </div>
              </div>

              {!showReveal ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-[#ececec] via-[#ececec]/95 to-transparent px-4 pb-4 pt-10"
                >
                  <span
                    className={cn(
                      "relative flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white/90 shadow-sm transition-transform duration-200",
                      isHolding && "scale-95",
                    )}
                  >
                    <svg
                      viewBox="0 0 44 44"
                      className="absolute inset-0 size-full -rotate-90"
                      aria-hidden
                    >
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-neutral-200"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="text-black transition-all duration-75"
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={2 * Math.PI * 18 * (1 - progress)}
                      />
                    </svg>
                    <MaterialIcon
                      name="back_hand"
                      size={20}
                      className="relative text-neutral-700"
                    />
                  </span>
                  <span className="font-extended text-[11px] tracking-[0.2px] text-neutral-600">
                    {isHolding ? "Keep holding…" : hint}
                  </span>
                </div>
              ) : (
                <div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#ececec] via-[#ececec]/98 to-transparent px-4 pb-4 pt-12 text-left"
                  aria-live="polite"
                >
                  <p className="font-extended text-sm leading-snug tracking-[0.2px] text-black">
                    {reveal.headline}
                  </p>
                  <p className={`mt-1 text-neutral-600 ${pdpType.micro}`}>
                    {reveal.subline}
                  </p>
                </div>
              )}
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_WEIGHT_FEEL } from "./pdp-data";
import {
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

const WEIGHT_LIFT_STRIP_CLASS =
  "shrink-0 bg-[#ececec] px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]";

/** Weight & feel — press-and-hold lift with haptic, specs as sensation */
export function PdpWeightFeelModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { hint, holdMs, image, reveal, hapticPattern } = PDP_WEIGHT_FEEL;
  const panel = experiencePanelSectionProps(isLastPanel);

  const { progress, lifted, revealed, handlePointerDown, handlePointerEnd, handleContextMenu } =
    useWeightLift({
      holdMs,
      onLift: () => triggerLiftHaptic(hapticPattern),
    });

  const isHolding = progress > 0 && !revealed;
  const showReveal = revealed || lifted;

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <div
        className={cn(
          EXPERIENCE_PANEL_MEDIA_CLASS,
          "pdp-weight-lift bg-[#ececec]",
        )}
      >
        <div
          className={cn(
            "pdp-weight-lift__stage absolute inset-x-0 top-0 bottom-0 transition-transform duration-300 ease-out",
            lifted && "pdp-weight-lift__stage--lifted",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            unoptimized
            className="pointer-events-none object-cover"
            style={{ objectPosition: image.objectPosition ?? "center 72%" }}
            sizes="100vw"
            draggable={false}
          />
          <div
            className={cn(
              "pdp-weight-lift__shadow absolute bottom-[14%] left-1/2 h-5 w-[45%] -translate-x-1/2 rounded-[100%] bg-black/20 blur-md transition-all duration-300",
              lifted && "pdp-weight-lift__shadow--lifted",
            )}
          />
        </div>
      </div>

      <button
        type="button"
        className={cn(
          WEIGHT_LIFT_STRIP_CLASS,
          "pdp-weight-lift touch-none select-none text-left",
        )}
        aria-label={hint}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onContextMenu={handleContextMenu}
      >
        {!showReveal ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative flex size-[4.25rem] items-center justify-center">
              <span
                aria-hidden
                className="pdp-weight-lift__ring pdp-weight-lift__ring--outer pointer-events-none absolute size-[4.25rem] rounded-full border border-neutral-400/70"
              />
              <span
                aria-hidden
                className="pdp-weight-lift__ring pointer-events-none absolute size-[3.25rem] rounded-full border border-neutral-500/80"
              />
              <span
                className={cn(
                  "relative flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm transition-transform duration-200",
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
                  className="relative text-neutral-800"
                />
              </span>
            </div>
            <span className="font-extended text-[11px] tracking-[0.2px] text-neutral-600">
              {isHolding ? "Keep holding…" : hint}
            </span>
          </div>
        ) : (
          <div aria-live="polite">
            <p className="font-extended text-sm leading-snug tracking-[0.2px] text-black">
              {reveal.headline}
            </p>
            <p className={`mt-1 text-neutral-600 ${pdpType.micro}`}>
              {reveal.subline}
            </p>
          </div>
        )}
      </button>
    </section>
  );
}

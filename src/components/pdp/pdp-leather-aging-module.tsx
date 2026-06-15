"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING, PDP_LEATHER_CLEANER } from "./pdp-data";
import {
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";

function formatCarePrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

function AgingCareUpsellRow({
  product,
  added,
  onQuickAdd,
}: {
  product: (typeof PDP_LEATHER_CLEANER.products)[number];
  added: boolean;
  onQuickAdd: () => void;
}) {
  return (
    <div className="border-t border-neutral-200 pt-3">
      <div className="flex items-center gap-3 py-1">
        <div className="relative size-12 shrink-0 overflow-hidden bg-neutral-100">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            className="object-contain object-center p-1"
            sizes="48px"
          />
        </div>

        <p className="font-extended min-w-0 flex-1 truncate text-sm tracking-[0.2px] text-black">
          {product.name}
        </p>

        <p className="font-extended shrink-0 text-sm tracking-[0.2px] text-black">
          {formatCarePrice(product.price)}
        </p>

        <button
          type="button"
          onClick={onQuickAdd}
          disabled={added}
          className={cn(
            "font-extended inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-2.5 py-1.5 text-[11px] leading-none tracking-[0.2px] transition-colors",
            added
              ? "bg-neutral-100 text-neutral-600"
              : "border border-neutral-300 bg-white text-black active:bg-neutral-50",
          )}
        >
          <span>{added ? "Added" : "Add"}</span>
          {!added ? (
            <MaterialIcon name="add" size={18} className="text-black" />
          ) : null}
        </button>
      </div>
    </div>
  );
}

/** Leather aging simulator — patina, softening, and wear over time */
export function PdpLeatherAgingModule({
  isLastPanel = false,
  onQuickAdd,
}: {
  isLastPanel?: boolean;
  onQuickAdd?: () => void;
}) {
  const { image, stages, careNudge } = PDP_LEATHER_AGING;
  const panel = experiencePanelSectionProps(isLastPanel);
  const maxIndex = stages.length - 1;
  const [stageIndex, setStageIndex] = useState(0);
  const [careAdded, setCareAdded] = useState(false);
  const stage = stages[stageIndex]!;
  const sliderProgress =
    maxIndex > 0 ? (stageIndex / maxIndex) * 100 : 0;
  const careProduct = PDP_LEATHER_CLEANER.products.find(
    (product) => product.id === careNudge.productId,
  );

  const showSimulatedWear = !stage.image;

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-white")}>
        {stages.map((item, index) => {
          const stageImage = item.image ?? image;
          const active = stageIndex === index;
          const filter =
            item.image
              ? undefined
              : `brightness(${item.visual.brightness}) contrast(${item.visual.contrast}) saturate(${item.visual.saturate}) sepia(${item.visual.sepia})`;

          return (
            <Image
              key={item.id}
              src={stageImage.src}
              alt={stageImage.alt}
              fill
              priority={index === 0}
              className={cn(
                "object-cover transition-opacity duration-500 ease-out",
                active ? "opacity-100" : "opacity-0",
              )}
              style={{
                objectPosition: stageImage.objectPosition ?? "center",
                filter,
              }}
              sizes="100vw"
            />
          );
        })}

        {showSimulatedWear ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: stage.visual.patinaOpacity,
                background: stage.visual.patinaGradient,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: stage.visual.wearOpacity,
                background: stage.visual.wearGradient,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: stage.visual.softenOpacity,
                backdropFilter: `blur(${stage.visual.softenBlur}px)`,
                WebkitBackdropFilter: `blur(${stage.visual.softenBlur}px)`,
                maskImage: stage.visual.softenMask,
                WebkitMaskImage: stage.visual.softenMask,
              }}
            />
          </>
        ) : null}
      </div>

      <div
        className="shrink-0 bg-white px-4 pt-3.5"
        style={{ paddingBottom: `calc(0.75rem + env(safe-area-inset-bottom, 0px))` }}
      >
        <div className="pdp-aging-timeline" aria-live="polite">
          <div className="mb-3">
            <p className="font-extended text-lg tracking-[0.2px] text-black transition-opacity duration-300">
              {stage.label}
            </p>
            <p className={`mt-0.5 text-neutral-500 ${pdpType.micro}`}>
              {stage.summary}
            </p>
          </div>

          <div className="relative flex h-10 items-center">
            <div className="pdp-aging-timeline__track relative h-[3px] w-full rounded-full bg-neutral-200">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-neutral-950 via-neutral-800 to-[#7a5c32] transition-[width] duration-500 ease-out"
                style={{ width: `${sliderProgress}%` }}
              />

              {stages.map((item, index) => {
                const active = stageIndex === index;
                const isFirst = index === 0;
                const isLast = index === maxIndex;

                return (
                  <span
                    key={item.id}
                    aria-hidden
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out",
                      active
                        ? "size-3.5 bg-neutral-950 shadow-[0_0_0_4px_rgba(0,0,0,0.08)]"
                        : "size-2 bg-neutral-300",
                      isFirst && "left-0 -translate-x-1/2",
                      isLast && "right-0 translate-x-1/2",
                      !isFirst && !isLast && "left-1/2 -translate-x-1/2",
                    )}
                  />
                );
              })}
            </div>

            <input
              type="range"
              min={0}
              max={maxIndex}
              step={1}
              value={stageIndex}
              onChange={(event) => setStageIndex(Number(event.target.value))}
              aria-valuemin={0}
              aria-valuemax={maxIndex}
              aria-valuenow={stageIndex}
              aria-valuetext={stage.label}
              aria-label="Leather aging over time"
              className="pdp-aging-timeline__input absolute inset-0 z-[1] w-full"
            />
          </div>

          <div className="mt-2 grid grid-cols-3">
            {stages.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === maxIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStageIndex(index)}
                  aria-current={stageIndex === index ? "step" : undefined}
                  className={cn(
                    "font-extended min-h-8 py-1 text-[10px] tracking-[0.2px] transition-colors duration-200",
                    isFirst && "text-left",
                    isLast && "text-right",
                    !isFirst && !isLast && "text-center",
                    stageIndex === index
                      ? "text-black"
                      : "text-neutral-400 active:text-neutral-700",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {careProduct ? (
            <div
              className={cn(
                "overflow-hidden transition-[max-height,margin] duration-500 ease-out",
                stageIndex === 0 ? "max-h-0 opacity-0" : "mt-1 max-h-24 opacity-100",
              )}
              aria-hidden={stageIndex === 0}
            >
              <AgingCareUpsellRow
                product={careProduct}
                added={careAdded}
                onQuickAdd={() => {
                  if (careAdded) {
                    return;
                  }

                  onQuickAdd?.();
                  setCareAdded(true);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

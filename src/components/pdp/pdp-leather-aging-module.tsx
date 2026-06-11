"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_LEATHER_AGING } from "./pdp-data";
import {
  EXPERIENCE_PANEL_BODY_CLASS,
  EXPERIENCE_PANEL_GRID_CLASS,
  EXPERIENCE_PANEL_HEADER_CLASS,
  EXPERIENCE_PANEL_ITEM_CLASS,
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";

/** Leather aging simulator — patina, softening, and wear over time */
export function PdpLeatherAgingModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, image, stages } = PDP_LEATHER_AGING;
  const panel = experiencePanelSectionProps(isLastPanel);
  const [stageIndex, setStageIndex] = useState(0);
  const stage = stages[stageIndex]!;

  const imageFilter = useMemo(
    () =>
      `brightness(${stage.visual.brightness}) contrast(${stage.visual.contrast}) saturate(${stage.visual.saturate}) sepia(${stage.visual.sepia})`,
    [stage.visual],
  );

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <PageGrid fullWidth className={EXPERIENCE_PANEL_GRID_CLASS}>
        <GridItem mobile={12} desktop={24} className={EXPERIENCE_PANEL_ITEM_CLASS}>
          <div className={EXPERIENCE_PANEL_HEADER_CLASS}>
            <p className="font-extended text-xs tracking-[0.2px] text-black">{title}</p>
          </div>

          <div className={EXPERIENCE_PANEL_BODY_CLASS}>
            <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-neutral-900")}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-[filter] duration-500 ease-out"
                style={{
                  objectPosition: image.objectPosition ?? "center",
                  filter: imageFilter,
                }}
                sizes="100vw"
              />

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

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-3 pb-3 pt-12"
              >
                <p className="font-extended text-[11px] tracking-[0.2px] text-white/90">
                  {stage.timeline}
                </p>
                <p className={`mt-0.5 text-white/75 ${pdpType.micro}`}>{stage.summary}</p>
              </div>
            </div>

            <div className="shrink-0">
              <div className="grid grid-cols-3 gap-1">
                {stages.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStageIndex(index)}
                    aria-pressed={stageIndex === index}
                    className={cn(
                      "font-extended rounded-lg px-1 py-1.5 text-center text-[10px] tracking-[0.2px] transition-colors",
                      stageIndex === index
                        ? "bg-black text-white"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-black",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

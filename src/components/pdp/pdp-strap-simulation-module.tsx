"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_STRAP_SIMULATION } from "./pdp-data";
import {
  EXPERIENCE_PANEL_BODY_CLASS,
  EXPERIENCE_PANEL_GRID_CLASS,
  EXPERIENCE_PANEL_HEADER_CLASS,
  EXPERIENCE_PANEL_ITEM_CLASS,
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";
import { getStrapModeOpacity, useStrapSimulation } from "./use-strap-simulation";

function interpolateModeValue(values: readonly number[], progress: number) {
  const lower = Math.floor(progress);
  const upper = Math.ceil(progress);
  const blend = progress - lower;

  if (lower === upper) {
    return values[lower] ?? values[0] ?? 0;
  }

  const from = values[lower] ?? values[0] ?? 0;
  const to = values[upper] ?? from;
  return from + (to - from) * blend;
}

/** Strap simulation — drag across wear modes, bag animates in frame */
export function PdpStrapSimulationModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, intro, hint, modes } = PDP_STRAP_SIMULATION;
  const panel = experiencePanelSectionProps(isLastPanel);
  const {
    trackRef,
    progress,
    activeIndex,
    snapping,
    setModeIndex,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  } = useStrapSimulation(modes.length);

  const activeMode = modes[activeIndex] ?? modes[0]!;
  const bagOffsetY = interpolateModeValue(
    modes.map((mode) => mode.bagOffsetY),
    progress,
  );
  const bagScale = interpolateModeValue(
    modes.map((mode) => mode.bagScale),
    progress,
  );

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <PageGrid fullWidth className={EXPERIENCE_PANEL_GRID_CLASS}>
        <GridItem mobile={12} desktop={24} className={EXPERIENCE_PANEL_ITEM_CLASS}>
          <div className={EXPERIENCE_PANEL_HEADER_CLASS}>
            <p className="font-extended text-xs tracking-[0.2px] text-black">{title}</p>
            <p className={`text-neutral-600 ${pdpType.caption}`}>{intro}</p>
          </div>

          <div className={EXPERIENCE_PANEL_BODY_CLASS}>
            <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-neutral-100")}>
              {modes.map((mode, index) => {
                const opacity = getStrapModeOpacity(index, progress);
                if (opacity <= 0.01) {
                  return null;
                }

                return (
                  <div
                    key={mode.id}
                    aria-hidden={activeIndex !== index}
                    className={cn(
                      "absolute inset-0 will-change-[opacity,transform]",
                      snapping ? "transition-opacity duration-300 ease-out" : "duration-75",
                    )}
                    style={{
                      opacity,
                      transform: `translate3d(0, ${bagOffsetY}%, 0) scale(${bagScale})`,
                    }}
                  >
                    <Image
                      src={mode.image.src}
                      alt={mode.image.alt}
                      fill
                      className="object-cover"
                      style={{ objectPosition: mode.image.objectPosition ?? "center" }}
                      sizes="100vw"
                      priority={index === 0}
                      draggable={false}
                    />
                  </div>
                );
              })}

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-3 pb-3 pt-14"
              >
                <p className="font-extended text-sm tracking-[0.2px] text-white">
                  {activeMode.label}
                </p>
                <p className={`mt-1 text-white/80 ${pdpType.micro}`}>{activeMode.detail}</p>
              </div>
            </div>

            <div className="shrink-0">
              <div
                ref={trackRef}
                className="pdp-strap-track relative touch-none select-none px-1 py-2"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                role="slider"
                aria-label="Strap wear simulation"
                aria-valuemin={0}
                aria-valuemax={modes.length - 1}
                aria-valuenow={activeIndex}
                aria-valuetext={activeMode.label}
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                    event.preventDefault();
                    setModeIndex(Math.min(activeIndex + 1, modes.length - 1));
                  }
                  if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                    event.preventDefault();
                    setModeIndex(Math.max(activeIndex - 1, 0));
                  }
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-1 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-1 h-1 -translate-y-1/2 rounded-full bg-black transition-[width] duration-75"
                  style={{
                    width: `calc((100% - 0.5rem) * ${progress / Math.max(modes.length - 1, 1)})`,
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 size-[1.125rem] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-[left] duration-75"
                  style={{
                    left: `calc(0.25rem + (100% - 0.5rem) * ${progress / Math.max(modes.length - 1, 1)})`,
                  }}
                />
              </div>

              <div className="mt-2 grid grid-cols-4 gap-1">
                {modes.map((mode, index) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setModeIndex(index)}
                    aria-pressed={activeIndex === index}
                    className={cn(
                      "font-extended rounded-lg px-0.5 py-1.5 text-center text-[10px] leading-tight tracking-[0.2px] transition-colors",
                      activeIndex === index
                        ? "bg-black text-white"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-black",
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <p className={`mt-2 flex items-center justify-center gap-1 text-neutral-500 ${pdpType.micro}`}>
                <MaterialIcon name="swipe" size={18} />
                {hint}
              </p>
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

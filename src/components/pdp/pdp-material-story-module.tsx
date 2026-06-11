"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_MATERIAL_EXPLORATION } from "./pdp-data";
import {
  EXPERIENCE_PANEL_BODY_CLASS,
  EXPERIENCE_PANEL_GRID_CLASS,
  EXPERIENCE_PANEL_HEADER_CLASS,
  EXPERIENCE_PANEL_ITEM_CLASS,
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";
import { useMaterialExplore } from "./use-material-explore";

const LENS_SIZE = 132;
const MAGNIFICATION = 2.75;

/** Touch-to-reveal leather macro exploration */
export function PdpMaterialStoryModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, hint, overview, zones } = PDP_MATERIAL_EXPLORATION;
  const panel = experiencePanelSectionProps(isLastPanel);
  const {
    containerRef,
    position,
    isExploring,
    activeZone,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  } = useMaterialExplore(zones);

  const lensSrc = activeZone?.macroSrc ?? overview.src;
  const lensObjectPosition =
    activeZone?.macroObjectPosition ?? overview.objectPosition ?? "center";

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <PageGrid fullWidth className={EXPERIENCE_PANEL_GRID_CLASS}>
        <GridItem mobile={12} desktop={24} className={EXPERIENCE_PANEL_ITEM_CLASS}>
          <div className={EXPERIENCE_PANEL_HEADER_CLASS}>
            <p className="font-extended text-xs tracking-[0.2px] text-black">{title}</p>
          </div>

          <div className={EXPERIENCE_PANEL_BODY_CLASS}>
            <div
              ref={containerRef}
              className={cn(
                EXPERIENCE_PANEL_MEDIA_CLASS,
                "pdp-material-explore touch-none select-none bg-neutral-900",
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              role="img"
              aria-label="Drag to explore leather grain, stitching, edge paint, and burnishing"
            >
              <Image
                src={overview.src}
                alt={overview.alt}
                fill
                className={cn(
                  "object-cover transition-[filter] duration-300",
                  isExploring
                    ? "brightness-[0.88] saturate-[0.82]"
                    : "brightness-100 saturate-100",
                )}
                style={{ objectPosition: overview.objectPosition ?? "center" }}
                sizes="100vw"
                draggable={false}
              />

              {!isExploring
                ? zones.map((zone) => (
                    <span
                      key={zone.id}
                      aria-hidden
                      className="absolute z-[1] size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/35 shadow-[0_0_0_4px_rgba(255,255,255,0.08)]"
                      style={{
                        left: `${zone.x + zone.width / 2}%`,
                        top: `${zone.y + zone.height / 2}%`,
                      }}
                    />
                  ))
                : null}

              {!isExploring ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-4 pt-10"
                >
                  <MaterialIcon name="touch_app" size={18} className="text-white/90" />
                  <span className="font-extended text-[11px] tracking-[0.2px] text-white/90">
                    {hint}
                  </span>
                </div>
              ) : null}

              {activeZone ? (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-black/60 via-black/25 to-transparent px-3 pb-3 pt-10"
                  aria-live="polite"
                >
                  <p className="font-extended text-xs tracking-[0.2px] text-white">
                    {activeZone.label}
                  </p>
                  <p className={`mt-0.5 text-white/80 ${pdpType.micro}`}>
                    {activeZone.detail}
                  </p>
                </div>
              ) : null}

              {position ? (
                <div
                  aria-hidden
                  className="pdp-material-lens pointer-events-none absolute z-10"
                  style={{
                    left: position.x,
                    top: position.y,
                    width: LENS_SIZE,
                    height: LENS_SIZE,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="absolute inset-0 rounded-full border-[2.5px] border-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.45)] ring-1 ring-black/15" />
                  <div className="absolute inset-[7px] overflow-hidden rounded-full bg-neutral-950">
                    <div
                      className="absolute"
                      style={{
                        width: `${MAGNIFICATION * 100}%`,
                        height: `${MAGNIFICATION * 100}%`,
                        left: `${50 - position.xPct * MAGNIFICATION}%`,
                        top: `${50 - position.yPct * MAGNIFICATION}%`,
                      }}
                    >
                      <Image
                        src={lensSrc}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: lensObjectPosition }}
                        sizes={`${LENS_SIZE * 3}px`}
                        draggable={false}
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.22),transparent_48%)]" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

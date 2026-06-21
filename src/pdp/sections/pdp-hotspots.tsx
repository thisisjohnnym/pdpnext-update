"use client";

import { useState } from "react";
import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_HOTSPOTS } from "../pdp-media";

const CARD_OFFSET = "1.75rem";
const CARD_FLIP_BELOW_THRESHOLD = 28;

function getCardLeftPercent(x: number) {
  const cardHalfWidth = 34;
  const inset = 4;

  return Math.max(
    inset,
    Math.min(x - cardHalfWidth, 100 - cardHalfWidth * 2 - inset),
  );
}

function getCardTransform(y: number) {
  if (y < CARD_FLIP_BELOW_THRESHOLD) {
    return `translateY(${CARD_OFFSET})`;
  }

  return `translateY(calc(-100% - ${CARD_OFFSET}))`;
}

/** Design 53Y-0 / 51Y-0 — + icons, rotate to ×, blur inactive, drop-in card */
export function PdpHotspots() {
  const { src, alt, objectPosition, hotspots } = PDP_HOTSPOTS;
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeHotspot = hotspots?.find((hotspot) => hotspot.id === activeId);

  const handleToggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id));
  };

  if (!hotspots?.length) {
    return null;
  }

  return (
    <section id="pdp-hotspots" className="bg-white px-0">
      <div
        className="relative overflow-hidden bg-neutral-100"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition: objectPosition ?? "center" }}
          sizes="100vw"
        />

        <div className="absolute inset-0">
          {activeId ? (
            <button
              type="button"
              aria-label="Close detail"
              className="absolute inset-0 z-10"
              onClick={() => setActiveId(null)}
            />
          ) : null}

          {hotspots.map((hotspot) => {
            const isActive = activeId === hotspot.id;
            const isDimmed = activeId !== null && !isActive;

            return (
              <div
                key={hotspot.id}
                className={cn(
                  "absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[opacity,filter,transform] duration-[var(--pdp-hotspot-duration)] ease-[var(--pdp-ease)]",
                  isDimmed && "pointer-events-none opacity-0 blur-[6px]",
                )}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              >
                <button
                  type="button"
                  aria-expanded={isActive}
                  aria-label={
                    isActive
                      ? `Close ${hotspot.title}`
                      : `${hotspot.title} — tap for details`
                  }
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggle(hotspot.id);
                  }}
                  className="flex size-10 items-center justify-center rounded-full bg-white p-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.12)]"
                >
                  <MaterialIcon
                    name="add"
                    size={20}
                    className={cn(
                      "text-[#1C1B1F] transition-transform duration-[var(--pdp-hotspot-duration)] ease-[var(--pdp-ease)]",
                      isActive && "rotate-45",
                    )}
                  />
                </button>
              </div>
            );
          })}

          {activeHotspot ? (
            <div
              className="pointer-events-none absolute z-30"
              style={{
                left: `${getCardLeftPercent(activeHotspot.x)}%`,
                top: `${activeHotspot.y}%`,
                transform: getCardTransform(activeHotspot.y),
              }}
            >
              <div
                key={activeHotspot.id}
                className="w-[min(276px,calc(100vw-3rem))] bg-white p-4 animate-[pdp-drop-in_var(--pdp-hotspot-duration)_var(--pdp-ease)_both]"
              >
                <p className="font-extended text-[16px] leading-[1.2] text-black [text-wrap:balance]">
                  {activeHotspot.title}
                </p>
                <p className="mt-2 font-extended text-[12px] leading-[1.2] text-black/70 [text-wrap:balance]">
                  {activeHotspot.body}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";

import type { PdpProductHotspot } from "./pdp-data";
import { pdpType } from "./pdp-type";

type PdpProductHotspotsProps = {
  hotspots: PdpProductHotspot[];
};

const CARD_OFFSET = "1.75rem";
/** Hotspots above this line flip the card downward so it stays in frame */
const CARD_FLIP_BELOW_THRESHOLD = 28;

/** Keep the info card inside the image frame */
function getCardLeftPercent(x: number) {
  const cardHalfWidth = 42;
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

const HOTSPOT_RING_COLORS = ["#FE2C55", "#F4C542", "#5BC8F5"] as const;

/** Tappable detail markers on product photography */
export function PdpProductHotspots({ hotspots }: PdpProductHotspotsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeHotspot = hotspots.find((hotspot) => hotspot.id === activeId);

  const handleToggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <div className="absolute inset-0">
      {activeId ? (
        <button
          type="button"
          aria-label="Close detail"
          className="absolute inset-0 z-10"
          onClick={() => setActiveId(null)}
        />
      ) : null}

      {hotspots.map((hotspot, index) => {
        const isActive = activeId === hotspot.id;
        const staggerDelay = `${index * 0.45}s`;
        const ringColor = HOTSPOT_RING_COLORS[index % HOTSPOT_RING_COLORS.length];

        if (isActive) {
          return null;
        }

        return (
          <div
            key={hotspot.id}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
          >
            <button
              type="button"
              aria-expanded={false}
              aria-label={`${hotspot.title} — tap for details`}
              onClick={(event) => {
                event.stopPropagation();
                handleToggle(hotspot.id);
              }}
              className="relative flex size-11 items-center justify-center"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute size-8 rounded-full border-2 animate-hotspot-ring-ripple"
                style={{
                  borderColor: ringColor,
                  animationDelay: staggerDelay,
                }}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute size-7 rounded-full border-2 animate-hotspot-pulse"
                style={{
                  borderColor: ringColor,
                  animationDelay: staggerDelay,
                }}
              />
              <span
                aria-hidden
                className="relative size-3.5 rounded-full border-2 border-white bg-white"
              />
            </button>
          </div>
        );
      })}

      {activeHotspot ? (
        <div
          className="pointer-events-none absolute z-30 w-[min(17rem,calc(100%-1.5rem))] rounded-xl border border-white/50 bg-white/90 px-3 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.12)] backdrop-blur-md"
          style={{
            left: `${getCardLeftPercent(activeHotspot.x)}%`,
            top: `${activeHotspot.y}%`,
            transform: getCardTransform(activeHotspot.y),
          }}
        >
          <p className={`font-extended text-black ${pdpType.label}`}>
            {activeHotspot.title}
          </p>
          <p className={`mt-1 text-neutral-600 ${pdpType.caption}`}>
            {activeHotspot.body}
          </p>
        </div>
      ) : null}
    </div>
  );
}

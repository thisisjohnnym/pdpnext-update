"use client";

import { PDP_PRODUCT_CARD } from "../pdp-media";

/** Design 3ZK-0 card row — 90% width, white, right-aligned; parent supplies the transparent full-width wrapper */
export function PdpHeroProductCard() {
  return (
    <div
      data-hero-immersive="card"
      className="flex w-[90%] flex-col gap-0.5 bg-white pl-3 pt-3 pr-2"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-extended text-[18px] leading-[1.15] text-black">
          {PDP_PRODUCT_CARD.lineOneLeft}
        </p>
        <p className="font-extended text-right text-[18px] leading-[1.15] text-black">
          {PDP_PRODUCT_CARD.lineOneRight}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="font-extended text-[18px] leading-[1.15] text-black">
          {PDP_PRODUCT_CARD.lineTwoLeft}
        </p>
        <p className="font-extended text-right text-[18px] leading-[1.15] text-black">
          {PDP_PRODUCT_CARD.lineTwoRight}
        </p>
      </div>
    </div>
  );
}

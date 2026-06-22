"use client";

import { PDP_PRODUCT_CARD } from "../pdp-media";
import { PdpHeroProductCard } from "./pdp-hero-product-card";

/** Design product Title — card + description, bottom-anchored overlap block */
export function PdpHeroProductBlock() {
  return (
    <div className="pdp-hero-product flex w-full flex-col items-start">
      <div className="flex w-full flex-col items-end self-stretch justify-center">
        <PdpHeroProductCard />
      </div>
      <div
        data-hero-immersive="desc"
        className="mt-[18px] flex w-full flex-col items-end justify-center pr-2"
      >
        <p className="font-extended m-0 w-[70%] whitespace-pre-wrap text-pretty text-left text-[12px] leading-[1.2] text-black/70">
          {PDP_PRODUCT_CARD.description}
        </p>
      </div>
    </div>
  );
}

"use client";

import { Paper360, PdpCapacity } from "./sections/pdp-capacity";
import { PdpAssetsParallax } from "./sections/pdp-assets-parallax";
import { PdpHero } from "./sections/pdp-hero";
import { PdpHotspots } from "./sections/pdp-hotspots";
import { PdpHotspotTicker } from "./sections/pdp-hotspot-ticker";
import { PdpScrubbedVideo } from "./sections/pdp-scrubbed-video";
import { PdpUgc } from "./sections/pdp-ugc";
import { PdpWaysToWear } from "./sections/pdp-ways-to-wear";

export type PdpScrollProps = {
  bagCount?: number;
  onOpenMenu?: () => void;
};

/** Design 3YT-0 scroll stack only */
export function PdpScroll({ bagCount = 0, onOpenMenu }: PdpScrollProps) {
  return (
    <main className="pdp-page flex w-full flex-col bg-white pb-[calc(70px+var(--pdp-fixed-bottom-offset))]">
      <PdpHero bagCount={bagCount} onOpenMenu={onOpenMenu} />
      <PdpAssetsParallax />
      <PdpWaysToWear />
      <PdpUgc />
      <PdpScrubbedVideo />
      <PdpCapacity />
      <PdpHotspotTicker />
      <PdpHotspots />
      <Paper360 />
    </main>
  );
}

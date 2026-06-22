"use client";

import { useState } from "react";

import { PdpAddToBagSheet } from "./overlays/pdp-add-to-bag-sheet";
import { PdpBrowserChromeSync } from "./chrome/pdp-browser-chrome-sync";
import { PdpColorSheet } from "./overlays/pdp-color-sheet";
import {
  DEFAULT_COLOR_ID,
  DEFAULT_SIZE,
  DEFAULT_STYLE_ID,
  PDP_COLORS,
  PDP_STYLES,
  type PdpSize,
} from "./data/pdp-product-data";
import { PdpNavMenu } from "./overlays/pdp-nav-menu";
import { PdpScrollProvider } from "./hooks/use-coalesced-scroll";

import { PdpBottomBar } from "./chrome/pdp-bottom-bar";
import { PdpBottomBlur } from "./chrome/pdp-bottom-blur";
import { PdpGsapSmoother } from "./pdp-gsap-smoother";
import { PdpScroll } from "./pdp-scroll";
import "./pdp.css";

export function PdpView() {
  const [selectedColorId, setSelectedColorId] = useState(DEFAULT_COLOR_ID);
  const [selectedStyleId, setSelectedStyleId] = useState(DEFAULT_STYLE_ID);
  const [selectedSize, setSelectedSize] = useState<PdpSize>(DEFAULT_SIZE);
  const [navOpen, setNavOpen] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const [bagSheetOpen, setBagSheetOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);

  const chromeSuppressed = navOpen || bagSheetOpen || colorSheetOpen;

  const handleAddToBag = () => {
    setBagCount((count) => count + 1);
    setBagSheetOpen(true);
  };

  const handleQuickAddToBag = () => {
    setBagCount((count) => count + 1);
  };

  return (
    <PdpScrollProvider>
      <div className="pdp relative min-h-svh w-full overflow-x-clip bg-white">
        <PdpBrowserChromeSync />
        <PdpGsapSmoother>
          <PdpScroll bagCount={bagCount} onOpenMenu={() => setNavOpen(true)} />
        </PdpGsapSmoother>
        {/*
         * Portal slot for scroll-scrubbed overlays.
         * Sits OUTSIDE the ScrollSmoother wrapper so position:fixed children
         * are viewport-relative and not affected by the smoother's translateY.
         */}
        <div id="pdp-scrubbed-video-portal" />
        <PdpBottomBlur suppressed={chromeSuppressed} />
        <PdpBottomBar
          selectedColorId={selectedColorId}
          selectedStyleId={selectedStyleId}
          selectedSize={selectedSize}
          onOpenColorSheet={() => setColorSheetOpen(true)}
          onAddToBag={handleAddToBag}
          suppressed={chromeSuppressed}
        />
        <PdpNavMenu open={navOpen} onClose={() => setNavOpen(false)} />
        <PdpColorSheet
          colors={PDP_COLORS}
          styles={PDP_STYLES}
          selectedColorId={selectedColorId}
          selectedStyleId={selectedStyleId}
          selectedSize={selectedSize}
          open={colorSheetOpen}
          onClose={() => setColorSheetOpen(false)}
          onSelectColor={setSelectedColorId}
          onSelectStyle={setSelectedStyleId}
          onSelectSize={setSelectedSize}
        />
        <PdpAddToBagSheet
          open={bagSheetOpen}
          onClose={() => setBagSheetOpen(false)}
          selectedColorId={selectedColorId}
          onQuickAdd={handleQuickAddToBag}
        />
      </div>
    </PdpScrollProvider>
  );
}

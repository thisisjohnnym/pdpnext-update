"use client";

import { useState } from "react";

import { PdpAddToBagSheet } from "./pdp-add-to-bag-sheet";
import { PdpBottomActions } from "./pdp-bottom-actions";
import { DEFAULT_COLOR_ID } from "./pdp-data";
import { PdpGalleryView } from "./pdp-gallery-view";
import { PdpOverlayHeader } from "./pdp-overlay-header";
import { PdpReviewsSheet } from "./pdp-reviews-sheet";

export function PdpSocialView() {
  const [selectedColorId, setSelectedColorId] = useState(DEFAULT_COLOR_ID);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [bagSheetOpen, setBagSheetOpen] = useState(false);
  const [bagCount, setBagCount] = useState(0);

  const handleAddToBag = () => {
    setBagCount((count) => count + 1);
    setBagSheetOpen(true);
  };

  const handleQuickAddToBag = () => {
    setBagCount((count) => count + 1);
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-black">
      <PdpGalleryView onOpenReviews={() => setReviewsOpen(true)} />

      <PdpOverlayHeader bagCount={bagCount} />
      <PdpBottomActions
        selectedColorId={selectedColorId}
        onColorSelect={setSelectedColorId}
        onAddToBag={handleAddToBag}
      />
      <PdpReviewsSheet open={reviewsOpen} onClose={() => setReviewsOpen(false)} />
      <PdpAddToBagSheet
        open={bagSheetOpen}
        onClose={() => setBagSheetOpen(false)}
        selectedColorId={selectedColorId}
        onQuickAdd={handleQuickAddToBag}
      />
    </div>
  );
}

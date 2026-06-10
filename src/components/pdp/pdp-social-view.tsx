"use client";

import { useState } from "react";

import { PdpBottomActions } from "./pdp-bottom-actions";
import { DEFAULT_COLOR_ID } from "./pdp-data";
import { PdpGalleryView } from "./pdp-gallery-view";
import { PdpOverlayHeader } from "./pdp-overlay-header";
import { PdpReviewsSheet } from "./pdp-reviews-sheet";

export function PdpSocialView() {
  const [selectedColorId, setSelectedColorId] = useState(DEFAULT_COLOR_ID);
  const [reviewsOpen, setReviewsOpen] = useState(false);

  return (
    <div className="relative min-h-[100dvh] w-full bg-black">
      <PdpGalleryView onOpenReviews={() => setReviewsOpen(true)} />

      <PdpOverlayHeader />
      <PdpBottomActions
        selectedColorId={selectedColorId}
        onColorSelect={setSelectedColorId}
      />
      <PdpReviewsSheet open={reviewsOpen} onClose={() => setReviewsOpen(false)} />
    </div>
  );
}

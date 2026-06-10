"use client";

import { useEffect, useRef } from "react";

import { PDP_GALLERY_HERO_VIDEO } from "./pdp-data";

type PdpGalleryHeroVideoProps = {
  className?: string;
  isActive?: boolean;
};

export function PdpGalleryHeroVideo({
  className,
  isActive = true,
}: PdpGalleryHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      void video.play().catch(() => {
        /* ignored — user gesture may be required in strict browsers */
      });
      return;
    }

    video.pause();
  }, [isActive]);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label="360° product view of Tabby 26 shoulder bag"
      className={className}
    >
      <source src={PDP_GALLERY_HERO_VIDEO} type="video/webm" />
    </video>
  );
}

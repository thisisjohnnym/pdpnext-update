"use client";

import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpUgcVideo } from "./pdp-data";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";

type PdpUgcVideoCardProps = {
  video: PdpUgcVideo;
  scrollRoot: HTMLElement | null;
  className?: string;
};

/** 9:16 TikTok clip — autoplays when snapped into view */
export function PdpUgcVideoCard({
  video,
  scrollRoot,
  className,
}: PdpUgcVideoCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isActive) {
      setMounted(true);
    }
  }, [isActive]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !scrollRoot) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { root: scrollRoot, threshold: [0, 0.35, 0.55, 0.85] },
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, [scrollRoot]);

  return (
    <article
      ref={cardRef}
      className={cn(
        "pdp-ugc-video-card relative flex shrink-0 flex-col",
        className,
      )}
    >
      <div
        data-coverflow-layer
        className="pdp-ugc-coverflow-layer relative aspect-[9/16] w-full overflow-hidden rounded-[14px] bg-black"
      >
        {mounted ? (
          <PdpGalleryHeroVideo
            decoderId={video.id}
            src={video.src}
            poster={video.poster}
            ariaLabel={video.alt}
            isActive={isActive}
            preload={isActive ? "auto" : "metadata"}
            skeletonTone="dark"
            allowHorizontalPan
            tapToTogglePlayback
            showMuteControl
            className="size-full object-cover object-center"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-neutral-900"
            style={
              video.poster
                ? {
                    backgroundImage: `url(${video.poster})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          />
        )}

        <div className="pointer-events-none absolute bottom-3 left-3 z-[1] max-w-[calc(100%-3rem)] drop-shadow-[0_1px_4px_rgba(0,0,0,0.65)]">
          <p className="font-extended text-sm tracking-[0.2px] text-white">
            {video.handle}
            {video.verified ? (
              <MaterialIcon
                name="verified"
                size={18}
                className="ml-1 inline-block align-middle text-white/90"
              />
            ) : null}
          </p>
        </div>
      </div>
    </article>
  );
}

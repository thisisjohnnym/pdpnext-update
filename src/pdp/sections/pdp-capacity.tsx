"use client";

import { useEffect, useRef, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { useDownwardRevealKey } from "../hooks/use-downward-reveal-key";
import { useScrollParallaxProgress } from "../hooks/use-scroll-parallax-progress";
import { useSmoothedScrollProgress } from "../hooks/use-smoothed-scroll-progress";
import {
  PDP_360,
  PDP_360_CAPTION,
  PDP_CAPACITY,
  PDP_CAPACITY_CAPTION,
  PDP_CAPACITY_CTA,
} from "../pdp-media";
import { getInsetMorphStyle } from "../primitives/pdp-inset-morph";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

type PdpInsetVideoProps = {
  variant: "capacity" | "360";
};

function PdpInsetVideoPlayer({
  src,
  poster,
  alt,
  isActive,
  showMuteControl,
}: {
  src: string;
  poster: string;
  alt: string;
  isActive: boolean;
  showMuteControl?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (isActive) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isActive]);

  return (
    <div className="relative size-full">
      <video
        ref={videoRef}
        className="size-full object-cover object-center"
        src={src}
        poster={poster}
        muted={muted}
        loop
        playsInline
        aria-label={alt}
      />
      {showMuteControl ? (
        <button
          type="button"
          aria-label={muted ? "Unmute video" : "Mute video"}
          onClick={() => setMuted((value) => !value)}
          className="absolute bottom-3 right-3 flex size-9 items-center justify-center rounded-full bg-black/45 text-white"
        >
          <MaterialIcon name={muted ? "volume_off" : "volume_up"} size={20} />
        </button>
      ) : null}
    </div>
  );
}

/** Design 558-0/55A-0 and 40N-0/40J-0 — full bleed video scrubs into inset card */
export function PdpInsetVideo({ variant }: PdpInsetVideoProps) {
  const isCapacity = variant === "capacity";
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const rawProgress = useScrollParallaxProgress(sectionRef);
  const progress = useSmoothedScrollProgress(rawProgress);
  const captionRevealKey = useDownwardRevealKey(captionRef);
  const captionOpacity = clamp01((progress - 0.7) / 0.3);
  const [isActive, setIsActive] = useState(false);

  const slide = isCapacity ? PDP_CAPACITY : PDP_360;
  const caption = isCapacity ? PDP_CAPACITY_CAPTION : PDP_360_CAPTION;
  const sectionId = isCapacity ? "pdp-capacity" : "pdp-360";
  const capacityCaptionTop = `calc((var(--pdp-inset-pad-sm) + var(--pdp-inset-media-height) + 16px) * ${progress})`;
  const captionStyle = isCapacity
    ? {
        opacity: captionOpacity,
        paddingTop: capacityCaptionTop,
      }
    : {
        opacity: captionOpacity,
        top: "calc(var(--pdp-inset-pad-sm) + var(--pdp-inset-media-height) + (20 * var(--pdp-scale) * 1px))",
        left: "var(--pdp-inset-pad-sm)",
        width: "var(--pdp-inset-width-360)",
      };

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.25);
      },
      { threshold: [0, 0.25, 0.5] },
    );

    observer.observe(media);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className={cn(
        "pdp-inset-module bg-white px-0 py-0",
        isCapacity ? "pdp-inset-module--capacity" : "pdp-inset-module--360",
      )}
    >
      <div className="relative size-full min-h-[inherit]">
        <div
          ref={mediaRef}
          className="overflow-hidden bg-neutral-100"
          style={getInsetMorphStyle(progress, isCapacity ? "centered" : "left", {
            padVar: "var(--pdp-inset-pad-sm)",
            widthVar: isCapacity ? undefined : "var(--pdp-inset-width-360)",
          })}
        >
          <PdpInsetVideoPlayer
            src={slide.videoSrc}
            poster={slide.poster}
            alt={slide.alt}
            isActive={isActive}
            showMuteControl={isCapacity}
          />
        </div>

        <div
          ref={captionRef}
          className={cn(
            "pdp-caption-wrap",
            isCapacity
              ? "relative z-[1] px-[var(--pdp-inset-pad-sm)]"
              : "absolute",
          )}
          style={captionStyle}
          aria-hidden={captionOpacity <= 0.05}
        >
          <div
            key={captionRevealKey}
            className={cn(
              "pdp-text-reveal-target",
              captionRevealKey > 0 &&
                "motion-safe:animate-[pdp-text-reveal_var(--pdp-duration)_var(--pdp-ease)_both]",
            )}
          >
            <p className="pdp-reveal-copy font-extended m-0 whitespace-pre-wrap text-[16px] leading-[1.2] text-black">
              {caption}
            </p>
            {isCapacity ? (
              <div className="mt-3 flex items-center gap-0.5">
                <a
                  href={PDP_CAPACITY_CTA.href}
                  className="font-extended h-4 shrink-0 text-[12px] leading-4 tracking-[0.2px] text-black underline underline-offset-4"
                >
                  {PDP_CAPACITY_CTA.label}
                </a>
                <MaterialIcon name="arrow_forward" size={18} className="text-black" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PdpCapacity() {
  return <PdpInsetVideo variant="capacity" />;
}

export function Paper360() {
  return <PdpInsetVideo variant="360" />;
}

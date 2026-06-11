"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpSignatureSound } from "./pdp-data";
import { galleryImageUtilityPillClass } from "./pdp-gallery-image-utility";

type GallerySoundControl = {
  isActive: (id: string) => boolean;
  toggle: (id: string, src: string) => void;
};

/** Frosted play pill — previews what you'll hear on a still frame */
export function PdpGallerySoundPlayOverlay({
  sound,
  soundControl,
  className,
}: {
  sound: PdpSignatureSound;
  soundControl: GallerySoundControl;
  className?: string;
}) {
  const active = soundControl.isActive(sound.id);

  return (
    <button
      type="button"
      onClick={() => soundControl.toggle(sound.id, sound.audioSrc)}
      aria-pressed={active}
      aria-label={active ? `Stop ${sound.label}` : sound.label}
      className={galleryImageUtilityPillClass(className)}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full bg-black/8",
          active && "bg-black/12",
        )}
      >
        <MaterialIcon
          name={active ? "pause" : "play_arrow"}
          size={20}
          className={cn("text-neutral-900", active && "animate-pulse")}
        />
      </span>
      <span className="font-extended min-w-0 text-[11px] leading-tight tracking-[0.2px] text-neutral-900">
        {active ? sound.playingHint : sound.hint}
      </span>
    </button>
  );
}

"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_SIGNATURE_SOUNDS, type PdpSignatureSound } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { pdpPressableClass } from "./pdp-type";
import { useSignatureSound } from "./use-signature-sound";

const SOUND_WAVE_HEIGHTS = [38, 68, 100, 58, 34];

function SoundWaveBars({
  active,
  variant = "default",
}: {
  active: boolean;
  variant?: "default" | "onDark";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-5 w-7 shrink-0 items-end justify-between",
        variant === "onDark"
          ? active
            ? "text-white"
            : "text-white/55"
          : active
            ? "text-black"
            : "text-neutral-400",
      )}
    >
      {SOUND_WAVE_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={cn(
            "pdp-sound-wave-bar w-0.5 rounded-full bg-current",
            active && "animate-pdp-sound-wave",
          )}
          style={{
            height: `${height}%`,
            animationDelay: active ? `${index * 0.11}s` : undefined,
          }}
        />
      ))}
    </span>
  );
}

function SignatureSoundHeroCard({
  sound,
  active,
  onToggle,
}: {
  sound: PdpSignatureSound;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? `Stop ${sound.label}` : sound.label}
      className={cn(
        "group relative block w-full overflow-hidden bg-black text-left transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
        pdpPressableClass,
      )}
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={sound.imageSrc}
          alt={sound.imageAlt}
          fill
          className="object-cover transition-[transform,filter] duration-500 ease-out group-active:scale-[1.02]"
          style={{ objectPosition: sound.objectPosition ?? "center center" }}
          sizes="100vw"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5"
        />

        <div className="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-4 p-4">
          <p className="font-extended min-w-0 flex-1 text-sm tracking-[0.2px] text-white">
            {sound.label}
          </p>

          <span className="flex shrink-0 items-center gap-2.5 pb-0.5">
            <SoundWaveBars active={active} variant="onDark" />
            <MaterialIcon
              name={active ? "pause" : "play_arrow"}
              size={24}
              className="shrink-0 text-white"
            />
          </span>
        </div>
      </div>
    </button>
  );
}

/** Tap-to-hear product sounds — turnlock, zipper, bag opening */
export function PdpSignatureSoundsModule() {
  const { title, sounds } = PDP_SIGNATURE_SOUNDS;
  const { toggle, isActive } = useSignatureSound();

  return (
    <section
      data-header-surface="light"
      className={cn(
        "relative w-full shrink-0 overflow-x-clip bg-neutral-100 pt-16 pb-3",
      )}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <PdpModuleHeading>{title}</PdpModuleHeading>

          <ul className="flex flex-col gap-3">
            {sounds.map((sound) => (
              <li key={sound.id}>
                <SignatureSoundHeroCard
                  sound={sound}
                  active={isActive(sound.id)}
                  onToggle={() => toggle(sound.id, sound.audioSrc)}
                />
              </li>
            ))}
          </ul>
        </GridItem>
      </PageGrid>
    </section>
  );
}

"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_SIGNATURE_SOUNDS, type PdpSignatureSound } from "./pdp-data";
import { pdpModuleHeadingClass, pdpModuleSectionClass, pdpModuleHeadingLeadClass } from "./pdp-module-section";
import { useSignatureSound } from "./use-signature-sound";

const SOUND_WAVE_HEIGHTS = [38, 68, 100, 58, 34];

function SoundWaveBars({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-5 w-7 shrink-0 items-end justify-between",
        active ? "text-black" : "text-neutral-400",
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

function SignatureSoundRow({
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
        "group flex w-full min-h-[3.75rem] items-center gap-3 border-0 px-3 py-3 text-left transition-colors duration-200",
        active ? "bg-neutral-100" : "bg-white active:bg-neutral-50",
      )}
    >
      <span className="relative size-12 shrink-0 overflow-hidden bg-neutral-100">
        <Image
          src={sound.imageSrc}
          alt=""
          fill
          className="object-cover object-center"
          sizes="48px"
        />
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/25 transition-opacity",
            active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
        >
          <MaterialIcon
            name={active ? "graphic_eq" : "volume_up"}
            size={18}
            className={cn("text-white", active && "animate-pulse")}
          />
        </span>
      </span>

      <span className="min-w-0 flex-1">
        <span className="font-extended block text-sm tracking-[0.2px] text-black">
          {sound.label}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-2.5">
        <SoundWaveBars active={active} />
        <MaterialIcon
          name={active ? "pause" : "play_arrow"}
          size={24}
          className={cn(
            "shrink-0 transition-colors",
            active ? "text-black" : "text-neutral-400",
          )}
        />
      </span>
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
        pdpModuleSectionClass({ variant: "muted", rhythm: "roomy" }),
        "pb-20",
      )}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <h2
            className={cn(
              pdpModuleHeadingClass({ lead: false }),
              pdpModuleHeadingLeadClass(),
            )}
          >
            {title}
          </h2>

          <ul className="flex flex-col gap-3">
            {sounds.map((sound) => (
              <li key={sound.id}>
                <SignatureSoundRow
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

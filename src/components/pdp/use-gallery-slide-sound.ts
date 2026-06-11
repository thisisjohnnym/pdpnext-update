"use client";

import { useEffect, useRef } from "react";

import type { useSignatureSound } from "./use-signature-sound";

/** Stop layered gallery audio when the frame scrolls out of view */
export function useGallerySlideSoundLifecycle(
  soundId: string | undefined,
  soundControl: ReturnType<typeof useSignatureSound>,
) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!soundId) {
      return;
    }

    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && soundControl.isActive(soundId)) {
          soundControl.stop();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [soundControl, soundId]);

  return sectionRef;
}

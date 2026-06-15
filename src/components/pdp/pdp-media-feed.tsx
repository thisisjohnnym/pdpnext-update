"use client";

import Image from "next/image";

import { PDP_MEDIA_SLIDES } from "./pdp-data";

export function PdpMediaFeed() {
  return (
    <div className="h-svh w-full snap-y snap-mandatory overflow-y-scroll overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {PDP_MEDIA_SLIDES.map((slide) => (
        <section
          key={slide.src}
          className="relative h-svh w-full shrink-0 snap-start snap-always"
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slide.src === PDP_MEDIA_SLIDES[0].src}
            className="object-cover"
            sizes="100vw"
          />
          <div aria-hidden className="absolute inset-0 bg-black/10" />
        </section>
      ))}
    </div>
  );
}

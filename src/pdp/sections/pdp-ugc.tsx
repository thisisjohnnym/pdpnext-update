"use client";

import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";

import { PDP_UGC } from "../pdp-media";

/** Design 4CP-0 — split heading + horizontal UGC rail */
export function PdpUgc() {
  const { heading, followCta, videos } = PDP_UGC;

  return (
    <section id="pdp-ugc" className="bg-white px-0 pb-6 pt-20">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start gap-2">
          <div className="shrink-0 self-stretch">
            <div className="flex flex-col items-center self-stretch justify-center">
              <h2 className="font-extended m-0 w-[60%] whitespace-pre-wrap text-[30px] leading-[115%] text-black [text-wrap:balance]">
                {heading.primary}
              </h2>
            </div>
            <div className="flex flex-col items-end self-stretch justify-center">
              <p className="font-extended m-0 w-[70%] whitespace-pre-wrap text-[30px] leading-[115%] text-black [text-wrap:balance]">
                {heading.secondary}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center self-stretch">
            <a
              href={followCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-extended h-4 shrink-0 text-[12px] leading-4 tracking-[0.2px] text-black underline underline-offset-4"
            >
              {followCta.label}
            </a>
            <MaterialIcon name="arrow_forward" size={18} className="text-black" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 self-stretch overflow-x-clip px-[37px]" aria-label="TikTok videos">
            {videos.map((video) => (
              <article
                key={video.id}
                className="relative h-[533px] w-[300px] shrink-0 overflow-hidden bg-neutral-100"
              >
                {video.poster ? (
                  <Image
                    src={video.poster}
                    alt={video.alt}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                ) : null}
                <div className="absolute bottom-3 left-3 flex items-center gap-1">
                  <p className="m-0 whitespace-pre text-[12px] leading-4 text-white">
                    {video.handle}
                  </p>
                  <MaterialIcon name="verified" size={18} className="text-white" />
                </div>
                <MaterialIcon name="volume_off" size={20} className="absolute right-3 top-3 text-white" />
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}

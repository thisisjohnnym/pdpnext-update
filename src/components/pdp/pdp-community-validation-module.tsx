"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { PDP_COMMUNITY_VALIDATION, type PdpCommunityMediaItem } from "./pdp-data";
import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { PdpGalleryHeroVideo } from "./pdp-gallery-hero-video";
import { pdpType } from "./pdp-type";

function CommunityVideoTile({
  src,
  poster,
  alt,
}: Pick<PdpCommunityMediaItem, "src" | "poster" | "alt">) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.35);
      },
      { threshold: [0, 0.35, 0.6] },
    );

    observer.observe(tile);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={tileRef}
      className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100"
    >
      <PdpGalleryHeroVideo
        decoderId={src}
        src={src}
        ariaLabel={alt}
        isActive={isActive}
        preload={isActive ? "auto" : "metadata"}
        skeletonTone="light"
        showControls={false}
        showMuteControl={false}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      {poster ? (
        <Image
          src={poster}
          alt=""
          aria-hidden
          fill
          className="pointer-events-none absolute inset-0 -z-[1] object-cover object-center"
          sizes="(max-width: 1024px) 80vw, 60vw"
        />
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
      />
      <MaterialIcon
        name="play_circle"
        size={26}
        className="pointer-events-none absolute bottom-2.5 right-2.5 text-white"
      />
    </div>
  );
}

function CommunityContextMeta({ item }: { item: PdpCommunityMediaItem }) {
  if (!item.wearer && !item.colorway) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      {item.wearer ? (
        <p className="font-extended text-xs tracking-[0.2px] text-black">
          {item.wearer}
          {item.verified ? (
            <MaterialIcon
              name="verified"
              size={18}
              className="ml-1 inline-block align-middle text-neutral-700"
            />
          ) : null}
        </p>
      ) : null}
      {item.colorway && item.carry ? (
        <p className={`text-neutral-600 ${pdpType.micro}`}>
          {item.colorway} · {item.carry}
        </p>
      ) : null}
      {item.scenario ? (
        <p className={`text-neutral-800 ${pdpType.micro}`}>{item.scenario}</p>
      ) : null}
      {item.quote ? (
        <p className={`text-neutral-800 ${pdpType.caption}`}>
          &ldquo;{item.quote}&rdquo;
        </p>
      ) : null}
    </div>
  );
}

function CommunityMediaTile({ item }: { item: PdpCommunityMediaItem }) {
  return (
    <figure className="flex flex-col gap-2.5">
      <figcaption className="font-extended text-xs tracking-[0.2px] text-black">
        {item.context ?? item.label}
      </figcaption>

      {item.type === "photo" ? (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 80vw, 60vw"
          />
        </div>
      ) : (
        <CommunityVideoTile src={item.src} poster={item.poster} alt={item.alt} />
      )}

      <CommunityContextMeta item={item} />
    </figure>
  );
}

/** Moment #6 — contextual UGC + creator clips */
export function PdpCommunityValidationModule() {
  const { moment, title, caption, items } = PDP_COMMUNITY_VALIDATION;

  return (
    <section
      id="community-validation"
      className="relative flex min-h-svh w-full shrink-0 flex-col justify-center bg-white py-10"
      style={{ paddingBottom: BOTTOM_CTA_OFFSET }}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex w-full flex-col gap-[13px]">
            <div className="flex flex-col gap-1">
              <p className="font-extended text-[10px] tracking-[0.2px] text-neutral-500">
                {moment}
              </p>
              <p className="font-extended text-xs tracking-[0.2px] text-black">
                {title}
              </p>
            </div>

            <div className="border border-neutral-200 bg-white p-3">
              <div className="flex flex-col gap-5">
                {items.map((item) => (
                  <CommunityMediaTile key={item.id} item={item} />
                ))}
              </div>
            </div>

            <p className="font-extended w-full text-xs leading-[1.35] tracking-[0.2px] text-black">
              {caption}
            </p>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { pdpType } from "./pdp-type";

type PdpGalleryEditorialSlideProps = {
  src: string;
  alt: string;
  caption: string;
  objectPosition?: string;
  secondarySrc?: string;
  secondaryAlt?: string;
  learnMore?: {
    label: string;
    href: string;
  };
  /** Extra bottom inset for the fixed add-to-bag bar */
  reserveBottomCta?: boolean;
};

/** Inset editorial break — narrowed image + caption with generous margins */
export function PdpGalleryEditorialSlide({
  src,
  alt,
  caption,
  objectPosition = "center top",
  secondarySrc,
  secondaryAlt,
  learnMore,
  reserveBottomCta = false,
}: PdpGalleryEditorialSlideProps) {
  return (
    <section
      data-header-surface="light"
      className="relative flex w-full shrink-0 flex-col bg-white py-10 lg:py-14"
      style={reserveBottomCta ? { paddingBottom: BOTTOM_CTA_OFFSET } : undefined}
    >
      <PageGrid fullWidth>
        <GridItem mobile={10} mobileStart={2} desktop={14} desktopStart={6}>
          <div className="flex w-full flex-col gap-4 lg:gap-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
                style={{ objectPosition }}
                sizes="(max-width: 1023px) 78vw, 42vw"
              />
            </div>

            <div
              className={cn(
                "flex w-full flex-col items-start gap-3",
                learnMore && "pb-2 lg:pb-4",
              )}
            >
              <p className={`font-extended m-0 w-full text-black ${pdpType.caption}`}>
                {caption}
              </p>

              {learnMore ? (
                <a
                  href={learnMore.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-2.5 text-sm tracking-[0.2px] text-black transition-colors active:bg-neutral-200/80"
                >
                  <span className="font-extended translate-y-px">{learnMore.label}</span>
                </a>
              ) : null}
            </div>

            {secondarySrc ? (
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={secondarySrc}
                  alt={secondaryAlt ?? ""}
                  fill
                  className="object-cover object-top scale-[1.12]"
                  sizes="(max-width: 1023px) 78vw, 42vw"
                />
              </div>
            ) : null}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

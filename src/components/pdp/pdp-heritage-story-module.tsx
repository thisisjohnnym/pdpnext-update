import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { PDP_HERITAGE_STORY } from "./pdp-data";
import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";

/** Moment #5 — heritage editorial break */
export function PdpHeritageStoryModule() {
  const { moment, title, src, alt, caption } = PDP_HERITAGE_STORY;

  return (
    <section
      className="relative flex min-h-[100dvh] w-full shrink-0 flex-col justify-center bg-white py-10"
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

            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 80vw, 60vw"
              />
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

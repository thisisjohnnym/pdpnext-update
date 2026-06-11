import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { PDP_MATERIAL_STORY } from "./pdp-data";
import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";

/** Moment #4 — macro material details after craftsmanship */
export function PdpMaterialStoryModule() {
  const { moment, title, caption, details } = PDP_MATERIAL_STORY;

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

            <div className="border border-neutral-200 bg-white p-3">
              <div className="grid grid-cols-3 gap-1">
                {details.map((detail) => (
                  <figure key={detail.id} className="flex min-w-0 flex-col gap-2">
                    <div
                      className="relative w-full overflow-hidden bg-neutral-100"
                      style={{ aspectRatio: "4 / 5" }}
                    >
                      <Image
                        src={detail.src}
                        alt={detail.alt}
                        fill
                        className="object-cover object-center scale-[1.15]"
                        sizes="28vw"
                      />
                    </div>
                    <figcaption className="font-extended text-[10px] leading-[1.25] tracking-[0.2px] text-neutral-600">
                      {detail.label}
                    </figcaption>
                  </figure>
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

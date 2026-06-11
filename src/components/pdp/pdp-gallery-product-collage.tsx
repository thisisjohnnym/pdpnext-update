"use client";

import Image from "next/image";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";
import { PDP_GALLERY_PRODUCT_DETAIL_COLLAGE } from "./pdp-data";
import { galleryPanelClassName } from "./pdp-gallery-panel";
import { SCREEN_HEIGHT_STYLE } from "./pdp-viewport-chrome";

const COLLAGE_GAP_CLASS = "gap-2";

function CollageImage({
  src,
  alt,
  objectPosition,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain object-center"
      style={{ objectPosition: objectPosition ?? "center" }}
      sizes={sizes}
      priority={priority}
    />
  );
}

/**
 * Wireframe layout — full-width portrait block on top, two equal squares below.
 * Bottom squares are 1:1 and span the full width (minus gutter) so edges align.
 */
export function PdpGalleryProductCollage({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { hero, secondary } = PDP_GALLERY_PRODUCT_DETAIL_COLLAGE;

  return (
    <section
      data-header-surface="light"
      className={cn(
        "relative flex w-full shrink-0 flex-col overflow-hidden bg-[#ececec]",
        galleryPanelClassName(isLastPanel),
      )}
      style={{
        ...SCREEN_HEIGHT_STYLE,
        paddingBottom: BOTTOM_CTA_OFFSET,
      }}
    >
      <PageGrid fullWidth className="h-full min-h-0">
        <GridItem
          mobile={12}
          desktop={24}
          className="flex h-full min-h-0 flex-col px-3 pt-3"
        >
          <div className={cn("flex h-full min-h-0 w-full flex-col", COLLAGE_GAP_CLASS)}>
            <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-[#ececec]">
              <CollageImage
                src={hero.src}
                alt={hero.alt}
                objectPosition={hero.objectPosition}
                sizes="100vw"
                priority
              />
            </div>

            <div className={cn("grid w-full shrink-0 grid-cols-2", COLLAGE_GAP_CLASS)}>
              {secondary.map((tile) => (
                <div
                  key={tile.src}
                  className="relative aspect-square w-full overflow-hidden bg-[#ececec]"
                >
                  <CollageImage
                    src={tile.src}
                    alt={tile.alt}
                    objectPosition={tile.objectPosition}
                    sizes="50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

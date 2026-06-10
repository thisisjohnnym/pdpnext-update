import Image from "next/image";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";

import {
  PDP_FEATURED_REVIEWS,
  PDP_REVIEW_PHOTOS,
  PDP_REVIEWS_SUMMARY,
} from "./pdp-data";
import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-px" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <MaterialIcon
          key={index}
          name="star"
          size={18}
          filled={index < Math.round(rating)}
          className={
            index < Math.round(rating) ? "text-black" : "text-neutral-300"
          }
        />
      ))}
    </div>
  );
}

/** Editorial reviews break — summary, UGC photos, featured quotes */
export function PdpReviewsModule() {
  const { average, count, recommendPercent } = PDP_REVIEWS_SUMMARY;

  return (
    <section
      className="relative flex min-h-[100dvh] w-full shrink-0 flex-col justify-center bg-white py-10"
      style={{ paddingBottom: BOTTOM_CTA_OFFSET }}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex w-full flex-col gap-7">
            <div className="flex flex-col gap-2.5">
              <p className="font-extended text-xs tracking-[0.2px] text-black">
                Reviews
              </p>

              <div className="flex items-end gap-3">
                <p className="font-extended text-[2rem] leading-none tracking-[0.2px] text-black">
                  {average.toFixed(1)}
                </p>
                <StarRating rating={average} />
              </div>

              <p className="font-extended text-xs leading-[1.35] tracking-[0.2px] text-neutral-600">
                Based on {count} reviews · {recommendPercent}% would recommend
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className="font-extended text-xs tracking-[0.2px] text-black">
                From our community
              </p>

              <div className="flex gap-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PDP_REVIEW_PHOTOS.map((photo) => (
                  <div
                    key={photo.src}
                    className="relative aspect-square w-[42%] shrink-0 overflow-hidden bg-neutral-100"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover object-center"
                      sizes="42vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {PDP_FEATURED_REVIEWS.map((review) => (
                <figure key={review.id} className="flex flex-col gap-2">
                  <StarRating rating={review.rating} />
                  <blockquote className="font-extended text-xs leading-[1.45] tracking-[0.2px] text-black">
                    &ldquo;{review.quote}&rdquo;
                  </blockquote>
                  <figcaption className="font-extended text-[10px] tracking-[0.2px] text-neutral-500">
                    {review.author}
                    {review.verified ? " · Verified buyer" : ""}
                  </figcaption>
                </figure>
              ))}
            </div>

            <button
              type="button"
              className="font-extended w-fit text-xs tracking-[0.2px] text-black underline underline-offset-[3px]"
            >
              Read all {count} reviews
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

import Image from "next/image";

import { cn } from "@/lib/cn";

import type { PdpAsSeenOnCelebrity } from "./pdp-data";
import { pdpCarouselImageClass } from "./pdp-carousel";
import { pdpType } from "./pdp-type";

type PdpAsSeenOnCardProps = {
  celebrity: PdpAsSeenOnCelebrity;
  className?: string;
  imageSizes?: string;
  variant?: "default" | "compact" | "avatar";
};

/** Celebrity sighting — portrait tile or small profile avatar */
export function PdpAsSeenOnCard({
  celebrity,
  className,
  imageSizes = "48vw",
  variant = "default",
}: PdpAsSeenOnCardProps) {
  if (variant === "avatar") {
    return (
      <figure
        className={cn("flex shrink-0 flex-col items-center gap-1.5", className)}
        aria-label={`${celebrity.name}, ${celebrity.context}`}
      >
        <div
          className="relative size-11 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-black/8"
        >
          <Image
            src={celebrity.src}
            alt=""
            fill
            className={cn("object-cover object-center", pdpCarouselImageClass)}
            style={{ objectPosition: celebrity.objectPosition ?? "center" }}
            sizes="44px"
          />
        </div>
        <figcaption className="text-center">
          <p className={`whitespace-nowrap text-neutral-500 ${pdpType.micro}`}>
            {celebrity.name}
          </p>
        </figcaption>
      </figure>
    );
  }

  const compact = variant === "compact";

  return (
    <figure
      className={cn(
        "relative overflow-hidden bg-neutral-100",
        compact ? "aspect-[3/4] rounded-lg" : "aspect-[4/5]",
        className,
      )}
    >
      <Image
        src={celebrity.src}
        alt={celebrity.alt}
        fill
        className={cn("object-cover object-center", pdpCarouselImageClass)}
        style={{ objectPosition: celebrity.objectPosition ?? "center" }}
        sizes={compact ? "32vw" : imageSizes}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent",
          compact
            ? "from-black/55 via-black/20 px-2 pb-2 pt-10"
            : "from-black/70 via-black/30 px-3 pb-3 pt-14",
        )}
      >
        <p
          className={cn(
            "font-extended tracking-[0.2px] text-white",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {celebrity.name}
        </p>
        <p
          className={cn(
            "text-white/75",
            pdpType.micro,
            compact ? "mt-0" : "mt-0.5",
          )}
        >
          {celebrity.context}
        </p>
      </div>
    </figure>
  );
}

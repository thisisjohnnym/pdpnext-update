"use client";

import Image from "next/image";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { getPdpColorSwatch } from "../pdp-color-swatch";
import { PDP_COLORS, PDP_STYLES, type PdpSize } from "../data/pdp-product-data";
import { pdpPressableSolidClass } from "../chrome/pdp-type";
import { useBodyPortalTarget } from "../hooks/use-body-portal-target";

type PdpBottomBarProps = {
  selectedColorId: string;
  selectedStyleId: string;
  selectedSize: PdpSize;
  onOpenColorSheet: () => void;
  onAddToBag: () => void;
  suppressed?: boolean;
};

const BAR_HEIGHT_CSS = "var(--pdp-cta-height)";

/** Design 4SZ-0 — always floating inset CTA stack */
export function PdpBottomBar({
  selectedColorId,
  selectedStyleId,
  selectedSize,
  onOpenColorSheet,
  onAddToBag,
  suppressed = false,
}: PdpBottomBarProps) {
  const portalTarget = useBodyPortalTarget();
  const selectedColor =
    PDP_COLORS.find((color) => color.id === selectedColorId) ?? PDP_COLORS[0]!;
  const selectedStyle =
    PDP_STYLES.find((s) => s.id === selectedStyleId) ?? PDP_STYLES[0]!;

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div
      className="pdp-bottom-bar pdp-bottom-chrome pdp-chrome pointer-events-none fixed inset-x-0 z-[39]"
      style={{
        paddingInline: "var(--pdp-cta-inset)",
        bottom: `calc(var(--pdp-cta-inset) + var(--pdp-fixed-bottom-offset, env(safe-area-inset-bottom, 0px)))`,
      }}
    >
      <div className="pdp-page pointer-events-auto grid w-full grid-cols-2">
        <button
          type="button"
          onClick={suppressed ? undefined : onOpenColorSheet}
          className={cn(
            "flex min-h-[var(--pdp-cta-height)] min-w-0 items-center gap-2 bg-[#1A1A1A] px-3 text-left",
            "pdp-cta-bar-btn",
            pdpPressableSolidClass,
            suppressed && "pdp-cta-bar-btn--suppressed",
          )}
        >
          <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-neutral-700">
            <Image
              src={getPdpColorSwatch(selectedColorId)}
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: "center 82%" }}
              sizes="32px"
            />
          </span>
            <span className="min-w-0 flex-1">
              <span className="block font-extended text-[12px] leading-none tracking-[0.2px] text-white">
                {selectedColor.name}
              </span>
              <span className="mt-1 block font-extended text-[10px] leading-none text-white/70">
                {selectedStyle.name} · {selectedSize}
              </span>
            </span>
          <MaterialIcon
            name="expand_less"
            size={18}
            className="shrink-0 text-white"
            aria-hidden
          />
        </button>

        <button
          type="button"
          onClick={suppressed ? undefined : onAddToBag}
          className={cn(
            "flex min-h-[var(--pdp-cta-height)] items-center justify-center gap-2 bg-[#2563EB] text-white",
            "pdp-cta-bar-btn",
            pdpPressableSolidClass,
            suppressed && "pdp-cta-bar-btn--suppressed",
          )}
        >
          <MaterialIcon name="shopping_bag" size={18} className="text-white" aria-hidden />
          <span className="font-extended text-[12px] leading-none text-white">
            Add to bag
          </span>
        </button>
      </div>
    </div>,
    portalTarget,
  );
}

export const PDP_BOTTOM_BAR_HEIGHT_CSS = BAR_HEIGHT_CSS;

"use client";

import Image from "next/image";
import { type CSSProperties, useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import {
  PDP_BAG_UPSELLS,
  PDP_COLORS,
  PDP_PRODUCT,
} from "../data/pdp-product-data";
import { useBodyPortalTarget } from "../hooks/use-body-portal-target";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
} from "./pdp-bottom-sheet";
import {
  pdpAddIconLabelClass,
  pdpPressableSolidClass,
  pdpStrokeCtaClass,
  pdpStrokeCtaMutedClass,
} from "../chrome/pdp-type";

type PdpAddToBagSheetProps = {
  open: boolean;
  onClose: () => void;
  selectedColorId: string;
  onQuickAdd?: () => void;
};

/** Bottom tray — add-to-bag confirmation and quick-add upsells */
export function PdpAddToBagSheet({
  open,
  onClose,
  selectedColorId,
  onQuickAdd,
}: PdpAddToBagSheetProps) {
  const titleId = useId();
  const [quickAddedIds, setQuickAddedIds] = useState<Set<string>>(new Set());
  const portalTarget = useBodyPortalTarget();

  const selectedColor =
    PDP_COLORS.find((color) => color.id === selectedColorId) ?? PDP_COLORS[0]!;

  const getStaggerStyle = (index: number): CSSProperties => ({
    transitionDelay: open
      ? `calc(var(--pdp-duration) * 0.15 + var(--pdp-overlay-stagger-step) * ${index})`
      : "0ms",
  });

  const handleClose = useCallback(() => {
    setQuickAddedIds(new Set());
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, open]);

  const handleQuickAdd = (id: string) => {
    setQuickAddedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      onQuickAdd?.();
      return new Set(current).add(id);
    });
  };

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div className={pdpBottomSheetOverlayClass({ open })} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Close add to bag"
        className={pdpBottomSheetBackdropClass({ open })}
        onClick={handleClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-state={open ? "open" : "closed"}
        className={pdpBottomSheetPanelClass({ open })}
      >
        <div
          className={cn(pdpBottomSheetHeaderClass, "pdp-overlay-stagger-item")}
          style={getStaggerStyle(0)}
        >
          <div className={pdpBottomSheetGrabHandleClass} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]">
          <div
            className="pdp-overlay-stagger-item flex items-center gap-2 pb-4"
            style={getStaggerStyle(1)}
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black">
              <MaterialIcon name="check" size={18} className="text-white" />
            </span>
            <h2 id={titleId} className={pdpSheetHeadingClass()}>
              Added to your bag
            </h2>
          </div>

          <div
            className="pdp-overlay-stagger-item flex overflow-hidden rounded-lg bg-[#f2f2f2]"
            style={getStaggerStyle(2)}
          >
            <div className="relative min-h-[6.75rem] w-[7.25rem] shrink-0 self-stretch">
              <Image
                src={PDP_PRODUCT.imageSrc}
                alt={PDP_PRODUCT.imageAlt}
                fill
                className="object-cover object-center"
                sizes="116px"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3.5">
              <p className="font-extended text-base tracking-[0.2px] text-black">
                {PDP_PRODUCT.name}
              </p>
              <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600">
                {selectedColor.name} · {PDP_PRODUCT.subtitle}
              </p>
              <p className="font-extended mt-1.5 text-base tracking-[0.2px] text-black">
                {PDP_PRODUCT.price}
              </p>
            </div>
          </div>

          <div
            className="pdp-overlay-stagger-item flex gap-2 py-4"
            style={getStaggerStyle(3)}
          >
            <button
              type="button"
              onClick={handleClose}
              className={cn(
                "font-extended flex h-12 min-w-0 flex-1 items-center justify-center text-sm tracking-[0.2px]",
                pdpStrokeCtaClass,
              )}
            >
              <span className="translate-y-px">Keep shopping</span>
            </button>
            <button
              type="button"
              className={cn(
                "font-extended flex h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-black text-sm tracking-[0.2px] text-white",
                pdpPressableSolidClass,
              )}
            >
              <span className="translate-y-px">Checkout</span>
            </button>
          </div>

          <section className="flex flex-col gap-1.5 pt-3">
            <p
              className="pdp-overlay-stagger-item font-extended text-sm tracking-[0.2px] text-black"
              style={getStaggerStyle(4)}
            >
              Complete the look
            </p>

            <ul className="flex flex-col">
              {PDP_BAG_UPSELLS.map((item, index) => {
                const added = quickAddedIds.has(item.id);

                return (
                  <li
                    key={item.id}
                    className="pdp-overlay-stagger-item border-t border-neutral-200 first:border-t-0"
                    style={getStaggerStyle(Math.min(index, 4) + 5)}
                  >
                    <div className="flex items-center gap-3 py-3">
                      <div className="relative size-20 shrink-0 overflow-hidden bg-neutral-100">
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover object-center"
                          sizes="80px"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-extended truncate text-xs tracking-[0.2px] text-black">
                          {item.name}
                        </p>
                        <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600">
                          {item.price}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(item.id)}
                        disabled={added}
                        className={cn(
                          "font-extended inline-flex shrink-0 items-center justify-center gap-1 px-3.5 py-2 text-xs tracking-[0.2px] transition-colors",
                          added ? pdpStrokeCtaMutedClass : pdpStrokeCtaClass,
                        )}
                      >
                        <span className={pdpAddIconLabelClass}>
                          {added ? "Added" : "Quick add"}
                        </span>
                        <MaterialIcon
                          name="add"
                          size={18}
                          className={cn("shrink-0", added ? "invisible" : "text-black")}
                          aria-hidden={added}
                        />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}

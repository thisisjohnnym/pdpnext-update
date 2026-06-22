"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpColor, PdpSize, PdpStyle } from "../data/pdp-product-data";
import { PDP_SIZES } from "../data/pdp-product-data";
import { getPdpColorSwatch } from "../pdp-color-swatch";
import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { useBodyPortalTarget } from "../hooks/use-body-portal-target";
import { pdpPressableClass, pdpPressableSolidClass, pdpStrokeCtaClass, pdpType } from "../chrome/pdp-type";

// Display name for each size number
const SIZE_LABELS: Record<(typeof PDP_SIZES)[number], string> = {
  20: "Mini",
  26: "Medium",
  33: "Large",
  36: "XL",
};

type PdpColorSheetProps = {
  colors: PdpColor[];
  styles: PdpStyle[];
  selectedColorId: string;
  selectedStyleId: string;
  selectedSize: PdpSize;
  open: boolean;
  onClose: () => void;
  onSelectColor: (id: string) => void;
  onSelectStyle: (id: string) => void;
  onSelectSize: (size: PdpSize) => void;
};

const STAGGER = {
  header: 0,
  closeBtn: 1,
  styleSection: 2,
  sizeSection: 3,
  colorSection: 4,
  footer: 5,
} as const;

/** Utility class set for hiding scrollbars cross-browser */
const scrollRowClass =
  "flex overflow-x-auto scroll-px-3 px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory";

/** Bottom tray — choose style, size, and color */
export function PdpColorSheet({
  colors,
  styles,
  selectedColorId,
  selectedStyleId,
  selectedSize,
  open,
  onClose,
  onSelectColor,
  onSelectStyle,
  onSelectSize,
}: PdpColorSheetProps) {
  const titleId = useId();
  const portalTarget = useBodyPortalTarget();

  // Staged local state — only pushed to parent on Confirm
  const [localColorId, setLocalColorId] = useState(selectedColorId);
  const [localStyleId, setLocalStyleId] = useState(selectedStyleId);
  const [localSize, setLocalSize] = useState<PdpSize>(selectedSize);

  // Sync staged state from parent whenever the sheet opens
  useEffect(() => {
    if (open) {
      setLocalColorId(selectedColorId);
      setLocalStyleId(selectedStyleId);
      setLocalSize(selectedSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const stagger = (index: number): CSSProperties => ({
    transitionDelay: open
      ? `calc(var(--pdp-duration) * 0.22 + var(--pdp-color-sheet-stagger-step) * ${index})`
      : "0ms",
  });

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const handleConfirm = () => {
    onSelectColor(localColorId);
    onSelectStyle(localStyleId);
    onSelectSize(localSize);
    onClose();
  };

  if (!portalTarget) return null;

  return createPortal(
    <div
      className={cn(pdpBottomSheetOverlayClass({ open }), "pdp-color-sheet-overlay")}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close color picker"
        className={pdpBottomSheetBackdropClass({ open })}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-state={open ? "open" : "closed"}
        className={cn(
          pdpBottomSheetPanelClass({ open, maxHeight: "88dvh" }),
          "pdp-color-sheet-panel",
        )}
      >
        {/* Header */}
        <div
          className={cn(pdpBottomSheetHeaderClass, "pdp-color-sheet-stagger-item")}
          style={stagger(STAGGER.header)}
        >
          <div className={pdpBottomSheetGrabHandleClass} />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={cn(pdpBottomSheetCloseButtonClass, "pdp-color-sheet-stagger-item")}
            style={stagger(STAGGER.closeBtn)}
          >
            <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
          </button>
        </div>

        <h2 id={titleId} className="sr-only">
          Choose style, size and color
        </h2>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">

          {/* ── Style ── */}
          <div
            className="pdp-color-sheet-stagger-item pt-0.5"
            style={stagger(STAGGER.styleSection)}
          >
            <p className={cn("px-3 pb-2.5 text-neutral-400", pdpType.micro)}>style</p>
            {/* Equal-width grid — no scroll since the options fit */}
            <div
              role="listbox"
              aria-label="Select style"
              className="grid grid-cols-4 gap-2 px-3"
            >
              {styles.map((style) => {
                const isSelected = style.id === localStyleId;
                return (
                  <button
                    key={style.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setLocalStyleId(style.id)}
                    className={cn("flex flex-col items-center gap-1.5", pdpPressableClass)}
                  >
                    <div
                      className={cn(
                        "relative w-full overflow-hidden rounded-md transition-[outline,box-shadow]",
                        isSelected
                          ? "outline outline-2 outline-black outline-offset-[3px]"
                          : "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]",
                      )}
                      style={{ height: 96 }}
                    >
                      <Image
                        src={style.imageSrc}
                        alt={style.name}
                        fill
                        className="object-cover"
                        style={{ objectPosition: "center center" }}
                        sizes="25vw"
                      />
                    </div>
                    <span className={cn("text-neutral-600", pdpType.micro)}>
                      {style.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mx-3 mt-3.5 border-t border-neutral-100" />

          {/* ── Size ── */}
          <div
            className="pdp-color-sheet-stagger-item pt-3.5"
            style={stagger(STAGGER.sizeSection)}
          >
            <p className={cn("px-3 pb-2.5 text-neutral-400", pdpType.micro)}>size</p>
            {/* Grid fills full width — 4 equal columns, same as style */}
            <div
              role="listbox"
              aria-label="Select size"
              className="grid grid-cols-4 gap-2 px-3"
            >
              {PDP_SIZES.map((size) => {
                const isSelected = size === localSize;
                return (
                  <button
                    key={size}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setLocalSize(size)}
                    className={cn(
                      "flex flex-col items-center gap-1.5",
                      pdpPressableClass,
                    )}
                  >
                    <div
                      className={cn(
                        "flex w-full items-center justify-center rounded-md py-3 transition-colors",
                        isSelected
                          ? "bg-black text-white"
                          : "border border-neutral-200 bg-white text-black",
                      )}
                    >
                      <span className="translate-y-px font-extended text-[18px] leading-none tracking-tight">
                        {size}
                      </span>
                    </div>
                    <span className={cn("text-neutral-600", pdpType.micro)}>
                      {SIZE_LABELS[size]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mx-3 mt-3.5 border-t border-neutral-100" />

          {/* ── Color ── */}
          <div
            className="pdp-color-sheet-stagger-item pb-2 pt-3.5"
            style={stagger(STAGGER.colorSection)}
          >
            <p className={cn("px-3 pb-2.5 text-neutral-400", pdpType.micro)}>color</p>
            <div className="relative">
              <div
                role="listbox"
                aria-label="Select color"
                className={cn(scrollRowClass, "gap-2 pb-1")}
              >
                {colors.map((color) => {
                  const isSelected = color.id === localColorId;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => setLocalColorId(color.id)}
                      className={cn(
                        "snap-start shrink-0 flex flex-col items-center gap-1.5",
                        pdpPressableClass,
                      )}
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden rounded-md transition-[outline,box-shadow]",
                          isSelected
                            ? "outline outline-2 outline-black outline-offset-[3px]"
                            : "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]",
                        )}
                        style={{ width: 96, height: 96 }}
                      >
                        <Image
                          src={getPdpColorSwatch(color.id)}
                          alt=""
                          fill
                          className="object-cover"
                          style={{ objectPosition: "center center" }}
                          sizes="96px"
                        />
                      </div>
                      <span className={cn("text-neutral-600", pdpType.micro)}>
                        {color.name}
                      </span>
                    </button>
                  );
                })}
                {/* Spacer so last item clears the blur overlay */}
                <div className="shrink-0" style={{ width: 48 }} aria-hidden />
              </div>

              {/* Scroll affordance: layered blur + fade at right edge */}
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 overflow-hidden">
                {/* Layer 1 — backdrop blur fading in from the right */}
                <div
                  className="absolute inset-0 backdrop-blur-[4px]"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to left, black 0%, black 20%, transparent 100%)",
                    maskImage:
                      "linear-gradient(to left, black 0%, black 20%, transparent 100%)",
                  }}
                />
                {/* Layer 2 — white fade on top */}
                <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/60 to-transparent" />
              </div>
            </div>
          </div>

          {/* Footer — Confirm / Cancel */}
          <div
            className="pdp-color-sheet-stagger-item shrink-0 border-t border-neutral-100 px-3 pb-[max(16px,var(--pdp-safe-area-bottom))] pt-3 flex flex-col gap-2"
            style={stagger(STAGGER.footer)}
          >
            <button
              type="button"
              onClick={handleConfirm}
              className={cn(
                "font-extended flex h-12 w-full items-center justify-center rounded-full bg-black text-sm tracking-[0.2px] text-white",
                pdpPressableSolidClass,
              )}
            >
              <span className="translate-y-px">Confirm changes</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "font-extended flex h-12 w-full items-center justify-center text-sm tracking-[0.2px]",
                pdpStrokeCtaClass,
              )}
            >
              <span className="translate-y-px">Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}

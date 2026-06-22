"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
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

// The 3 sizes shown in the visual picker — XL is intentionally omitted per design
const PICKER_SIZES = [20, 26, 33] as const;
type PickerSize = (typeof PICKER_SIZES)[number];

// Dedicated size-reference bag images exported from the design file
const SIZE_IMAGES: Record<PickerSize, string> = {
  20: "/img/tabby25/size-selector/tabby-mini.png",
  26: "/img/tabby25/size-selector/tabby-medium.png",
  33: "/img/tabby25/size-selector/tabby-large.png",
};

// ---------------------------------------------------------------------------
// Availability — combos encoded as "styleId|size|colorId"
// "notify"       → out of stock, user can request a notification
// "discontinued" → not offered, hard unavailable
// ---------------------------------------------------------------------------

const NOTIFY_COMBOS: ReadonlySet<string> = new Set([
  "classic|26|canyon",
  "quilted|20|mustard",
  "signature|33|tan",
]);

const DISCONTINUED_COMBOS: ReadonlySet<string> = new Set([
  "classic|26|chalk",
  "quilted|20|olive",
  "pillow|26|oxblood",
]);

type ComboStatus = "available" | "notify" | "discontinued";

const getComboStatus = (styleId: string, size: PdpSize, colorId: string): ComboStatus => {
  const key = `${styleId}|${size}|${colorId}`;
  if (NOTIFY_COMBOS.has(key)) return "notify";
  if (DISCONTINUED_COMBOS.has(key)) return "discontinued";
  return "available";
};

const isComboUnavailable = (styleId: string, size: PdpSize, colorId: string) =>
  getComboStatus(styleId, size, colorId) !== "available";

// Card layout constants — must match the rendered button dimensions
// Card outer width = 88px image + 2×6px padding (p-1.5) = 100px; gap-1 = 4px
const PILL_CARD_W = 100;
const PILL_GAP = 4;
const PILL_TRACK_W = PICKER_SIZES.length * PILL_CARD_W + (PICKER_SIZES.length - 1) * PILL_GAP;

/** Returns the % position (0–100) for the pill centre over card at `index` */
const pillCenterPct = (index: number): number => {
  const centerPx = index * (PILL_CARD_W + PILL_GAP) + PILL_CARD_W / 2;
  return (centerPx / PILL_TRACK_W) * 100;
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

  // Slider drag state
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Map localSize to a picker index (0–2). XL (36) is clamped to Large (index 2).
  const localPickerIndex = Math.max(
    0,
    PICKER_SIZES.indexOf(localSize as PickerSize),
  );

  // Whether an option is visually dimmed (unavailable in any way with current selections)
  const isSizeDimmed = (size: PickerSize) =>
    isComboUnavailable(localStyleId, size, localColorId);
  const isColorDimmed = (colorId: string) =>
    isComboUnavailable(localStyleId, localSize as PickerSize, colorId);
  const isStyleDimmed = (styleId: string) =>
    isComboUnavailable(styleId, localSize as PickerSize, localColorId);

  // CTA state for the currently staged combo
  const stagedComboStatus = getComboStatus(localStyleId, localSize, localColorId);

  const resolveIndexFromClientX = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const idx = Math.round(fraction * (PICKER_SIZES.length - 1));
    setLocalSize(PICKER_SIZES[idx]);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    resolveIndexFromClientX(e.clientX);
  };

  const handleTrackPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    resolveIndexFromClientX(e.clientX);
  };

  const handleTrackPointerUp = () => {
    isDragging.current = false;
  };

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
                const dimmed = isStyleDimmed(style.id);
                return (
                  <button
                    key={style.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => setLocalStyleId(style.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5",
                      dimmed ? "opacity-40" : "",
                      pdpPressableClass,
                    )}
                  >
                    <div
                      className={cn(
                        "relative w-full overflow-hidden rounded-md bg-[#f0f0f0] transition-[outline,box-shadow]",
                        isSelected
                          ? "outline outline-2 outline-black outline-offset-[3px]"
                          : "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]",
                      )}
                      style={{ height: 72 }}
                    >
                      <Image
                        src={style.imageSrc}
                        alt={style.name}
                        fill
                        className="object-contain scale-[1.2]"
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
            <p className={cn("px-3 pb-3 text-neutral-400", pdpType.micro)}>size</p>

            {/* Cards + slider share a fit-width container so the track spans exactly the cards */}
            <div className="flex flex-col w-fit mx-auto">
              <div
                role="listbox"
                aria-label="Select size"
                className="flex items-end gap-1"
              >
                {PICKER_SIZES.map((size) => {
                  const isSelected = size === localSize;
                  const dimmed = isSizeDimmed(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => setLocalSize(size)}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-[15px] p-1.5",
                        isSelected ? "bg-[#F1EFF2]" : "bg-transparent",
                        dimmed ? "opacity-40" : "",
                        pdpPressableClass,
                      )}
                    >
                      {/* Fixed image container — concentric radius: 15 - 6 = 9px */}
                      <div
                        className="relative overflow-hidden rounded-[9px] shrink-0"
                        style={{ width: 88, height: 110 }}
                      >
                      <Image
                        src={SIZE_IMAGES[size]}
                        alt={`${SIZE_LABELS[size]} bag`}
                        fill
                        className="object-contain scale-[1.4]"
                        sizes="88px"
                      />
                      </div>
                      {/* Label — visible only on selected item */}
                      <span
                        className={cn(
                          pdpType.micro,
                          "transition-opacity duration-200",
                          isSelected ? "opacity-100 text-black" : "opacity-0",
                        )}
                        aria-hidden={!isSelected}
                      >
                        {SIZE_LABELS[size]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Draggable slider — width = cards row, pill snaps to 3 positions */}
              <div className="w-full pt-4 pb-0.5">
                <div
                  ref={trackRef}
                  role="slider"
                  aria-label="Select size"
                  aria-valuemin={0}
                  aria-valuemax={PICKER_SIZES.length - 1}
                  aria-valuenow={localPickerIndex}
                  aria-valuetext={SIZE_LABELS[localSize]}
                  className="relative flex h-0.5 w-full items-center rounded-full bg-neutral-200 cursor-pointer touch-none"
                  onPointerDown={handleTrackPointerDown}
                  onPointerMove={handleTrackPointerMove}
                  onPointerUp={handleTrackPointerUp}
                >
                  <div
                    aria-hidden
                    className="absolute top-1/2 flex items-center justify-center gap-[3px] rounded-full bg-black px-[13px] py-[5px]"
                    style={{
                      left: `${pillCenterPct(localPickerIndex)}%`,
                      transform: "translateX(-50%) translateY(-50%)",
                      transition: "left 380ms cubic-bezier(0.34, 1.3, 0.64, 1)",
                    }}
                  >
                    <span className="h-1.5 w-px rounded-full bg-white/30 shrink-0" />
                    <span className="h-1.5 w-px rounded-full bg-white/30 shrink-0" />
                  </div>
                </div>
              </div>
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
                className={cn(scrollRowClass, "gap-2 py-[5px]")}
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
                        isColorDimmed(color.id) ? "opacity-40" : "",
                        pdpPressableClass,
                      )}
                    >
                      <div
                        className={cn(
                          "relative overflow-hidden rounded-md bg-[#f0f0f0] transition-[outline,box-shadow]",
                          isSelected
                            ? "outline outline-2 outline-black outline-offset-[3px]"
                            : "shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]",
                        )}
                        style={{ width: 96, height: 72 }}
                      >
                          <Image
                          src={getPdpColorSwatch(color.id)}
                          alt=""
                          fill
                          className="object-contain scale-[1.2]"
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

          {/* Footer — CTA adapts to staged combo availability */}
          <div
            className="pdp-color-sheet-stagger-item shrink-0 border-t border-neutral-100 px-3 pb-[max(16px,var(--pdp-safe-area-bottom))] pt-3 flex flex-col gap-2"
            style={stagger(STAGGER.footer)}
          >
            {stagedComboStatus === "available" && (
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
            )}

            {stagedComboStatus === "notify" && (
              <button
                type="button"
                className={cn(
                  "font-extended flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm tracking-[0.2px] text-white",
                  pdpPressableSolidClass,
                )}
              >
                <MaterialIcon name="mail" size={18} className="shrink-0" aria-hidden />
                <span className="translate-y-px">Notify me</span>
              </button>
            )}

            {stagedComboStatus === "discontinued" && (
              <button
                type="button"
                disabled
                className="font-extended flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-neutral-100 text-sm tracking-[0.2px] text-neutral-400"
              >
                <span className="translate-y-px">Not available</span>
              </button>
            )}

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

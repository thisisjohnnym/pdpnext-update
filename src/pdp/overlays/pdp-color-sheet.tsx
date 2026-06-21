"use client";

import { type CSSProperties, useEffect, useId } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpColor } from "../data/pdp-product-data";
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
import { PdpTextLinkCta } from "../primitives/pdp-text-link-cta";
import { pdpPressableClass, pdpType } from "../chrome/pdp-type";

type PdpColorSheetProps = {
  colors: PdpColor[];
  selectedId: string;
  open: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
};

/** Bottom tray — choose a product colorway */
export function PdpColorSheet({
  colors,
  selectedId,
  open,
  onClose,
  onSelect,
}: PdpColorSheetProps) {
  const titleId = useId();
  const portalTarget = useBodyPortalTarget();
  const footerStaggerIndex = Math.min(colors.length, 6) + 4;

  const getStaggerStyle = (index: number): CSSProperties => ({
    transitionDelay: open
      ? `calc(var(--pdp-duration) * 0.22 + var(--pdp-color-sheet-stagger-step) * ${index})`
      : "0ms",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  if (!portalTarget) {
    return null;
  }

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
        className={cn(pdpBottomSheetPanelClass({ open }), "pdp-color-sheet-panel")}
      >
        <div
          className={cn(pdpBottomSheetHeaderClass, "pdp-color-sheet-stagger-item")}
          style={getStaggerStyle(0)}
        >
          <div className={pdpBottomSheetGrabHandleClass} />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={cn(
              pdpBottomSheetCloseButtonClass,
              "pdp-color-sheet-stagger-item",
            )}
            style={getStaggerStyle(1)}
          >
            <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-0.5",
              "pdp-color-sheet-stagger-item",
            )}
            style={getStaggerStyle(2)}
          >
            <h2 id={titleId} className="sr-only">
              Choose a color
            </h2>

            <ul
              role="listbox"
              aria-label="Select color"
              className="m-0 flex list-none flex-col divide-y divide-neutral-100"
            >
              {colors.map((color, index) => {
                const isSelected = color.id === selectedId;

                return (
                  <li key={color.id} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(color.id)}
                      className={cn(
                        "pdp-color-sheet-stagger-item flex w-full items-center gap-3 py-2.5 text-left transition-colors",
                        pdpPressableClass,
                      )}
                      style={getStaggerStyle(Math.min(index, 6) + 3)}
                    >
                      <span
                        aria-hidden
                        className="size-10 shrink-0 rounded-full border border-black/5"
                        style={{ backgroundColor: color.chromeSample }}
                      />
                      <span className={cn("min-w-0 flex-1 text-black", pdpType.label)}>
                        {color.name}
                      </span>
                      {isSelected ? (
                        <MaterialIcon
                          name="check"
                          size={18}
                          className="shrink-0 text-black"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className={cn(
              "pdp-color-sheet-stagger-item shrink-0 border-t border-neutral-100 px-3 pb-[max(16px,var(--pdp-safe-area-bottom))] pt-2.5",
            )}
            style={getStaggerStyle(footerStaggerIndex)}
          >
            <PdpTextLinkCta
              type="button"
              className={cn("w-full justify-between gap-2 py-1", pdpType.label)}
            >
              Customize
            </PdpTextLinkCta>
          </div>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}

"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpColor } from "./pdp-data";
import {
  pdpBottomSheetBackdropClass,
  pdpBottomSheetCloseButtonClass,
  pdpBottomSheetGrabHandleClass,
  pdpBottomSheetHeaderClass,
  pdpBottomSheetOverlayClass,
  pdpBottomSheetPanelClass,
  PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE,
} from "./pdp-bottom-sheet";
import { PdpTextLinkCta } from "./pdp-text-link-cta";
import { pdpPressableClass, pdpType } from "./pdp-type";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className={pdpBottomSheetOverlayClass({ open })}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close color picker"
        className={pdpBottomSheetBackdropClass()}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={pdpBottomSheetPanelClass({ open })}
      >
        <div className={pdpBottomSheetHeaderClass}>
          <div className={pdpBottomSheetGrabHandleClass} />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className={pdpBottomSheetCloseButtonClass}
          >
            <MaterialIcon name="close" size={PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE} />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pt-0.5">
            <h2 id={titleId} className="sr-only">
              Choose a color
            </h2>

            <ul
              role="listbox"
              aria-label="Select color"
              className="m-0 flex list-none flex-col divide-y divide-neutral-100"
            >
              {colors.map((color) => {
                const isSelected = color.id === selectedId;

                return (
                  <li key={color.id} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(color.id)}
                      className={cn(
                        "flex w-full items-center gap-3 py-2.5 text-left transition-colors",
                        pdpPressableClass,
                      )}
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

          <div className="shrink-0 border-t border-neutral-100 px-3 pb-[max(16px,var(--pdp-safe-area-bottom))] pt-2.5">
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
    document.body,
  );
}

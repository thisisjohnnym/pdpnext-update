"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpColorSelector } from "./pdp-color-selector";
import { PDP_COLORS } from "./pdp-data";
import { BOTTOM_CHROME_OFFSET } from "./pdp-viewport-chrome";
import { pdpPressableSolidClass } from "./pdp-type";
import { useBottomBarDocked } from "./use-bottom-bar-docked";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
  /** Hide while a sheet/modal is open */
  suppressed?: boolean;
};

/** Fixed bottom chrome — docked flush on hero, floating pills on scroll */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
  suppressed = false,
}: PdpBottomActionsProps) {
  const [mounted, setMounted] = useState(false);
  const [colorSheetOpen, setColorSheetOpen] = useState(false);
  const { docked, frostOpacity } = useBottomBarDocked();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const bar = (
    <div
      className={cn(
        "pdp-hero-bottom-enter transition-[gap,padding] duration-300 ease-out",
        docked
          ? "grid w-full grid-cols-2 gap-0"
          : "grid w-full grid-cols-2 gap-1",
      )}
    >
      <PdpColorSelector
        colors={PDP_COLORS}
        selectedId={selectedColorId}
        onSelect={onColorSelect}
        inline
        flush={docked}
        compactPill={!docked}
        onOpenChange={setColorSheetOpen}
      />

      <button
        type="button"
        onClick={onAddToBag}
        className={cn(
          "font-extended relative isolate flex min-w-0 items-center justify-center gap-2 overflow-hidden border border-neutral-200 bg-white text-center leading-none text-neutral-900 transition-[border-radius,background-color,color,box-shadow,transform] duration-300 active:bg-neutral-100",
          pdpPressableSolidClass,
          docked
            ? "h-[54px] w-full rounded-none border-0 px-4 shadow-none"
            : "h-12 w-full rounded-full border-neutral-200 px-3 shadow-[0_4px_20px_rgba(0,0,0,0.12)]",
        )}
      >
        <span
          className="relative z-[1] flex min-w-0 items-center justify-center gap-2"
        >
          <MaterialIcon
            name="shopping_bag"
            size={18}
            className="shrink-0 -translate-y-px"
            aria-hidden
          />
          <span className="translate-y-px text-[12px]">Add to bag</span>
        </span>
      </button>
    </div>
  );

  return createPortal(
    <>
      <div
        aria-hidden
        className={cn(
          "pdp-bottom-frost-gradient pointer-events-none fixed inset-x-0 bottom-0 z-[39] transition-[transform,opacity] duration-300 ease-out",
          suppressed ? "translate-y-full opacity-0" : "translate-y-0",
          docked
            ? "pdp-bottom-frost-gradient--docked h-[calc(6.5rem+var(--pdp-fixed-bottom-offset))]"
            : "pdp-bottom-frost-gradient--prominent h-[calc(15rem+var(--pdp-fixed-bottom-offset))]",
        )}
        style={{ opacity: suppressed || colorSheetOpen ? 0 : frostOpacity }}
      />

      <footer
        className={cn(
          "pointer-events-none fixed inset-x-0 z-40 transition-[transform,padding] duration-300 ease-out",
          suppressed || colorSheetOpen ? "translate-y-full" : "translate-y-0",
        )}
        style={{
          bottom: BOTTOM_CHROME_OFFSET,
          paddingBottom: docked ? 0 : "0.625rem",
        }}
      >
        <div
          className={cn(
            "relative z-[1] transition-[padding] duration-300 ease-out",
            docked ? "pt-0" : "pt-2.5",
          )}
        >
          {docked ? (
            <div className="pointer-events-auto w-full">{bar}</div>
          ) : (
            <PageGrid fullWidth className="pointer-events-auto">
              <GridItem mobile={12} desktop={24}>{bar}</GridItem>
            </PageGrid>
          )}
        </div>
      </footer>
    </>,
    document.body,
  );
}

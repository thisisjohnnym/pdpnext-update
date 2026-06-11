"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpColorSelector } from "./pdp-color-selector";
import { PDP_COLORS } from "./pdp-data";
import { useScrollNavVisibility } from "./use-scroll-nav-visibility";

const HERO_TOP_SCROLL = 32;

const BOTTOM_BAR_PAD =
  "calc(env(safe-area-inset-bottom, 0px) + var(--pdp-browser-bottom-inset, 0px))";

function useIsScrollAtTop(threshold = HERO_TOP_SCROLL) {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setAtTop(window.scrollY <= threshold);
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return atTop;
}

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
  onAddToBag: () => void;
};

/** Fixed bottom chrome — portaled to body so nothing in the page tree can clip it */
export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
  onAddToBag,
}: PdpBottomActionsProps) {
  const [mounted, setMounted] = useState(false);
  const isHeroTop = useIsScrollAtTop();
  const navVisible = useScrollNavVisibility();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <footer
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-[100] transition-transform duration-300 ease-out",
        navVisible ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: BOTTOM_BAR_PAD }}
    >
      <div className="relative bg-transparent pt-2.5">
        <PageGrid fullWidth className="pointer-events-auto">
          <GridItem mobile={12} desktop={24}>
            <div className="flex gap-1.5">
              <PdpColorSelector
                colors={PDP_COLORS}
                selectedId={selectedColorId}
                onSelect={onColorSelect}
                inline
              />

              <button
                type="button"
                onClick={onAddToBag}
                className={cn(
                  "flex h-[54px] min-w-0 flex-1 items-center justify-center rounded-full border px-4 text-sm tracking-[0.2px] text-neutral-900 transition-colors duration-300",
                  isHeroTop
                    ? "border-white bg-white"
                    : "border-white/50 bg-white/75 backdrop-blur-md",
                )}
              >
                <span className="font-extended -translate-y-px">Add to Bag</span>
              </button>
            </div>
          </GridItem>
        </PageGrid>
      </div>
    </footer>,
    document.body,
  );
}

"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";

import { PdpColorSelector } from "./pdp-color-selector";
import { PDP_COLORS } from "./pdp-data";

type PdpBottomActionsProps = {
  selectedColorId: string;
  onColorSelect: (id: string) => void;
};

export function PdpBottomActions({
  selectedColorId,
  onColorSelect,
}: PdpBottomActionsProps) {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30 pb-[max(30px,env(safe-area-inset-bottom))] pt-2.5">
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
              className="font-extended flex h-[54px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-white/50 bg-white/75 px-4 text-sm tracking-[0.2px] text-neutral-900 backdrop-blur-md"
            >
              <span className="translate-y-[1.5px]">Add to Bag</span>
              <MaterialIcon name="add" size={20} className="text-neutral-900" />
            </button>
          </div>
        </GridItem>
      </PageGrid>
    </footer>
  );
}

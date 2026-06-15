"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PdpComparePickerSheet } from "./pdp-compare-picker-sheet";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import {
  pdpModuleSectionClass,
  pdpModuleHeadingClass,
  pdpModuleHeadingLeadClass,
} from "./pdp-module-section";
import {
  PDP_COMPARE_SELECTED,
  PDP_FAMILY_COMPARE_ALTERNATIVES,
  type PdpCompareDifferenceRow,
  type PdpCompareItem,
  type PdpFamilyCompareAlternative,
} from "./pdp-data";
import { pdpType } from "./pdp-type";

function CompareProductCard({
  item,
  showChangeAffordance = false,
}: {
  item: PdpCompareItem | PdpFamilyCompareAlternative;
  showChangeAffordance?: boolean;
}) {
  return (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="45vw"
        />
        {showChangeAffordance ? (
          <span
            className="absolute left-2.5 top-2.5 z-10 flex size-8 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-black shadow-sm"
            aria-hidden
          >
            <MaterialIcon name="swap_horiz" size={18} />
          </span>
        ) : null}
      </div>
      <div className="px-0.5 pt-1.5">
        <p className={`font-extended line-clamp-2 text-black ${pdpType.label}`}>
          {item.name}
        </p>
        <p className={`font-extended text-black ${pdpType.micro}`}>{item.price}</p>
      </div>
    </>
  );
}

function getKeyDifferences(rows: PdpCompareDifferenceRow[]) {
  const wins = rows.filter((row) => row.advantage === "selected");
  const price = rows.find((row) => row.variant === "price");
  const picked = wins.slice(0, 3);

  if (price && !picked.includes(price)) {
    picked.push(price);
  }

  return picked.slice(0, 4);
}

function DifferenceRow({ row }: { row: PdpCompareDifferenceRow }) {
  const isSelectedWin = row.advantage === "selected";

  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <span className={`text-neutral-500 ${pdpType.micro}`}>{row.label}</span>
      <span
        className={cn(
          "font-extended text-right tracking-[0.2px]",
          pdpType.micro,
          isSelectedWin ? "text-black" : "text-neutral-600",
        )}
      >
        {row.display}
      </span>
    </div>
  );
}

type PdpCompareModuleProps = {
  onAddToBag?: () => void;
  onPickerOpenChange?: (open: boolean) => void;
};

/** Tabby family — side-by-side compare + picker tray for swapping the right bag */
export function PdpCompareModule({
  onAddToBag,
  onPickerOpenChange,
}: PdpCompareModuleProps) {
  const [alternativeIndex, setAlternativeIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [insightDismissed, setInsightDismissed] = useState(false);

  const handlePickerOpenChange = (open: boolean) => {
    setPickerOpen(open);
    onPickerOpenChange?.(open);
  };

  const handleAlternativeSelect = (index: number) => {
    setAlternativeIndex(index);
    setInsightDismissed(false);
  };

  const selected = PDP_COMPARE_SELECTED;
  const selectedShortName = selected.shortName ?? selected.name;
  const alternative =
    PDP_FAMILY_COMPARE_ALTERNATIVES[alternativeIndex] ??
    PDP_FAMILY_COMPARE_ALTERNATIVES[0];
  const keyDifferences = getKeyDifferences(alternative.differences);

  const handleAdd = (id: string) => {
    setAddedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      onAddToBag?.();
      return new Set(current).add(id);
    });
  };

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", first: true })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <h2
            className={cn(
              pdpModuleHeadingClass({ lead: false }),
              pdpModuleHeadingLeadClass(),
            )}
          >
            Compare the family
          </h2>

          <div className="flex flex-col gap-4">
            <div
              className="grid grid-cols-2 gap-2"
              aria-label="Compare Tabby family bags"
            >
              <article className="min-w-0">
                <CompareProductCard item={selected} />
              </article>

              <button
                type="button"
                onClick={() => handlePickerOpenChange(true)}
                className="group min-w-0 text-left transition-colors active:opacity-80"
                aria-label={`Compare with ${alternative.shortName}. Tap to choose a different bag.`}
              >
                <CompareProductCard item={alternative} showChangeAffordance />
              </button>
            </div>

            <div className="flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
              {keyDifferences.map((row) => (
                <DifferenceRow key={row.id} row={row} />
              ))}
            </div>

            {!insightDismissed ? (
              <PdpAiInsightCard
                variant="minimal"
                contained
                size="xs"
                title={alternative.aiInsight.title}
                body={alternative.aiInsight.body}
                onDismiss={() => setInsightDismissed(true)}
                ariaLive="polite"
              />
            ) : null}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAdd(selected.id)}
                disabled={addedIds.has(selected.id)}
                className={cn(
                  "inline-flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-3 transition-colors",
                  pdpType.micro,
                  addedIds.has(selected.id)
                    ? "bg-neutral-100 text-neutral-500"
                    : "bg-black text-white",
                )}
              >
                <span className="font-extended truncate">
                  {addedIds.has(selected.id)
                    ? "Added"
                    : `Add ${selectedShortName}`}
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleAdd(alternative.id)}
                disabled={addedIds.has(alternative.id)}
                className={cn(
                  "inline-flex min-w-0 flex-1 items-center justify-center rounded-full px-3 py-3 transition-colors",
                  pdpType.micro,
                  addedIds.has(alternative.id)
                    ? "bg-neutral-100 text-neutral-500"
                    : "bg-neutral-100 text-black hover:bg-neutral-200/80",
                )}
              >
                <span className="font-extended truncate">
                  {addedIds.has(alternative.id)
                    ? "Added"
                    : `Add ${alternative.shortName}`}
                </span>
              </button>
            </div>
          </div>
        </GridItem>
      </PageGrid>

      <PdpComparePickerSheet
        open={pickerOpen}
        alternatives={PDP_FAMILY_COMPARE_ALTERNATIVES}
        selectedIndex={alternativeIndex}
        onClose={() => handlePickerOpenChange(false)}
        onSelect={handleAlternativeSelect}
      />
    </section>
  );
}

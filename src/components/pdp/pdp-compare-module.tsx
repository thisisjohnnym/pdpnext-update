"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import {
  pdpCarouselScrollClass,
  pdpCompareCarouselCardClass,
} from "./pdp-carousel";
import {
  PDP_COLORS,
  PDP_COMPARE_CATEGORIES,
  PDP_COMPARE_OPTIONS,
  PDP_COMPARE_SELECTED,
  type PdpCompareItem,
} from "./pdp-data";
import { pdpType } from "./pdp-type";

const CARD_WIDTH_CLASS = pdpCompareCarouselCardClass;

type CompareItemView = PdpCompareItem & {
  selected?: boolean;
  colorLabel?: string;
};

function buildCompareItems(colorLabel: string): CompareItemView[] {
  return [
    {
      ...PDP_COMPARE_SELECTED,
      selected: true,
      colorLabel,
    },
    ...PDP_COMPARE_OPTIONS,
  ];
}

type CompareColumnProps = {
  item: CompareItemView;
  /** Pinned column — stays fixed while alternatives scroll underneath */
  pinned?: boolean;
  added?: boolean;
  onAddToBag?: () => void;
};

function CompareColumn({
  item,
  pinned = false,
  added = false,
  onAddToBag,
}: CompareColumnProps) {
  return (
    <article
      className={cn(
        "flex shrink-0 snap-start flex-col snap-always",
        CARD_WIDTH_CLASS,
        pinned &&
          "sticky left-0 z-10 bg-white shadow-[6px_0_16px_-8px_rgba(0,0,0,0.18)]",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-neutral-100",
          item.selected && "ring-1 ring-inset ring-black",
        )}
        style={{ aspectRatio: "4 / 5" }}
      >
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 1023px) 66vw, 33vw"
        />
      </div>

      <p className={`font-extended mt-1.5 line-clamp-1 text-black ${pdpType.label}`}>
        {item.name}
      </p>
      <p className={`font-extended text-black ${pdpType.micro}`}>
        {item.price}
      </p>
      <p
        className={cn(
          "text-neutral-500",
          pdpType.micro,
          !item.colorLabel && "invisible",
        )}
      >
        {item.colorLabel ?? "—"}
      </p>

      <div className="mt-2 flex flex-col border-t border-neutral-200">
        {PDP_COMPARE_CATEGORIES.map((category, index) => (
          <div
            key={category.id}
            className={cn(
              "border-neutral-200 py-1.5",
              index > 0 && "border-t",
            )}
          >
            <p className={`mb-0.5 text-neutral-500 ${pdpType.micro}`}>
              {category.label}
            </p>
            {category.id === "material" ? (
              <div className="relative h-8 w-full overflow-hidden rounded-sm bg-neutral-100">
                <Image
                  src={item.materialSwatch.src}
                  alt={item.materialSwatch.alt}
                  fill
                  className="object-cover scale-[3.25]"
                  style={{
                    objectPosition: item.materialSwatch.objectPosition ?? "center",
                  }}
                  sizes="(max-width: 1023px) 66vw, 33vw"
                />
                <span className="sr-only">{item.material}</span>
              </div>
            ) : (
              <p className={`font-extended line-clamp-2 text-black ${pdpType.label}`}>
                {item[category.id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {onAddToBag ? (
        <button
          type="button"
          onClick={onAddToBag}
          disabled={added}
          className={cn(
            "mt-2 inline-flex w-full items-center justify-center gap-1 rounded-full py-2.5 transition-colors",
            pdpType.micro,
            added
              ? "bg-neutral-100 text-neutral-500"
              : "bg-black text-white",
          )}
        >
          <span className="font-extended -translate-y-px">
            {added ? "Added" : "Add to Bag"}
          </span>
          {!added ? (
            <MaterialIcon name="add" size={16} className="text-white" />
          ) : null}
        </button>
      ) : null}
    </article>
  );
}

type PdpCompareModuleProps = {
  selectedColorId: string;
  onAddToBag?: () => void;
};

/** Horizontal compare carousel — current item + alternatives with four spec categories */
export function PdpCompareModule({
  selectedColorId,
  onAddToBag,
}: PdpCompareModuleProps) {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const selectedColor =
    PDP_COLORS.find((color) => color.id === selectedColorId) ?? PDP_COLORS[0];
  const [selectedItem, ...alternativeItems] = buildCompareItems(selectedColor.name);

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
      className={pdpModuleSectionClass({ rhythm: "compact" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0 overflow-visible">
          <h2 className={cn(pdpModuleHeadingClass({ lead: false }), "mb-3")}>
            Compare
          </h2>

          <div
            className={cn("flex gap-2", pdpCarouselScrollClass)}
            aria-label="Compare bags"
          >
            <CompareColumn
              item={selectedItem}
              pinned
              added={addedIds.has(selectedItem.id)}
              onAddToBag={() => handleAdd(selectedItem.id)}
            />
            {alternativeItems.map((item) => (
              <CompareColumn
                key={item.id}
                item={item}
                added={addedIds.has(item.id)}
                onAddToBag={() => handleAdd(item.id)}
              />
            ))}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

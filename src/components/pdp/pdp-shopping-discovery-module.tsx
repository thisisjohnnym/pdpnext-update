"use client";

import Image from "next/image";
import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  pdpCarouselCard15Class,
  pdpCarouselScrollClass,
} from "./pdp-carousel";
import {
  PDP_MORE_LIKE_THIS,
  PDP_SHOPPING_ASSISTANT_PROMPT,
} from "./pdp-data";
import { pdpModuleSectionClass, pdpModuleHeadingClass, pdpModuleHeadingLeadClass } from "./pdp-module-section";
import { PdpAiConciergePanel } from "./pdp-product-search-module";
import { PdpAiInsightCard } from "./pdp-ai-insight-card";
import { pdpType } from "./pdp-type";

type PdpShoppingDiscoveryModuleProps = {
  onAddToBag?: () => void;
};

/** More like this and shopping assistant — on-page discovery rails */
export function PdpShoppingDiscoveryModule({
  onAddToBag,
}: PdpShoppingDiscoveryModuleProps) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

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
      className={pdpModuleSectionClass({ variant: "muted" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24} className="min-w-0">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className={cn(pdpModuleHeadingClass({ lead: false }), pdpModuleHeadingLeadClass())}>
                {PDP_MORE_LIKE_THIS.eyebrow}
              </h2>
              <ul
                className={cn(
                  "m-0 flex list-none gap-2",
                  pdpCarouselScrollClass,
                )}
                aria-label="More like this"
              >
                {PDP_MORE_LIKE_THIS.items.map((item) => {
                  const added = addedIds.has(item.id);

                  return (
                    <li
                      key={item.id}
                      className={cn("flex flex-col", pdpCarouselCard15Class)}
                    >
                      <div
                        className="relative w-full overflow-hidden bg-neutral-100"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        <Image
                          src={item.imageSrc}
                          alt={item.imageAlt}
                          fill
                          className="object-cover object-center"
                          sizes="40vw"
                        />
                      </div>
                      <p
                        className={`font-extended mt-2 line-clamp-2 text-black ${pdpType.label}`}
                      >
                        {item.name}
                      </p>
                      <p className={`font-extended mt-0.5 text-black ${pdpType.micro}`}>
                        {item.price}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAdd(item.id)}
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
                          <MaterialIcon name="add" size={18} className="text-white" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {assistantOpen ? (
              <PdpAiConciergePanel
                idSuffix="-discovery"
                showTitle={false}
                variant="flat"
                onClose={() => setAssistantOpen(false)}
              />
            ) : (
              <PdpAiInsightCard
                variant="minimal"
                title={PDP_SHOPPING_ASSISTANT_PROMPT.title}
                body={PDP_SHOPPING_ASSISTANT_PROMPT.body}
                footer={
                  <button
                    type="button"
                    onClick={() => setAssistantOpen(true)}
                    className={`font-extended inline-flex items-center gap-0.5 text-black ${pdpType.micro}`}
                  >
                    {PDP_SHOPPING_ASSISTANT_PROMPT.cta}
                    <MaterialIcon
                      name="arrow_forward"
                      size={18}
                      className="text-black"
                    />
                  </button>
                }
              />
            )}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

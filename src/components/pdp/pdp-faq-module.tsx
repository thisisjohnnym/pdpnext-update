"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_FAQ, type PdpFaqItem } from "./pdp-data";
import { pdpModuleHeadingClass, pdpModuleSectionClass, pdpModuleHeadingLeadClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";

function FaqAccordionItem({
  item,
  open,
  onToggle,
}: {
  item: PdpFaqItem;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-panel-${item.id}`;

  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full min-h-11 items-center justify-between gap-3 py-3.5 text-left"
      >
        <span className="font-extended text-sm tracking-[0.2px] text-black">
          {item.question}
        </span>
        <MaterialIcon
          name={open ? "expand_less" : "expand_more"}
          size={20}
          className="shrink-0 text-neutral-500"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-hidden={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <p className={`pb-3.5 text-neutral-700 ${pdpType.caption}`}>{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

/** FAQs — expandable answers at the bottom of the PDP */
export function PdpFaqModule() {
  const { title, items } = PDP_FAQ;
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <h2 className={cn(pdpModuleHeadingClass({ lead: false }), pdpModuleHeadingLeadClass())}>
            {title}
          </h2>

          <div className="border border-neutral-200 bg-white px-4">
            {items.map((item) => (
              <FaqAccordionItem
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() =>
                  setOpenId((current) => (current === item.id ? null : item.id))
                }
              />
            ))}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

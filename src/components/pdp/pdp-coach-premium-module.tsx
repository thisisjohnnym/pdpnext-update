"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_COACH_PREMIUM, type PdpCoachPremiumPerk } from "./pdp-data";
import { PdpModuleHeading } from "./pdp-module-heading";
import { PdpRevealItem } from "./pdp-reveal-item";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { PdpToast } from "./pdp-toast";
import { pdpType, pdpPressableSolidClass } from "./pdp-type";

function CoachPremiumPerkRow({ perk }: { perk: PdpCoachPremiumPerk }) {
  return (
    <li className="flex items-start gap-3 border-t border-neutral-200 py-3.5 first:border-t-0">
      <MaterialIcon
        name={perk.icon}
        size={20}
        filled={perk.showVerifiedBadge}
        className={cn(
          "mt-0.5 shrink-0",
          perk.showVerifiedBadge ? "text-[#0095F6]" : "text-black",
        )}
        aria-hidden
      />
      <p className={`m-0 text-black ${pdpType.body}`}>
        {perk.showVerifiedBadge ? (
          <>
            Blue checkmark{" "}
            <MaterialIcon
              name="verified"
              size={18}
              filled
              className="inline-block align-middle text-[#0095F6]"
              style={{ fontSize: 11 }}
              aria-hidden
            />{" "}
            on your comments
          </>
        ) : (
          perk.label
        )}
      </p>
    </li>
  );
}

/** Coach Premium membership pitch — last block on the PDP */
export function PdpCoachPremiumModule({ embedded = false }: { embedded?: boolean }) {
  const { title, body, perks, cta, toast } = PDP_COACH_PREMIUM;
  const [toastOpen, setToastOpen] = useState(false);

  const IntroBlock = embedded ? "div" : PdpRevealItem;
  const PerksBlock = embedded ? "div" : PdpRevealItem;
  const CtaBlock = embedded ? "div" : PdpRevealItem;

  const content = (
    <div className={cn("flex flex-col", embedded ? "gap-4" : "gap-6")}>
      <IntroBlock className="flex flex-col gap-3">
        <PdpModuleHeading spacing="none">{title}</PdpModuleHeading>
        <p className={`m-0 text-neutral-700 ${pdpType.caption}`}>{body}</p>
      </IntroBlock>

      <PerksBlock {...(embedded ? {} : { delay: 80 })}>
        <ul className="m-0 list-none border border-neutral-200 bg-white px-4">
          {perks.map((perk) => (
            <CoachPremiumPerkRow key={perk.id} perk={perk} />
          ))}
        </ul>
      </PerksBlock>

      <CtaBlock {...(embedded ? {} : { delay: 140 })}>
        <button
          type="button"
          onClick={() => setToastOpen(true)}
          className={cn(
            "font-extended flex h-12 w-full items-center justify-center rounded-full bg-black text-sm tracking-[0.2px] text-white transition-colors active:bg-neutral-800",
            pdpPressableSolidClass,
          )}
        >
          {cta}
        </button>
      </CtaBlock>
    </div>
  );

  return (
    <section
      data-header-surface="light"
      className={
        embedded
          ? "relative w-full shrink-0 border-t border-neutral-200 pt-6 pb-8"
          : pdpModuleSectionClass({ rhythm: "default" })
      }
    >
      {embedded ? (
        content
      ) : (
        <PageGrid fullWidth>
          <GridItem mobile={12} desktop={24}>{content}</GridItem>
        </PageGrid>
      )}

      <PdpToast
        message={toast}
        open={toastOpen}
        onClose={() => setToastOpen(false)}
      />
    </section>
  );
}

"use client";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_SITE_FOOTER, type PdpSiteFooterGroup } from "./pdp-data";
import { pdpModuleSectionClass } from "./pdp-module-section";
import { pdpPressableClass, pdpType } from "./pdp-type";

const COACH_C_MASK = "url(/images/coach-c-mark.png)";

function CoachCMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0 bg-current", className)}
      style={{
        width: 20,
        height: 20,
        WebkitMaskImage: COACH_C_MASK,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: COACH_C_MASK,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
}

function FooterLinkGroup({ group }: { group: PdpSiteFooterGroup }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <p className={`m-0 text-black ${pdpType.label}`}>{group.title}</p>
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {group.links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className={cn(
                "font-extended text-neutral-600 transition-colors active:text-black",
                pdpType.micro,
                pdpPressableClass,
              )}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Standard Coach Outlet site footer — last block on the PDP scroll */
export function PdpSiteFooter({ embedded = false }: { embedded?: boolean }) {
  const { brand, groups, legal, copyright } = PDP_SITE_FOOTER;

  return (
    <footer
      data-header-surface="light"
      className={
        embedded
          ? "relative w-full shrink-0 border-t border-neutral-200 bg-neutral-100 pt-8 pb-8"
          : cn(pdpModuleSectionClass({ variant: "muted", rhythm: "break" }), "pt-12")
      }
    >
      {embedded ? (
        <FooterContent brand={brand} groups={groups} legal={legal} copyright={copyright} />
      ) : (
        <PageGrid fullWidth>
          <GridItem mobile={12} desktop={24}>
            <FooterContent brand={brand} groups={groups} legal={legal} copyright={copyright} />
          </GridItem>
        </PageGrid>
      )}
    </footer>
  );
}

function FooterContent({
  brand,
  groups,
  legal,
  copyright,
}: {
  brand: string;
  groups: PdpSiteFooterGroup[];
  legal: (typeof PDP_SITE_FOOTER)["legal"];
  copyright: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-2 text-black">
        <CoachCMark />
        <span className="font-extended text-sm tracking-[0.2px]">{brand}</span>
      </div>

      <div className="flex gap-8">
        {groups.map((group) => (
          <FooterLinkGroup key={group.id} group={group} />
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-neutral-200 pt-6">
        <nav aria-label="Legal" className="flex flex-wrap gap-x-4 gap-y-2">
          {legal.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "font-extended text-neutral-600 transition-colors active:text-black",
                pdpType.micro,
                pdpPressableClass,
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className={`m-0 text-neutral-500 ${pdpType.micro}`}>{copyright}</p>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { type CSSProperties, useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_NAV, type PdpNavCategory, type PdpNavHighlight } from "./pdp-nav-data";
import { pdpPressableClass, pdpPressableIconClass, pdpType } from "../chrome/pdp-type";
import { useBodyPortalTarget } from "../hooks/use-body-portal-target";

type PdpNavMenuProps = {
  open: boolean;
  onClose: () => void;
};

function NavHighlightCard({ highlight }: { highlight: PdpNavHighlight }) {
  return (
    <button
      type="button"
      className={cn("group flex w-full flex-col gap-2 text-left", pdpPressableClass)}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-neutral-100",
          highlight.layout === "full" ? "aspect-[4/3]" : "aspect-[3/4]",
        )}
      >
        <Image
          src={highlight.imageSrc}
          alt={highlight.imageAlt}
          fill
          className="object-cover object-center transition-transform duration-500 group-active:scale-[1.02]"
          sizes={highlight.layout === "full" ? "100vw" : "50vw"}
        />
      </div>
      <span className="font-extended text-center text-xs tracking-[0.2px] text-black">
        {highlight.label}
      </span>
    </button>
  );
}

function NavAccordionItem({
  category,
  open,
  onToggle,
}: {
  category: PdpNavCategory;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `nav-panel-${category.id}`;

  return (
    <div className="border-b border-neutral-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "flex w-full min-h-11 items-center justify-between gap-3 py-3.5 text-left",
          pdpPressableClass,
        )}
      >
        <span className="font-extended text-sm tracking-[0.2px] text-black">
          {category.label}
        </span>
        <MaterialIcon
          name={open ? "remove" : "add"}
          size={20}
          className="shrink-0 text-black"
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
          <ul className="m-0 list-none pb-3 pl-1">
            {category.children.map((child) => (
              <li key={child}>
                <button
                  type="button"
                  className={cn(
                    "font-extended block w-full py-2 text-left text-neutral-700",
                    pdpType.caption,
                    pdpPressableClass,
                  )}
                >
                  {child}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Full-screen Coach navigation — FY26 tabbed menu with search, highlights, and accordions */
export function PdpNavMenu({ open, onClose }: PdpNavMenuProps) {
  const titleId = useId();
  const portalTarget = useBodyPortalTarget();
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  const fullHighlights = PDP_NAV.highlights.filter((item) => item.layout === "full");
  const halfHighlights = PDP_NAV.highlights.filter((item) => item.layout === "half");
  // Stagger indices: 0=search, 1..N=full highlights, N+1..M=half highlights, M+1=categories
  const categoriesStaggerIndex = Math.min(fullHighlights.length, 3) + Math.min(halfHighlights.length, 3) + 1;

  const getStaggerStyle = (index: number): CSSProperties => ({
    transitionDelay: open
      ? `calc(var(--pdp-duration) * 0.22 + var(--pdp-overlay-stagger-step) * ${index})`
      : "0ms",
  });

  const handleClose = useCallback(() => {
    setExpandedCategoryId(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, open]);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        "pdp-chrome fixed inset-0 z-50 overflow-hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-state={open ? "open" : "closed"}
        className={cn(
          "pdp-overlay-panel pdp-nav-panel font-extended flex h-full w-full flex-col overflow-hidden bg-white",
          open ? "translate-y-0" : "-translate-y-full",
        )}
      >
        {/* Top bar — mirrors PdpHeroNav: close | C mark | (empty) */}
        <div
          className="shrink-0 px-2 pb-2 pt-[calc(var(--pdp-safe-area-top)+20px)]"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center" style={{ height: 24 }}>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close menu"
              className={cn("flex items-center justify-self-start", pdpPressableIconClass)}
              style={{ width: 24, height: 24 }}
            >
              <MaterialIcon name="close" size={24} className="text-black" />
            </button>

            <span id={titleId} aria-hidden className="flex items-center justify-center">
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"
              >
                <path
                  fillRule="evenodd" clipRule="evenodd"
                  d="M20.5289 5.70484C20.3306 5.6057 19.7355 5.20917 18.7438 4.81263C17.6529 4.41609 15.9174 3.87085 13.686 3.87085C10.1157 3.87085 6.79339 4.56479 4.36364 5.80397C1.4876 7.24142 0 9.42238 0 11.9999C0 17.3531 5.00827 20.1289 14.5289 20.1289C16.8595 20.1289 18.8926 19.5341 20.5785 18.3445L23.4545 19.8811H24V13.7347H23.4545L23.405 13.7843V13.8339C23.405 13.8834 22.9091 15.2713 21.6198 16.6592C20.4298 17.948 18.2479 19.4845 14.6777 19.4845C12.2975 19.4845 10.3636 18.5923 9.07438 16.9566C8.08264 15.6679 7.4876 13.8834 7.4876 12.099C7.4876 7.29099 11.2066 4.71349 14.6777 4.71349C17.0579 4.71349 19.1901 5.457 20.876 6.89445C22.3141 8.08407 23.1074 9.47195 23.405 10.4137V10.4633H24V4.16825H23.4545L20.5289 5.70484Z"
                  fill="black"
                />
              </svg>
            </span>

            {/* Right slot — empty to balance the grid */}
            <div style={{ width: 24, height: 24 }} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(24px,var(--pdp-safe-area-bottom))]">
          <PageGrid fullWidth className="py-4">
            <GridItem mobile={12} desktop={24}>
              <label
                className="pdp-overlay-stagger-item relative mb-5 block"
                style={getStaggerStyle(0)}
              >
                <span className="sr-only">Search</span>
                <MaterialIcon
                  name="search"
                  size={20}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                />
                <input
                  type="search"
                  placeholder={PDP_NAV.searchPlaceholder}
                  className="font-extended h-11 w-full rounded-full border border-neutral-300 bg-white pl-10 pr-4 text-sm tracking-[0.2px] text-black outline-none placeholder:text-neutral-500 focus:border-black"
                />
              </label>

              <div className="flex flex-col gap-5">
                {fullHighlights.map((highlight, index) => (
                  <div
                    key={highlight.id}
                    className="pdp-overlay-stagger-item"
                    style={getStaggerStyle(Math.min(index, 3) + 1)}
                  >
                    <NavHighlightCard highlight={highlight} />
                  </div>
                ))}

                {halfHighlights.length > 0 ? (
                  <div className="grid grid-cols-2 gap-1">
                    {halfHighlights.map((highlight, index) => (
                      <div
                        key={highlight.id}
                        className="pdp-overlay-stagger-item"
                        style={getStaggerStyle(Math.min(index, 3) + Math.min(fullHighlights.length, 3) + 1)}
                      >
                        <NavHighlightCard highlight={highlight} />
                      </div>
                    ))}
                  </div>
                ) : null}

                <div
                  className="pdp-overlay-stagger-item border-t border-neutral-200 pt-1"
                  style={getStaggerStyle(categoriesStaggerIndex)}
                >
                  {PDP_NAV.categories.map((category) => (
                    <NavAccordionItem
                      key={category.id}
                      category={category}
                      open={expandedCategoryId === category.id}
                      onToggle={() =>
                        setExpandedCategoryId((current) =>
                          current === category.id ? null : category.id,
                        )
                      }
                    />
                  ))}
                </div>
              </div>
            </GridItem>
          </PageGrid>
        </div>
      </div>
    </div>,
    portalTarget,
  );
}

"use client";

import Image from "next/image";
import { useEffect, useId } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpShopTheLookLook } from "./pdp-data";
import { pdpSheetHeadingClass } from "./pdp-module-section";

type PdpShopTheLookSheetProps = {
  look: PdpShopTheLookLook | null;
  open: boolean;
  onClose: () => void;
};

/** Bottom sheet — outfit pieces from an on-model gallery photo */
export function PdpShopTheLookSheet({ look, open, onClose }: PdpShopTheLookSheetProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!look) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Close shop the look"
        className="absolute inset-0 bg-black/45 transition-opacity"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "font-extended relative flex max-h-[85dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="shrink-0 px-2.5 pb-0 pt-2.5">
          <div className="mx-auto mb-6 h-[3px] w-[50px] rounded-full bg-black/70" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,var(--pdp-safe-area-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-4")}>
            {look.title}
          </h2>

          <ul className="flex flex-col">
            {look.items.map((item) => (
              <li key={item.id} className="border-t border-neutral-200 first:border-t-0">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-4"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden bg-neutral-100">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-extended truncate text-xs tracking-[0.2px] text-black">
                      {item.name}
                    </p>
                    <p className="font-extended mt-1 text-xs tracking-[0.2px] text-neutral-600">
                      {item.price}
                    </p>
                  </div>

                  <MaterialIcon
                    name="arrow_outward"
                    size={20}
                    className="shrink-0 text-black"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import type { PdpStrapOptionsSet } from "./pdp-data";
import { pdpSheetHeadingClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";

type PdpStrapOptionsSheetProps = {
  set: PdpStrapOptionsSet | null;
  open: boolean;
  onClose: () => void;
  onAddToBag: () => void;
};

/** Bottom sheet — purchasable strap options with quick add */
export function PdpStrapOptionsSheet({
  set,
  open,
  onClose,
  onAddToBag,
}: PdpStrapOptionsSheetProps) {
  const titleId = useId();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!open) {
      setAddedIds(new Set());
    }
  }, [open]);

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

  if (!set) {
    return null;
  }

  const handleAdd = (id: string) => {
    setAddedIds((current) => {
      if (current.has(id)) {
        return current;
      }

      onAddToBag();
      return new Set(current).add(id);
    });
  };

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
        aria-label="Close strap options"
        className="absolute inset-0 bg-black/45 transition-opacity"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative flex max-h-[85dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out",
          open ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="shrink-0 px-2.5 pb-0 pt-2.5">
          <div className="mx-auto mb-6 h-[3px] w-[50px] rounded-full bg-black/70" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full text-neutral-900"
          >
            <MaterialIcon name="close" size={24} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-[max(24px,env(safe-area-inset-bottom))]">
          <h2 id={titleId} className={cn(pdpSheetHeadingClass(), "mb-1")}>
            {set.title}
          </h2>
          <p className={`mb-4 text-neutral-600 ${pdpType.caption}`}>
            Mix straps for shoulder, crossbody, or extended carry.
          </p>

          <ul className="flex flex-col gap-3">
            {set.options.map((option) => {
              const added = addedIds.has(option.id);

              return (
                <li
                  key={option.id}
                  className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                    <Image
                      src={option.imageSrc}
                      alt={option.imageAlt}
                      fill
                      className="object-cover object-center"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`font-extended text-black ${pdpType.body}`}>
                      {option.name}
                    </p>
                    <p className={`mt-0.5 text-neutral-600 ${pdpType.label}`}>
                      {option.subtitle}
                    </p>
                    <p className={`mt-1 font-extended text-black ${pdpType.label}`}>
                      {option.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdd(option.id)}
                    disabled={added}
                    className={cn(
                      "font-extended inline-flex shrink-0 items-center justify-center gap-0.5 rounded-full px-3.5 py-2.5 tracking-[0.2px] transition-colors",
                      pdpType.label,
                      added
                        ? "bg-neutral-200 text-neutral-500"
                        : "bg-black text-white",
                    )}
                  >
                    <span className="-translate-y-px">{added ? "Added" : "Add"}</span>
                    {!added ? (
                      <MaterialIcon name="add" size={18} className="text-white" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

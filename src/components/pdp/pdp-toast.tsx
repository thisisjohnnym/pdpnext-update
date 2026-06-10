"use client";

import { useEffect } from "react";

import { cn } from "@/lib/cn";

import { BOTTOM_CTA_OFFSET } from "./pdp-gallery-view";

type PdpToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
  durationMs?: number;
};

export function PdpToast({
  message,
  open,
  onClose,
  durationMs = 2400,
}: PdpToastProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timeoutId = window.setTimeout(onClose, durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [durationMs, onClose, open]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4 transition-opacity duration-300",
        open ? "opacity-100" : "opacity-0",
      )}
      style={{ bottom: `calc(${BOTTOM_CTA_OFFSET} + 0.75rem)` }}
    >
      <p className="font-extended rounded-full bg-black/80 px-4 py-2.5 text-xs tracking-[0.2px] text-white backdrop-blur-md">
        {message}
      </p>
    </div>
  );
}

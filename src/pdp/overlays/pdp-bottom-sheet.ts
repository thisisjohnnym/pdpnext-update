import { cn } from "@/lib/cn";

type PdpBottomSheetOpen = {
  open: boolean;
};

/** Full-viewport overlay — tray panels anchor to the bottom edge */
export function pdpBottomSheetOverlayClass({ open }: PdpBottomSheetOpen) {
  return cn(
    "pdp-chrome fixed inset-0 z-50 flex items-end",
    open ? "pointer-events-auto" : "pointer-events-none",
  );
}

export function pdpBottomSheetBackdropClass({ open }: PdpBottomSheetOpen) {
  return cn(
    "pdp-overlay-backdrop absolute inset-0 bg-black/45 transition-opacity",
    open ? "opacity-100" : "opacity-0",
  );
}

type PdpBottomSheetPanelOptions = PdpBottomSheetOpen & {
  maxHeight?: "85dvh" | "88dvh" | "92dvh";
};

/** Edge-to-edge on mobile; capped and centered from lg */
export function pdpBottomSheetPanelClass({
  open,
  maxHeight = "85dvh",
}: PdpBottomSheetPanelOptions) {
  return cn(
    "pdp-overlay-panel font-extended relative flex w-full max-w-none flex-col overflow-hidden rounded-t-[20px] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.18)] transition-transform lg:mx-auto lg:max-w-[var(--pdp-max-width)]",
    maxHeight === "85dvh" && "max-h-[85dvh]",
    maxHeight === "88dvh" && "max-h-[88dvh]",
    maxHeight === "92dvh" && "max-h-[92dvh]",
    open ? "translate-y-0" : "translate-y-full",
  );
}

/** Shared tray chrome — grab handle + close button placement */
export const pdpBottomSheetHeaderClass = "relative shrink-0 px-2.5 pb-0 pt-2.5";

export const pdpBottomSheetGrabHandleClass =
  "mx-auto mb-6 h-[3px] w-[50px] rounded-full bg-black/70";

export const pdpBottomSheetCloseButtonClass =
  "absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full text-neutral-900";

export const PDP_BOTTOM_SHEET_CLOSE_ICON_SIZE = 24;

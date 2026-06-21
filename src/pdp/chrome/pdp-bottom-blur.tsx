"use client";

import { createPortal } from "react-dom";

import { useBodyPortalTarget } from "../hooks/use-body-portal-target";

type PdpBottomBlurProps = {
  suppressed?: boolean;
};

/** Stacked progressive blur behind floating CTA stack */
export function PdpBottomBlur({ suppressed = false }: PdpBottomBlurProps) {
  const portalTarget = useBodyPortalTarget();

  if (!portalTarget || suppressed) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden
      className="pdp-bottom-blur-stack pdp-bottom-chrome pdp-chrome pointer-events-none fixed inset-x-0 z-[38] bg-transparent"
      style={{
        paddingInline: "var(--pdp-cta-inset)",
        // Safari/iOS can report 0 for JS inset while chrome is visible; use CSS
        // viewport delta as a fallback so blur stays at physical screen bottom.
        bottom:
          "calc(max(var(--pdp-browser-bottom-inset, 0px), calc(100lvh - 100svh)) * -1)",
        height:
          "calc(env(safe-area-inset-bottom, 0px) + max(var(--pdp-browser-bottom-inset, 0px), calc(100lvh - 100svh)) + ((var(--pdp-cta-height) + var(--pdp-cta-inset)) * 1.2))",
      }}
    >
      <div
        className="pdp-bottom-blur pdp-page absolute inset-x-0 bottom-0 mx-auto"
        style={{ height: "100%", paddingInline: "var(--pdp-cta-inset)" }}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
        <div />
        <div className="pdp-bottom-blur__edge" />
      </div>
    </div>,
    portalTarget,
  );
}

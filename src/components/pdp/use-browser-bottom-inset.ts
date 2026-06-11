"use client";

import { useEffect, useState } from "react";

const MAX_BROWSER_CHROME = 112;

/** Obscured layout space below the visual viewport (mobile browser toolbars) */
function readBrowserBottomInset(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const viewport = window.visualViewport;
  if (!viewport) {
    return 0;
  }

  const obscured = window.innerHeight - viewport.height - viewport.offsetTop;

  // Soft keyboard — don't lift the bar with the keyboard
  if (viewport.height < window.innerHeight * 0.6) {
    return 0;
  }

  return Math.min(Math.max(0, obscured), MAX_BROWSER_CHROME);
}

/** Track Safari/Chrome bottom toolbar show/hide via Visual Viewport API */
export function useBrowserBottomInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const update = () => {
      setInset(readBrowserBottomInset());
    };

    update();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return inset;
}

function syncViewportCssVars() {
  if (typeof window === "undefined") {
    return;
  }

  const viewport = window.visualViewport;
  const height = viewport?.height ?? window.innerHeight;

  document.documentElement.style.setProperty(
    "--pdp-viewport-height",
    `${height}px`,
  );
  document.documentElement.style.setProperty(
    "--pdp-browser-bottom-inset",
    `${readBrowserBottomInset()}px`,
  );
}

/** Sync viewport height + browser chrome inset CSS vars on <html> */
export function useBrowserBottomInsetCssVar() {
  useEffect(() => {
    const update = () => {
      syncViewportCssVars();
    };

    update();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      document.documentElement.style.removeProperty("--pdp-viewport-height");
      document.documentElement.style.removeProperty("--pdp-browser-bottom-inset");
    };
  }, []);
}

"use client";

import { useEffect, useState } from "react";

const MAX_BROWSER_CHROME = 120;

/** Space obscured below the visual viewport (Safari/Chrome bottom toolbars) */
export function readBrowserBottomInset(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const viewport = window.visualViewport;
  if (!viewport) {
    return 0;
  }

  // Soft keyboard — don't lift chrome with the keyboard
  if (viewport.height < window.innerHeight * 0.55) {
    return 0;
  }

  const obscured = window.innerHeight - viewport.height - viewport.offsetTop;

  return Math.min(Math.max(0, obscured), MAX_BROWSER_CHROME);
}

export function syncViewportCssVars() {
  if (typeof window === "undefined") {
    return;
  }

  const viewport = window.visualViewport;
  const visualHeight = viewport?.height ?? window.innerHeight;
  const offsetTop = viewport?.offsetTop ?? 0;
  const bottomInset = readBrowserBottomInset();

  document.documentElement.style.setProperty(
    "--pdp-screen-height",
    `${window.innerHeight}px`,
  );
  document.documentElement.style.setProperty(
    "--pdp-viewport-height",
    `${visualHeight}px`,
  );
  document.documentElement.style.setProperty(
    "--pdp-viewport-offset-top",
    `${offsetTop}px`,
  );
  document.documentElement.style.setProperty(
    "--pdp-browser-bottom-inset",
    `${bottomInset}px`,
  );
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
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return inset;
}

/** Sync viewport CSS vars on <html> for hero height + fixed chrome */
export function useBrowserBottomInsetCssVar() {
  useEffect(() => {
    const update = () => {
      syncViewportCssVars();
    };

    update();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      document.documentElement.style.removeProperty("--pdp-screen-height");
      document.documentElement.style.removeProperty("--pdp-viewport-height");
      document.documentElement.style.removeProperty("--pdp-viewport-offset-top");
      document.documentElement.style.removeProperty("--pdp-browser-bottom-inset");
    };
  }, []);
}

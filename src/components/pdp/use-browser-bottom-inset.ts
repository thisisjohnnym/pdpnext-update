"use client";

import { useEffect, useState } from "react";

const MAX_BROWSER_CHROME = 120;

/** Space obscured below the visual viewport (Safari/Chrome bottom toolbars) */
function readBrowserBottomInset(): number {
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

/** Sync bottom browser chrome inset only — never affects top layout */
function syncBrowserBottomInset() {
  if (typeof window === "undefined") {
    return;
  }

  const bottomInset = readBrowserBottomInset();

  document.documentElement.style.setProperty(
    "--pdp-browser-bottom-inset",
    `${bottomInset}px`,
  );
}

/** Track Safari/Chrome bottom toolbar show/hide via Visual Viewport API */
function useBrowserBottomInset() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const update = () => {
      setInset(readBrowserBottomInset());
    };

    update();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return inset;
}

/** Sets --pdp-browser-bottom-inset on <html> for fixed bottom chrome */
export function useBrowserBottomInsetCssVar() {
  useEffect(() => {
    const update = () => {
      syncBrowserBottomInset();
    };

    update();

    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      viewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      document.documentElement.style.removeProperty("--pdp-browser-bottom-inset");
    };
  }, []);
}

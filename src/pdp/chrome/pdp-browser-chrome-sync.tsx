"use client";

import { useSmoothedBrowserBottomInset } from "../hooks/use-smoothed-browser-bottom-inset";

/** Sets smoothed --pdp-browser-bottom-inset on html for fixed bottom chrome */
export function PdpBrowserChromeSync() {
  useSmoothedBrowserBottomInset();
  return null;
}

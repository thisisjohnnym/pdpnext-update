"use client";

import { useBrowserBottomInsetCssVar } from "./use-browser-bottom-inset";

/** Sets viewport CSS vars on <html> for hero height + fixed chrome */
export function PdpBrowserChromeSync() {
  useBrowserBottomInsetCssVar();
  return null;
}

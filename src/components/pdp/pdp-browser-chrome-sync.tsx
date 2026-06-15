"use client";

import { useBrowserBottomInsetCssVar } from "./use-browser-bottom-inset";

/** Sets --pdp-browser-bottom-inset on <html> for fixed bottom chrome */
export function PdpBrowserChromeSync() {
  useBrowserBottomInsetCssVar();
  return null;
}

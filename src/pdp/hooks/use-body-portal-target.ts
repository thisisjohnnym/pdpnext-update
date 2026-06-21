"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

function getBodySnapshot() {
  return typeof document !== "undefined" ? document.body : null;
}

function getServerSnapshot() {
  return null;
}

/** `document.body` for portals — available on first client render */
export function useBodyPortalTarget() {
  return useSyncExternalStore(subscribe, getBodySnapshot, getServerSnapshot);
}

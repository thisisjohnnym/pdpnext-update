"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { PdpMaterialExploreZone } from "./pdp-data";

type ExplorePosition = {
  x: number;
  y: number;
  xPct: number;
  yPct: number;
};

type ContainerSize = {
  width: number;
  height: number;
};

/** Touch hold duration before zoom lens activates */
const TOUCH_HOLD_MS = 400;
/** Movement before hold completes — treat as vertical scroll, cancel zoom */
const SCROLL_CANCEL_PX = 12;

function getActiveZone(
  xPct: number,
  yPct: number,
  zones: readonly PdpMaterialExploreZone[],
): PdpMaterialExploreZone | null {
  return (
    zones.find(
      (zone) =>
        xPct >= zone.x &&
        xPct <= zone.x + zone.width &&
        yPct >= zone.y &&
        yPct <= zone.y + zone.height,
    ) ?? null
  );
}

/** Pointer-driven microscope lens — hold then drag on touch; instant drag on mouse */
export function useMaterialExplore(zones: readonly PdpMaterialExploreZone[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isExploringRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPointerIdRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [position, setPosition] = useState<ExplorePosition | null>(null);
  const [containerSize, setContainerSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const [isExploring, setIsExploring] = useState(false);
  const [pointerType, setPointerType] = useState<React.PointerEvent["pointerType"] | null>(
    null,
  );

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

    setContainerSize({ width: rect.width, height: rect.height });
    setPosition({
      x,
      y,
      xPct: (x / rect.width) * 100,
      yPct: (y / rect.height) * 100,
    });
  }, []);

  const clearTouchHold = useCallback(() => {
    if (holdTimerRef.current !== null) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    pendingPointerIdRef.current = null;
    touchStartRef.current = null;
  }, []);

  const beginExplore = useCallback(
    (
      target: HTMLDivElement,
      pointerId: number,
      type: React.PointerEvent["pointerType"],
      clientX: number,
      clientY: number,
    ) => {
      try {
        target.setPointerCapture(pointerId);
      } catch {
        /* pointer may have lifted before hold completed */
      }

      isExploringRef.current = true;
      setPointerType(type);
      setIsExploring(true);
      updatePosition(clientX, clientY);    },
    [updatePosition],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {      if (event.pointerType === "touch") {
        touchStartRef.current = { x: event.clientX, y: event.clientY };
        pendingPointerIdRef.current = event.pointerId;

        const target = event.currentTarget;
        const pointerId = event.pointerId;
        const startX = event.clientX;
        const startY = event.clientY;

        holdTimerRef.current = setTimeout(() => {
          holdTimerRef.current = null;

          if (pendingPointerIdRef.current !== pointerId) {            return;
          }          beginExplore(target, pointerId, "touch", startX, startY);
        }, TOUCH_HOLD_MS);

        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      beginExplore(
        event.currentTarget,
        event.pointerId,
        event.pointerType,
        event.clientX,
        event.clientY,
      );
    },
    [beginExplore],
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (
        event.pointerType === "touch" &&
        pendingPointerIdRef.current === event.pointerId &&
        !isExploringRef.current
      ) {
        const start = touchStartRef.current;
        if (start) {
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;

          if (Math.abs(dy) > SCROLL_CANCEL_PX && Math.abs(dy) > Math.abs(dx)) {            clearTouchHold();
          }
        }

        return;
      }

      if (!isExploringRef.current) {
        return;
      }

      if (event.pointerType === "touch") {
        event.preventDefault();
      }

      updatePosition(event.clientX, event.clientY);
    },
    [clearTouchHold, updatePosition],
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const hadCapture = event.currentTarget.hasPointerCapture(event.pointerId);
      clearTouchHold();

      if (hadCapture) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const stillExploring = isExploringRef.current;
      isExploringRef.current = false;
      setIsExploring(false);
      setPointerType(null);
      setPosition(null);    },
    [clearTouchHold],
  );

  useEffect(() => clearTouchHold, [clearTouchHold]);

  const activeZone = position
    ? getActiveZone(position.xPct, position.yPct, zones)
    : null;

  return {
    containerRef,
    position,
    containerSize,
    isExploring,
    activeZone,
    pointerType,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
    handleContextMenu,
  };
}

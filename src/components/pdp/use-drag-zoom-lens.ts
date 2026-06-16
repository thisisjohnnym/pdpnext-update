"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Point = { x: number; y: number };
type Size = { width: number; height: number };
type LensPosition = Point & { xPct: number; yPct: number };

type Phase = "idle" | "zooming";

type CloseReason = "pointerup" | "pointercancel" | "lostpointercapture" | "blur" | "unmount" | "recapture-failed";

// #region agent log
const DEBUG_ENDPOINT =
  "http://127.0.0.1:7537/ingest/35eb6e96-1045-4a5b-88fc-3b5c0a772d96";
const DEBUG_SESSION = "434f04";

function debugLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId?: string,
) {
  fetch(DEBUG_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": DEBUG_SESSION,
    },
    body: JSON.stringify({
      sessionId: DEBUG_SESSION,
      location,
      message,
      data,
      hypothesisId,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}

function describeElement(el: EventTarget | null) {
  if (!el || !(el instanceof Element)) {
    return null;
  }
  return {
    tag: el.tagName,
    className: el.className?.toString?.() ?? "",
    id: el.id || undefined,
  };
}

function readTouchAction(el: HTMLElement | null) {
  if (!el) {
    return null;
  }
  return getComputedStyle(el).touchAction;
}

function readOverflow(el: Element) {
  const style = getComputedStyle(el);
  return style.overflow;
}

function readScrollLocked() {
  const bodyOverflow = readOverflow(document.body);
  const htmlOverflow = readOverflow(document.documentElement);
  return (
    bodyOverflow === "hidden" ||
    htmlOverflow === "hidden" ||
    document.body.style.overflow === "hidden" ||
    document.documentElement.style.overflow === "hidden"
  );
}

function ancestorChain(el: HTMLElement | null, depth = 5) {
  const chain: string[] = [];
  let node: HTMLElement | null = el;
  for (let i = 0; i < depth && node; i += 1) {
    const style = getComputedStyle(node);
    chain.push(
      `${node.tagName.toLowerCase()}${node.className ? `.${String(node.className).split(/\s+/).slice(0, 2).join(".")}` : ""}{ta:${style.touchAction},oy:${style.overflowY},snap:${style.scrollSnapType}}`,
    );
    node = node.parentElement;
  }
  return chain;
}

function serializePointerEvent(event: React.PointerEvent<HTMLDivElement>) {
  return {
    pointerId: event.pointerId,
    pointerType: event.pointerType,
    clientX: event.clientX,
    clientY: event.clientY,
    button: event.button,
    buttons: event.buttons,
    cancelable: event.cancelable,
    defaultPrevented: event.defaultPrevented,
    isPrimary: event.isPrimary,
    pressure: event.pressure,
    target: describeElement(event.target),
  };
}
// #endregion

function localPoint(clientX: number, clientY: number, rect: DOMRect): Point {
  return {
    x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
    y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
  };
}

function exploreHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

function lockGestureScroll(target: HTMLDivElement) {
  target.style.touchAction = "none";
  target.classList.add("touch-none");
}

function restoreGestureScroll(target: HTMLDivElement) {
  target.classList.remove("touch-none");
  target.style.touchAction = "pan-y";
}

/** Instant magnifier lens — touch and mouse activate on pointerdown */
export function useDragZoomLens() {
  const containerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("idle");
  const pointerIdRef = useRef<number | null>(null);
  const lastMoveClientRef = useRef<Point | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [lensPosition, setLensPosition] = useState<LensPosition | null>(null);
  const [containerSize, setContainerSize] = useState<Size>({ width: 0, height: 0 });
  const [pointerType, setPointerType] = useState<React.PointerEvent["pointerType"] | null>(
    null,
  );

  const setPhaseSafe = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const updateLens = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const point = localPoint(clientX, clientY, rect);

    setContainerSize({ width: rect.width, height: rect.height });
    setLensPosition({
      x: point.x,
      y: point.y,
      xPct: rect.width > 0 ? (point.x / rect.width) * 100 : 0,
      yPct: rect.height > 0 ? (point.y / rect.height) * 100 : 0,
    });
  }, []);

  const release = useCallback(
    (target?: HTMLDivElement | null, pointerId?: number, reason: CloseReason = "pointerup") => {
      const el = target ?? containerRef.current;
      const wasZooming = phaseRef.current === "zooming";

      const pid = pointerId ?? pointerIdRef.current;
      const hadCapture = Boolean(el && pid !== null && el.hasPointerCapture(pid));

      if (el && pid !== null && hadCapture) {
        try {
          el.releasePointerCapture(pid);
        } catch {
          /* already released */
        }
      }

      if (el) {
        restoreGestureScroll(el);
      }

      if (wasZooming) {
        // #region agent log
        debugLog(
          "use-drag-zoom-lens.ts:release",
          "zoom closed",
          {
            reason,
            wasZooming,
            hadPointerCapture: hadCapture,
            pointerId: pid,
            phase: phaseRef.current,
            scrollY: window.scrollY,
            containerTouchAction: readTouchAction(containerRef.current),
          },
          reason === "lostpointercapture" ? "B" : undefined,
        );
        // #endregion
      }

      pointerIdRef.current = null;
      lastMoveClientRef.current = null;
      setPhaseSafe("idle");
      setLensPosition(null);
      setPointerType(null);
    },
    [setPhaseSafe],
  );

  const activateZoom = useCallback(
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
        release(target, pointerId, "recapture-failed");
        return;
      }

      pointerIdRef.current = pointerId;
      setPointerType(type);
      setPhaseSafe("zooming");
      updateLens(clientX, clientY);
      lastMoveClientRef.current = { x: clientX, y: clientY };

      const hasCapture = target.hasPointerCapture(pointerId);
      // #region agent log
      debugLog(
        "use-drag-zoom-lens.ts:activateZoom",
        "zoom became active",
        {
          zoomActive: true,
          scrollLocked: readScrollLocked(),
          hasPointerCapture: hasCapture,
          pointerId,
          pointerType: type,
          bodyOverflow: readOverflow(document.body),
          documentElementOverflow: readOverflow(document.documentElement),
          containerTouchAction: readTouchAction(target),
          containerInlineTouchAction: target.style.touchAction || null,
          containerClassList: target.className,
          scrollY: window.scrollY,
          ancestorChain: ancestorChain(target),
        },
        "D",
      );
      // #endregion

      if (type === "touch") {
        exploreHaptic();
      }
    },
    [release, setPhaseSafe, updateLens],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      if (phaseRef.current === "zooming") {
        release(event.currentTarget, event.pointerId, "pointerup");
        return;
      }

      const target = event.currentTarget;
      lockGestureScroll(target);

      const container = containerRef.current;
      // #region agent log
      debugLog(
        "use-drag-zoom-lens.ts:handlePointerDown",
        "pointerdown",
        {
          timestamp: Date.now(),
          pointerType: event.pointerType,
          pointerId: event.pointerId,
          target: describeElement(event.target),
          scrollY: window.scrollY,
          containerTouchAction: readTouchAction(container),
          containerInlineTouchAction: target.style.touchAction || null,
          phase: phaseRef.current,
          ancestorChain: ancestorChain(container),
        },
        "D",
      );
      // #endregion

      activateZoom(target, event.pointerId, event.pointerType, event.clientX, event.clientY);
    },
    [activateZoom, release],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId || phaseRef.current !== "zooming") {
        return;
      }

      const scrollYBefore = window.scrollY;
      const last = lastMoveClientRef.current;
      const deltaX = last ? event.clientX - last.x : 0;
      const deltaY = last ? event.clientY - last.y : 0;
      const cancelable = event.cancelable;
      let preventDefaultCalled = false;

      if (cancelable) {
        event.preventDefault();
        preventDefaultCalled = true;
      }

      const scrollYAfterSync = window.scrollY;
      const hasCapture = event.currentTarget.hasPointerCapture(event.pointerId);

      // #region agent log
      debugLog(
        "use-drag-zoom-lens.ts:handlePointerMove",
        "pointermove while zooming",
        {
          deltaX,
          deltaY,
          scrollYBefore,
          scrollYAfter: scrollYAfterSync,
          scrollDelta: scrollYAfterSync - scrollYBefore,
          hasPointerCapture: hasCapture,
          cancelable,
          preventDefaultCalled,
          pointerId: event.pointerId,
          pointerType: event.pointerType,
          containerTouchAction: readTouchAction(event.currentTarget),
          ancestorChain: scrollYAfterSync !== scrollYBefore ? ancestorChain(event.currentTarget) : undefined,
        },
        scrollYAfterSync !== scrollYBefore ? "A" : preventDefaultCalled ? "C" : "B",
      );
      // #endregion

      lastMoveClientRef.current = { x: event.clientX, y: event.clientY };
      updateLens(event.clientX, event.clientY);

      requestAnimationFrame(() => {
        if (phaseRef.current !== "zooming") {
          return;
        }
        const scrollYAfterFrame = window.scrollY;
        if (scrollYAfterFrame !== scrollYBefore) {
          // #region agent log
          debugLog(
            "use-drag-zoom-lens.ts:handlePointerMove:rAF",
            "scroll changed after zoom move",
            {
              scrollYBefore,
              scrollYAfterSync,
              scrollYAfterFrame,
              scrollDeltaFrame: scrollYAfterFrame - scrollYBefore,
              deltaX,
              deltaY,
              hasPointerCapture: event.currentTarget.hasPointerCapture(event.pointerId),
              preventDefaultCalled,
              ancestorChain: ancestorChain(event.currentTarget),
            },
            "A",
          );
          // #endregion
        }
      });
    },
    [updateLens],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "pointerup");
    },
    [release],
  );

  const handlePointerCancel = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // #region agent log
      debugLog(
        "use-drag-zoom-lens.ts:handlePointerCancel",
        "pointercancel",
        {
          event: serializePointerEvent(event),
          zoomState: {
            phase: phaseRef.current,
            pointerId: pointerIdRef.current,
            hasPointerCapture: event.currentTarget.hasPointerCapture(event.pointerId),
            scrollY: window.scrollY,
            containerTouchAction: readTouchAction(event.currentTarget),
          },
        },
        "B",
      );
      // #endregion

      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "pointercancel");
    },
    [release],
  );

  const handlePointerEnd = handlePointerUp;

  const handleLostPointerCapture = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // #region agent log
      debugLog(
        "use-drag-zoom-lens.ts:handleLostPointerCapture",
        "lostpointercapture",
        {
          event: serializePointerEvent(event),
          zoomState: {
            phase: phaseRef.current,
            pointerId: pointerIdRef.current,
            scrollY: window.scrollY,
          },
        },
        "B",
      );
      // #endregion

      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      release(event.currentTarget, event.pointerId, "lostpointercapture");
    },
    [release],
  );

  const handleContextMenu = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const onBlur = () => release(containerRef.current, undefined, "blur");
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
      release(containerRef.current, undefined, "unmount");
    };
  }, [release]);

  return {
    containerRef,
    lensPosition,
    containerSize,
    isZooming: phase === "zooming",
    pointerType,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePointerEnd,
    handleLostPointerCapture,
    handleContextMenu,
  };
}

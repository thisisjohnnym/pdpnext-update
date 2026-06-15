"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseWeightLiftOptions = {
  holdMs: number;
  onLift?: () => void;
};

/** Press-and-hold lift — progress fills, haptic at completion, resets on release */
export function useWeightLift({ holdMs, onLift }: UseWeightLiftOptions) {
  const holdMsRef = useRef(holdMs);
  const onLiftRef = useRef(onLift);
  const isHoldingRef = useRef(false);
  const hapticFiredRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  holdMsRef.current = holdMs;
  onLiftRef.current = onLift;

  const cancelAnimation = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(
    function runTick(now: number) {
      if (!isHoldingRef.current || startTimeRef.current === null) {
        return;
      }

      const elapsed = now - startTimeRef.current;
      const nextProgress = Math.min(elapsed / holdMsRef.current, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1 && !hapticFiredRef.current) {
        hapticFiredRef.current = true;
        onLiftRef.current?.();
      }

      if (nextProgress < 1) {
        rafRef.current = requestAnimationFrame(runTick);
      }
    },
    [],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      // Block iOS long-press image callout (Copy / Save) so press-and-hold lift works.
      if (event.pointerType === "touch") {
        event.preventDefault();
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      isHoldingRef.current = true;
      hapticFiredRef.current = false;
      startTimeRef.current = performance.now();
      setIsHolding(true);
      setProgress(0);
      cancelAnimation();
      rafRef.current = requestAnimationFrame(tick);
    },
    [cancelAnimation, tick],
  );

  const handleContextMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      isHoldingRef.current = false;
      startTimeRef.current = null;
      cancelAnimation();
      setIsHolding(false);
      setProgress(0);
      hapticFiredRef.current = false;
    },
    [cancelAnimation],
  );

  useEffect(() => cancelAnimation, [cancelAnimation]);

  return {
    progress,
    isHolding,
    handlePointerDown,
    handlePointerEnd,
    handleContextMenu,
  };
}

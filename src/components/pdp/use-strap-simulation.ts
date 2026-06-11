"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

/** Opacity weight for crossfade — peaks at 1 when progress matches index */
export function getStrapModeOpacity(index: number, progress: number) {
  return Math.max(0, 1 - Math.abs(progress - index));
}

/** Horizontal drag across strap wear modes — snaps on release */
export function useStrapSimulation(modeCount: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [snapping, setSnapping] = useState(false);

  const progressFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || modeCount <= 1) {
        return 0;
      }

      const rect = track.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return ratio * (modeCount - 1);
    },
    [modeCount],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      isDraggingRef.current = true;
      setSnapping(false);
      setProgress(progressFromClientX(event.clientX));
    },
    [progressFromClientX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) {
        return;
      }

      setProgress(progressFromClientX(event.clientX));
    },
    [progressFromClientX],
  );

  const handlePointerEnd = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      isDraggingRef.current = false;
      setSnapping(true);
      setProgress((current) => Math.round(current));
    },
    [],
  );

  const setModeIndex = useCallback(
    (index: number) => {
      setSnapping(true);
      setProgress(clamp(index, 0, modeCount - 1));
    },
    [modeCount],
  );

  useEffect(() => {
    if (!snapping) {
      return;
    }

    const timeout = window.setTimeout(() => setSnapping(false), 320);
    return () => window.clearTimeout(timeout);
  }, [progress, snapping]);

  const activeIndex = Math.round(progress);
  const sliderProgress =
    modeCount > 1 ? `${(progress / (modeCount - 1)) * 100}%` : "0%";

  return {
    trackRef,
    progress,
    activeIndex,
    snapping,
    sliderProgress,
    setModeIndex,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  };
}

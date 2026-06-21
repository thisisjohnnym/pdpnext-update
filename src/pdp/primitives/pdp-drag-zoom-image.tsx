"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type PdpDragZoomImageProps = {
  src: string;
  alt: string;
  objectPosition?: string;
  priority?: boolean;
  hideHint?: boolean;
};

/** Long-press zoom for product still */
export function PdpDragZoomImage({
  src,
  alt,
  objectPosition = "center",
  priority = false,
}: PdpDragZoomImageProps) {
  const [zoomed, setZoomed] = useState(false);
  const pressTimer = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handlePointerDown = () => {
    clearTimer();
    pressTimer.current = window.setTimeout(() => {
      setZoomed(true);
    }, 320);
  };

  const handlePointerUp = () => {
    clearTimer();
    setZoomed(false);
  };

  return (
    <div
      className="relative size-full touch-pan-y overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          "object-cover transition-transform duration-300 ease-out",
          zoomed && "scale-[1.65]",
        )}
        style={{ objectPosition }}
        sizes="100vw"
        draggable={false}
      />
    </div>
  );
}

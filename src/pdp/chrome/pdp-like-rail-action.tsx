"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { useReducedMotion } from "../hooks/use-reduced-motion";
import { pdpPressableIconClass } from "../chrome/pdp-type";

const LIKE_RED = "#FE2C55";
const BURST_DURATION_MS = 1700;
const BURST_EASING = "cubic-bezier(0.22, 0.92, 0.24, 1)";
const RAIL_ICON_SIZE = 24;

// Fill-toggle cross-fade — both hearts stay in the DOM and swap via CSS
// transitions (scale 0.25→1, opacity 0→1, blur 4px→0) on the skill's curve.
const FILL_TOGGLE_TRANSITION =
  "transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none";
const FILL_TOGGLE_SHOWN = "opacity-100 scale-100 blur-0";
const FILL_TOGGLE_HIDDEN = "opacity-0 scale-[0.25] blur-[4px]";

const HEART_BURST_PARTICLES = [
  { rise: 78, sway: -12, size: 14, delay: 0, spin: -14 },
  { rise: 96, sway: 14, size: 12, delay: 60, spin: 16 },
  { rise: 64, sway: -8, size: 11, delay: 105, spin: -10 },
  { rise: 108, sway: 10, size: 10, delay: 40, spin: 12 },
  { rise: 88, sway: -18, size: 12, delay: 140, spin: -16 },
  { rise: 72, sway: 8, size: 9, delay: 85, spin: 10 },
  { rise: 112, sway: -6, size: 10, delay: 170, spin: -8 },
  { rise: 58, sway: 16, size: 8, delay: 195, spin: 18 },
  { rise: 102, sway: -14, size: 11, delay: 125, spin: -12 },
  { rise: 84, sway: 6, size: 9, delay: 220, spin: 8 },
] as const;

function railIconStyle(filled = false): CSSProperties {
  return {
    fontSize: RAIL_ICON_SIZE,
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${RAIL_ICON_SIZE}`,
  };
}

type HeartBurstParticleProps = {
  rise: number;
  sway: number;
  size: number;
  delay: number;
  spin: number;
};

function HeartBurstParticle({ rise, sway, size, delay, spin }: HeartBurstParticleProps) {
  const particleRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const particle = particleRef.current;
    if (!particle || reducedMotion) {
      return;
    }

    const animation = particle.animate(
      [
        {
          transform: "translate(-50%, -50%) scale(0.35) rotate(0deg)",
          opacity: 0.85,
          offset: 0,
        },
        {
          transform: `translate(calc(-50% + ${sway * 0.35}px), calc(-50% + 2px)) scale(1.15) rotate(${spin * 0.25}deg)`,
          opacity: 1,
          offset: 0.18,
        },
        {
          transform: `translate(calc(-50% + ${sway}px), calc(-50% - ${rise}px)) scale(0.55) rotate(${spin}deg)`,
          opacity: 0,
          offset: 1,
        },
      ],
      {
        duration: BURST_DURATION_MS,
        delay,
        easing: BURST_EASING,
        fill: "forwards",
      },
    );

    return () => {
      animation.cancel();
    };
  }, [delay, rise, sway, spin, reducedMotion]);

  return (
    <span
      ref={particleRef}
      className="pointer-events-none absolute left-1/2 top-[54%] will-change-transform"
      style={{ color: LIKE_RED } as CSSProperties}
    >
      <MaterialIcon
        name="favorite"
        size={18}
        filled
        className="text-[#FE2C55]"
        style={{ fontSize: size }}
      />
    </span>
  );
}

type PdpLikeRailActionProps = {
  label: string;
  ariaLabel: string;
  liked: boolean;
  onToggle: () => void;
  className?: string;
};

export function PdpLikeRailAction({
  label,
  ariaLabel,
  liked,
  onToggle,
  className,
}: PdpLikeRailActionProps) {
  const [bursting, setBursting] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!bursting) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setBursting(false);
    }, BURST_DURATION_MS + 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [bursting]);

  const handleClick = () => {
    if (!liked && !reducedMotion) {
      setBurstKey((key) => key + 1);
      setBursting(true);
    }
    onToggle();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={liked}
      className={cn(
        "flex min-w-10 flex-col items-center gap-0.5 text-white",
        pdpPressableIconClass,
        className,
      )}
    >
      <span className="relative flex size-8 items-center justify-center overflow-visible">
        <span
          key="like-icon-unliked"
          aria-hidden
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center",
            FILL_TOGGLE_TRANSITION,
            liked ? FILL_TOGGLE_HIDDEN : FILL_TOGGLE_SHOWN,
          )}
        >
          <MaterialIcon
            name="favorite"
            size={RAIL_ICON_SIZE}
            style={railIconStyle(false)}
            className="text-white"
          />
        </span>
        <span
          key="like-icon-liked"
          aria-hidden
          className={cn(
            "absolute inset-0 z-10 flex items-center justify-center",
            FILL_TOGGLE_TRANSITION,
            liked ? FILL_TOGGLE_SHOWN : FILL_TOGGLE_HIDDEN,
          )}
        >
          <MaterialIcon
            name="favorite"
            size={RAIL_ICON_SIZE}
            filled
            style={railIconStyle(true)}
            className="text-[#FE2C55]"
          />
        </span>
        {bursting ? (
          <span
            key={`burst-${burstKey}`}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-visible"
          >
            {HEART_BURST_PARTICLES.map((particle) => (
              <HeartBurstParticle
                key={`${burstKey}-${particle.rise}-${particle.sway}-${particle.size}-${particle.delay}-${particle.spin}`}
                rise={particle.rise}
                sway={particle.sway}
                size={particle.size}
                delay={particle.delay}
                spin={particle.spin}
              />
            ))}
          </span>
        ) : null}
      </span>
      <span className="font-extended text-[10px] leading-none tracking-[0.2px] text-white">
        {label}
      </span>
    </button>
  );
}

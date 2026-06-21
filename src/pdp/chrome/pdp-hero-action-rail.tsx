"use client";

import { useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { PDP_RAIL_COUNTS } from "../pdp-media";
import { PdpLikeRailAction } from "./pdp-like-rail-action";

const RAIL_ICON_SIZE = 24;

type RailStatProps = {
  icon: string;
  label: string;
  ariaLabel: string;
};

function RailStat({ icon, label, ariaLabel }: RailStatProps) {
  return (
    <div
      aria-label={ariaLabel}
      className="flex flex-col items-center gap-0.5 text-white"
    >
      <MaterialIcon
        name={icon}
        size={RAIL_ICON_SIZE}
        className="text-white"
        style={{
          fontSize: RAIL_ICON_SIZE,
          fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' ${RAIL_ICON_SIZE}`,
        }}
      />
      <span className="font-extended text-[10px] leading-none tracking-[0.2px] text-white">
        {label}
      </span>
    </div>
  );
}

type PdpHeroActionRailProps = {
  className?: string;
};

/** Design 4S6-0 — favorite (interactive), chat + share (visual only) */
export function PdpHeroActionRail({ className }: PdpHeroActionRailProps) {
  const [liked, setLiked] = useState(false);

  return (
    <div
      data-hero-immersive="rail"
      className={cn(
        "absolute bottom-20 right-2 z-20 flex flex-col items-center gap-4 [filter:drop-shadow(0_1px_3px_rgba(0,0,0,0.45))]",
        className,
      )}
    >
      <PdpLikeRailAction
        label={PDP_RAIL_COUNTS.likes}
        ariaLabel={`Like, ${PDP_RAIL_COUNTS.likes} likes`}
        liked={liked}
        onToggle={() => setLiked((prev) => !prev)}
      />
      <RailStat
        icon="chat_bubble"
        label={PDP_RAIL_COUNTS.chat}
        ariaLabel={`Comments, ${PDP_RAIL_COUNTS.chat} comments`}
      />
      <RailStat
        icon="share"
        label={PDP_RAIL_COUNTS.share}
        ariaLabel={`Share, ${PDP_RAIL_COUNTS.share} shares`}
      />
    </div>
  );
}

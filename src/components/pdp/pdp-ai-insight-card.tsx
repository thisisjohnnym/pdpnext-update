import type { ReactNode } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

export type PdpAiInsightContentProps = {
  title: string;
  body: string;
  eyebrow?: string;
  /** Eyebrow placement — reviews attribution sits below the summary paragraph */
  eyebrowPosition?: "above" | "below";
  className?: string;
  showIcon?: boolean;
  size?: "default" | "compact" | "xs";
};

/** Shared icon + title + body row for AI insight callouts */
export function PdpAiInsightContent({
  title,
  body,
  eyebrow,
  eyebrowPosition = "above",
  className,
  showIcon = true,
  size = "default",
}: PdpAiInsightContentProps) {
  const compact = size === "compact" || size === "xs";
  const extraSmall = size === "xs";

  const eyebrowEl = eyebrow ? (
    <p className="font-extended text-xs tracking-[0.2px] text-neutral-500">
      {eyebrow}
    </p>
  ) : null;

  return (
    <div className={cn("flex items-start", showIcon ? "gap-3" : "gap-0", className)}>
      {showIcon ? (
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-black text-white"
          aria-hidden
        >
          <MaterialIcon name="auto_awesome" size={18} className="text-white" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        {eyebrowPosition === "above" ? eyebrowEl : null}
        <p
          className={cn(
            "font-extended font-bold leading-snug tracking-[0.2px] text-black",
            extraSmall ? "text-xs" : compact ? "text-sm" : "text-base",
            eyebrow && eyebrowPosition === "above" && "mt-0.5",
          )}
        >
          {title}
        </p>
        <p
          className={cn(
            "font-extended leading-[1.35] tracking-[0.2px] text-neutral-600",
            extraSmall
              ? "mt-1.5 text-xs"
              : compact
                ? "mt-1.5 text-sm"
                : "mt-2 text-base",
          )}
        >
          {body}
        </p>
        {eyebrowPosition === "below" ? (
          <div className={cn(extraSmall ? "mt-1.5" : compact ? "mt-2" : "mt-2.5")}>
            {eyebrowEl}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type PdpAiInsightCardProps = PdpAiInsightContentProps & {
  onDismiss?: () => void;
  dismissLabel?: string;
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** polite for live recommendations */
  ariaLive?: "polite" | "off";
  variant?: "card" | "minimal";
  /** Minimal only — inset white box on muted sections */
  contained?: boolean;
};

/** White insight card — browsing nudges, compare tips, reviews summary, etc. */
export function PdpAiInsightCard({
  title,
  body,
  eyebrow,
  eyebrowPosition,
  onDismiss,
  dismissLabel = "Dismiss recommendation",
  footer,
  children,
  className,
  ariaLive = "off",
  showIcon = true,
  size = "default",
  variant = "card",
  contained = false,
}: PdpAiInsightCardProps) {
  const minimal = variant === "minimal";

  return (
    <div
      className={cn(
        "relative",
        minimal
          ? contained
            ? cn(
                "rounded-lg border border-neutral-200 bg-white px-3 py-2.5",
                onDismiss && "pr-8",
              )
            : "px-0 py-0"
          : cn("rounded-xl bg-white px-4 py-4", onDismiss && "pr-10"),
        className,
      )}
      aria-live={ariaLive === "polite" ? "polite" : undefined}
    >
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={cn(
            "absolute flex items-center justify-center rounded-full text-neutral-500 transition-colors active:bg-neutral-100",
            minimal
              ? contained
                ? "right-1.5 top-1.5 size-6"
                : "right-0 top-0 size-6"
              : "right-2 top-2 size-8",
          )}
        >
          <MaterialIcon name="close" size={18} />
        </button>
      ) : null}

      <PdpAiInsightContent
        title={title}
        body={body}
        eyebrow={eyebrow}
        eyebrowPosition={eyebrowPosition}
        showIcon={minimal ? false : showIcon}
        size={minimal ? (size === "default" ? "compact" : size) : size}
      />

      {footer ? (
        <div
          className={cn(
            minimal ? "mt-2" : "mt-3",
            showIcon && !minimal && "pl-[calc(2.5rem+0.75rem)]",
          )}
        >
          {footer}
        </div>
      ) : null}

      {children}
    </div>
  );
}

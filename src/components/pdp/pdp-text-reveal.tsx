"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type PdpTextRevealProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** @deprecated No-op — kept for call-site compatibility during scroll animation refactor */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Copy block — pass-through wrapper (scroll reveal removed) */
export function PdpTextReveal<T extends ElementType = "div">({
  as,
  children,
  className,
  delay: _delay,
  style,
  ...props
}: PdpTextRevealProps<T>) {
  const Tag = as ?? "div";

  return (
    <Tag className={cn(className)} style={style} {...props}>
      {children}
    </Tag>
  );
}

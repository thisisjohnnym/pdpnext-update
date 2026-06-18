"use client";

import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type PdpRevealItemProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  /** @deprecated No-op — kept for call-site compatibility during scroll animation refactor */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

/** Layout block — pass-through wrapper (scroll reveal removed) */
export function PdpRevealItem<T extends ElementType = "div">({
  as,
  children,
  className,
  delay: _delay,
  ...props
}: PdpRevealItemProps<T>) {
  const Tag = as ?? "div";

  return (
    <Tag className={cn(className)} {...props}>
      {children}
    </Tag>
  );
}

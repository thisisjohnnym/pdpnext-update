import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SafeAreaMainProps = {
  children: ReactNode;
  className?: string;
  as?: "main" | "div" | "section";
};

/**
 * Default document-flow container — all normal content lives inside the safe area.
 * Edge-to-edge sections opt out via `.pdp-edge-to-edge` / `.pdp-hero-immersive`.
 */
export function SafeAreaMain({
  children,
  className,
  as: Component = "div",
}: SafeAreaMainProps) {
  return (
    <Component className={cn("pdp-safe-area-main w-full", className)}>
      {children}
    </Component>
  );
}

"use client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/cn";

import { pdpPressableIconClass } from "../chrome/pdp-type";
import { useHeroNavVisibility } from "../hooks/use-hero-nav-visibility";

const NAV_ICON_SIZE = 24;

function CoachCMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-[22px] items-center justify-center text-white",
        className,
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className="size-full"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.5289 5.70484C20.3306 5.6057 19.7355 5.20917 18.7438 4.81263C17.6529 4.41609 15.9174 3.87085 13.686 3.87085C10.1157 3.87085 6.79339 4.56479 4.36364 5.80397C1.4876 7.24142 0 9.42238 0 11.9999C0 17.3531 5.00827 20.1289 14.5289 20.1289C16.8595 20.1289 18.8926 19.5341 20.5785 18.3445L23.4545 19.8811H24V13.7347H23.4545L23.405 13.7843V13.8339C23.405 13.8834 22.9091 15.2713 21.6198 16.6592C20.4298 17.948 18.2479 19.4845 14.6777 19.4845C12.2975 19.4845 10.3636 18.5923 9.07438 16.9566C8.08264 15.6679 7.4876 13.8834 7.4876 12.099C7.4876 7.29099 11.2066 4.71349 14.6777 4.71349C17.0579 4.71349 19.1901 5.457 20.876 6.89445C22.3141 8.08407 23.1074 9.47195 23.405 10.4137V10.4633H24V4.16825H23.4545L20.5289 5.70484Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

type PdpHeroNavProps = {
  bagCount?: number;
  onOpenMenu?: () => void;
  className?: string;
};

/** Hero nav overlay — menu / logo / bag; icons fade on page scroll down */
export function PdpHeroNav({ bagCount = 0, onOpenMenu, className }: PdpHeroNavProps) {
  const iconsVisible = useHeroNavVisibility();

  return (
    <div
      data-hero-immersive="nav"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-20 px-2 pb-2 pt-5",
        className,
      )}
    >
      <div
        className="pointer-events-auto grid grid-cols-[1fr_auto_1fr] items-center"
        style={{ height: NAV_ICON_SIZE }}
      >
        <button
          type="button"
          aria-label="Open menu"
          onClick={onOpenMenu}
          className={cn(
            "flex items-center justify-self-start text-white transition-opacity duration-300",
            pdpPressableIconClass,
            iconsVisible ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{ width: NAV_ICON_SIZE, height: NAV_ICON_SIZE }}
        >
          <MaterialIcon name="menu" size={NAV_ICON_SIZE} className="text-white" />
        </button>

        <CoachCMark />

        <button
          type="button"
          aria-label={bagCount > 0 ? `Bag, ${bagCount} items` : "Bag"}
          className={cn(
            "relative flex items-center justify-self-end text-white transition-opacity duration-300",
            pdpPressableIconClass,
            iconsVisible ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          style={{ width: NAV_ICON_SIZE, height: NAV_ICON_SIZE }}
        >
          <MaterialIcon name="shopping_bag" size={NAV_ICON_SIZE} className="text-white" />
          {bagCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-white text-[9px] font-medium text-black">
              {bagCount}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}

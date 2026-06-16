"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const LOW_BATTERY_THRESHOLD = 0.2;

type BatteryManagerLike = {
  charging: boolean;
  level: number;
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
};

export type PageLifecycleState = {
  isVisible: boolean;
  isFrozen: boolean;
  /** Tab is visible and not frozen — safe to run media and animation work */
  isPageActive: boolean;
};

export type NetworkQualityState = {
  saveData: boolean;
  effectiveType: "slow-2g" | "2g" | "3g" | "4g" | "unknown";
  autoplayAllowed: boolean;
  videoPreload: "none" | "metadata" | "auto";
};

export type PdpRuntimeContextValue = {
  lifecycle: PageLifecycleState;
  lowPowerMode: boolean;
  reducedMotion: boolean;
  network: NetworkQualityState;
  /** isVisible && !isFrozen — gate RAF loops and continuous animation */
  shouldRun: boolean;
};

const defaultLifecycle: PageLifecycleState = {
  isVisible: true,
  isFrozen: false,
  isPageActive: true,
};

const defaultNetwork: NetworkQualityState = {
  saveData: false,
  effectiveType: "4g",
  autoplayAllowed: true,
  videoPreload: "auto",
};

const PdpRuntimeContext = createContext<PdpRuntimeContextValue | null>(null);

function readVisibility(): boolean {
  if (typeof document === "undefined") {
    return true;
  }

  return document.visibilityState === "visible";
}

function resolveNetworkQuality(
  saveData: boolean,
  effectiveType: NetworkQualityState["effectiveType"],
): Pick<NetworkQualityState, "autoplayAllowed" | "videoPreload"> {
  if (saveData) {
    return { autoplayAllowed: false, videoPreload: "none" };
  }

  if (effectiveType === "slow-2g" || effectiveType === "2g") {
    return { autoplayAllowed: false, videoPreload: "none" };
  }

  if (effectiveType === "3g") {
    return { autoplayAllowed: true, videoPreload: "metadata" };
  }

  return { autoplayAllowed: true, videoPreload: "auto" };
}

function readNetworkQuality(): NetworkQualityState {
  if (typeof navigator === "undefined") {
    return defaultNetwork;
  }

  const connection = (
    navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
        addEventListener?: (type: string, listener: () => void) => void;
        removeEventListener?: (type: string, listener: () => void) => void;
      };
    }
  ).connection;

  const saveData = connection?.saveData ?? false;
  const rawType = connection?.effectiveType ?? "4g";
  const effectiveType = (
    ["slow-2g", "2g", "3g", "4g"].includes(rawType) ? rawType : "unknown"
  ) as NetworkQualityState["effectiveType"];

  return {
    saveData,
    effectiveType,
    ...resolveNetworkQuality(saveData, effectiveType),
  };
}

function readReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readHeuristicLowPower(network: NetworkQualityState): boolean {
  return network.saveData || network.effectiveType === "slow-2g" || network.effectiveType === "2g";
}

/** Single shared runtime layer — lifecycle, battery, network, reduced motion */
export function PdpRuntimeProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFrozen, setIsFrozen] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [network, setNetwork] = useState<NetworkQualityState>(defaultNetwork);

  useEffect(() => {
    setIsVisible(readVisibility());

    const onVisibilityChange = () => {
      setIsVisible(readVisibility());
    };

    const onPageHide = () => {
      setIsFrozen(true);
    };

    const onPageShow = () => {
      setIsFrozen(false);
      setIsVisible(readVisibility());
    };

    const onFreeze = () => {
      setIsFrozen(true);
    };

    const onResume = () => {
      setIsFrozen(false);
      setIsVisible(readVisibility());
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("freeze", onFreeze);
    window.addEventListener("resume", onResume);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("freeze", onFreeze);
      window.removeEventListener("resume", onResume);
    };
  }, []);

  useEffect(() => {
    setNetwork(readNetworkQuality());

    const connection = (
      navigator as Navigator & {
        connection?: {
          addEventListener?: (type: string, listener: () => void) => void;
          removeEventListener?: (type: string, listener: () => void) => void;
        };
      }
    ).connection;

    const syncNetwork = () => {
      setNetwork(readNetworkQuality());
    };

    connection?.addEventListener?.("change", syncNetwork);

    return () => {
      connection?.removeEventListener?.("change", syncNetwork);
    };
  }, []);

  useEffect(() => {
    setReducedMotion(readReducedMotion());

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setReducedMotion(media.matches);
    };

    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const getBattery = (
      navigator as Navigator & {
        getBattery?: () => Promise<BatteryManagerLike>;
      }
    ).getBattery;

    if (!getBattery) {
      setLowPowerMode(readHeuristicLowPower(network));
      return;
    }

    let disposed = false;
    let battery: BatteryManagerLike | null = null;

    const syncBattery = () => {
      if (!battery) {
        return;
      }

      const batteryLow = !battery.charging && battery.level <= LOW_BATTERY_THRESHOLD;
      setLowPowerMode(batteryLow || readHeuristicLowPower(network));
    };

    void getBattery.call(navigator).then((manager) => {
      if (disposed) {
        return;
      }

      battery = manager;
      syncBattery();
      manager.addEventListener("levelchange", syncBattery);
      manager.addEventListener("chargingchange", syncBattery);
    });

    return () => {
      disposed = true;

      if (battery) {
        battery.removeEventListener("levelchange", syncBattery);
        battery.removeEventListener("chargingchange", syncBattery);
      }
    };
  }, [network.saveData, network.effectiveType]);

  const lifecycle = useMemo<PageLifecycleState>(
    () => ({
      isVisible,
      isFrozen,
      isPageActive: isVisible && !isFrozen,
    }),
    [isVisible, isFrozen],
  );

  const value = useMemo<PdpRuntimeContextValue>(
    () => ({
      lifecycle,
      lowPowerMode,
      reducedMotion,
      network,
      shouldRun: lifecycle.isPageActive,
    }),
    [lifecycle, lowPowerMode, reducedMotion, network],
  );

  return (
    <PdpRuntimeContext.Provider value={value}>{children}</PdpRuntimeContext.Provider>
  );
}

export function usePdpRuntime(): PdpRuntimeContextValue {
  const context = useContext(PdpRuntimeContext);

  if (!context) {
    throw new Error("usePdpRuntime must be used within PdpRuntimeProvider");
  }

  return context;
}

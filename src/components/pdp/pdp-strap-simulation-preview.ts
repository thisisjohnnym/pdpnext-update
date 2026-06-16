import type { PdpStrapSimulationMode, PdpStrapSimulationPreview } from "./pdp-data";

const CHARM_BAG_PREVIEW: PdpStrapSimulationPreview = {
  src: "/images/gallery/tabby-leather-front-charm.png",
  alt: "Tabby Shoulder Bag 26 with bag charm",
  objectPosition: "center 72%",
};

const CHARM_CHAIN_BAG_PREVIEW: PdpStrapSimulationPreview = {
  src: "/images/compare/tabby-charms.png",
  alt: "Tabby Shoulder Bag 26 with charm chain strap and mixed bag charms",
  objectPosition: "center center",
};

/** Resolve the hero preview from the active strap and charm selection */
export function resolveStrapSimulationPreview(
  activeMode: PdpStrapSimulationMode,
  activeCharmId: string,
): PdpStrapSimulationPreview {
  const hasCharm = activeCharmId !== "none";
  const isCharmChainStrap =
    activeMode.id === "chain-strap-with-charms" || activeMode.id === "chain-strap";

  if (activeMode.id === "chain-strap-with-charms") {
    return activeMode.previewImage;
  }

  if (activeMode.id === "chain-strap" && hasCharm) {
    return CHARM_CHAIN_BAG_PREVIEW;
  }

  if (hasCharm && !isCharmChainStrap) {
    return CHARM_BAG_PREVIEW;
  }

  return activeMode.previewImage;
}

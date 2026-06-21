"use client";

type PdpHotspotTickerRowProps = {
  className: string;
  direction: "left" | "right";
};

const ROW_ITEMS = [
  "Tabby 26",
  "Tabby 26",
  "Tabby 26",
  "Tabby 26",
  "Tabby 26",
  "Tabby 26",
] as const;

function PdpHotspotTickerRow({ className, direction }: PdpHotspotTickerRowProps) {
  const animationClass =
    direction === "left"
      ? "pdp-hotspot-ticker__marquee--left"
      : "pdp-hotspot-ticker__marquee--right";

  return (
    <div className={className}>
      <div
        className={`pdp-hotspot-ticker__marquee ${animationClass}`}
        aria-label="Tabby 26 ticker"
      >
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="pdp-hotspot-ticker__cluster" aria-hidden={copyIndex > 0}>
            {ROW_ITEMS.map((item, itemIndex) => (
              <span key={`${copyIndex}-${itemIndex}`} className="pdp-hotspot-ticker__text">
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two-row ticker positioned above hotspot module. */
export function PdpHotspotTicker() {
  return (
    <section id="pdp-hotspot-ticker" className="bg-white px-0">
      <div className="pdp-hotspot-ticker">
        <PdpHotspotTickerRow
          className="pdp-hotspot-ticker__row pdp-hotspot-ticker__row--top"
          direction="left"
        />
        <PdpHotspotTickerRow
          className="pdp-hotspot-ticker__row pdp-hotspot-ticker__row--bottom"
          direction="right"
        />
      </div>
    </section>
  );
}

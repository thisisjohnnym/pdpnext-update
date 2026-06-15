import { PdpMediaFeed } from "./pdp-media-feed";

/** Alternate full-viewport feed — entire route is edge-to-edge (no SafeAreaMain) */
export function PdpCommunityView() {
  return (
    <div className="relative h-svh w-full overflow-hidden bg-black">
      <PdpMediaFeed />
    </div>
  );
}

export type VideoDecoderState = "ACTIVE" | "PAUSED" | "DETACHED" | "UNLOADED";

type RegistryEntry = {
  state: VideoDecoderState;
  lastActiveAt: number;
};

const MAX_ACTIVE_DECODERS = 2;
const INACTIVE_UNLOAD_MS = 30_000;

class VideoDecoderRegistry {
  private entries = new Map<string, RegistryEntry>();

  register(id: string): boolean {
    const existing = this.entries.get(id);
    if (existing) {
      existing.state = "ACTIVE";
      existing.lastActiveAt = Date.now();
      return true;
    }

    this.evictForActiveSlot(id);

    if (this.countByState("ACTIVE") >= MAX_ACTIVE_DECODERS) {
      return false;
    }

    this.entries.set(id, { state: "ACTIVE", lastActiveAt: Date.now() });
    return true;
  }

  setState(id: string, state: VideoDecoderState) {
    const entry = this.entries.get(id);
    if (!entry) {
      if (state === "UNLOADED") {
        return;
      }

      this.entries.set(id, { state, lastActiveAt: Date.now() });
      return;
    }

    entry.state = state;
    if (state === "ACTIVE") {
      entry.lastActiveAt = Date.now();
    }
  }

  release(id: string) {
    this.entries.delete(id);
  }

  shouldMount(id: string): boolean {
    this.unloadStale();

    const entry = this.entries.get(id);
    if (entry && entry.state !== "UNLOADED") {
      return true;
    }

    return this.countByState("ACTIVE") < MAX_ACTIVE_DECODERS;
  }

  private evictForActiveSlot(nextActiveId: string) {
    while (this.countByState("ACTIVE") >= MAX_ACTIVE_DECODERS) {
      const paused = [...this.entries.entries()].filter(
        ([id, entry]) => entry.state === "PAUSED" && id !== nextActiveId,
      );

      if (paused.length > 0) {
        const [oldestPausedId] = paused.sort(
          (a, b) => a[1].lastActiveAt - b[1].lastActiveAt,
        )[0] ?? [];
        if (oldestPausedId) {
          this.entries.delete(oldestPausedId);
          continue;
        }
      }

      const active = [...this.entries.entries()].filter(
        ([id, entry]) => entry.state === "ACTIVE" && id !== nextActiveId,
      );

      if (active.length === 0) {
        break;
      }

      const [oldestActiveId] = active.sort(
        (a, b) => a[1].lastActiveAt - b[1].lastActiveAt,
      )[0] ?? [];

      if (oldestActiveId) {
        this.entries.delete(oldestActiveId);
        continue;
      }

      break;
    }
  }

  private unloadStale() {
    const now = Date.now();

    for (const [id, entry] of this.entries) {
      if (
        entry.state === "PAUSED" &&
        now - entry.lastActiveAt >= INACTIVE_UNLOAD_MS
      ) {
        this.entries.delete(id);
      }
    }
  }

  private countByState(state: VideoDecoderState): number {
    let count = 0;
    for (const entry of this.entries.values()) {
      if (entry.state === state) {
        count += 1;
      }
    }
    return count;
  }
}

export const videoDecoderRegistry = new VideoDecoderRegistry();

export const DECODER_LIMITS = {
  maxActiveDecoders: MAX_ACTIVE_DECODERS,
  maxMountedVideos: MAX_ACTIVE_DECODERS,
  inactiveUnloadMs: INACTIVE_UNLOAD_MS,
} as const;

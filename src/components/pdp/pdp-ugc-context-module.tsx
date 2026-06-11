"use client";

import { useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_UGC_CONTEXT } from "./pdp-data";
import {
  EXPERIENCE_PANEL_BODY_CLASS,
  EXPERIENCE_PANEL_GRID_CLASS,
  EXPERIENCE_PANEL_HEADER_CLASS,
  EXPERIENCE_PANEL_ITEM_CLASS,
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";
import { PdpUgcStoryCard } from "./pdp-ugc-story-card";

/** UGC with context — who's wearing it, how, and where */
export function PdpUgcContextModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, intro, stories } = PDP_UGC_CONTEXT;
  const panel = experiencePanelSectionProps(isLastPanel);
  const [activeId, setActiveId] = useState(stories[0]!.id);
  const activeStory = stories.find((story) => story.id === activeId) ?? stories[0]!;

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <PageGrid fullWidth className={EXPERIENCE_PANEL_GRID_CLASS}>
        <GridItem mobile={12} desktop={24} className={EXPERIENCE_PANEL_ITEM_CLASS}>
          <div className={EXPERIENCE_PANEL_HEADER_CLASS}>
            <p className="font-extended text-xs tracking-[0.2px] text-black">{title}</p>
            <p className={`text-neutral-600 ${pdpType.caption}`}>{intro}</p>
          </div>

          <div className={EXPERIENCE_PANEL_BODY_CLASS}>
            <PdpUgcStoryCard
              story={activeStory}
              variant="overlay"
              className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "h-auto min-h-0 flex-1")}
              imageSizes="100vw"
            />

            <div className="grid shrink-0 grid-cols-2 gap-1 sm:grid-cols-3" aria-live="polite">
              {stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveId(story.id)}
                  aria-pressed={activeId === story.id}
                  className={cn(
                    "font-extended rounded-lg px-1.5 py-2 text-left text-[10px] leading-tight tracking-[0.2px] transition-colors",
                    activeId === story.id
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-black",
                  )}
                >
                  {story.context}
                </button>
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

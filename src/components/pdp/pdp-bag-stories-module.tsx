"use client";

import Image from "next/image";
import { useState } from "react";

import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import { PDP_BAG_STORIES } from "./pdp-data";
import {
  EXPERIENCE_PANEL_BODY_CLASS,
  EXPERIENCE_PANEL_GRID_CLASS,
  EXPERIENCE_PANEL_HEADER_CLASS,
  EXPERIENCE_PANEL_ITEM_CLASS,
  EXPERIENCE_PANEL_MEDIA_CLASS,
  experiencePanelSectionProps,
} from "./pdp-experience-panel";
import { pdpType } from "./pdp-type";

/** What's in my bag — lifestyle carry stories, not inventory specs */
export function PdpBagStoriesModule({
  isLastPanel = false,
}: {
  isLastPanel?: boolean;
}) {
  const { title, stories } = PDP_BAG_STORIES;
  const panel = experiencePanelSectionProps(isLastPanel);
  const [activeId, setActiveId] = useState(stories[0]!.id);
  const activeStory = stories.find((story) => story.id === activeId) ?? stories[0]!;

  return (
    <section data-header-surface="light" className={panel.className} style={panel.style}>
      <PageGrid fullWidth className={EXPERIENCE_PANEL_GRID_CLASS}>
        <GridItem mobile={12} desktop={24} className={EXPERIENCE_PANEL_ITEM_CLASS}>
          <div className={EXPERIENCE_PANEL_HEADER_CLASS}>
            <p className="font-extended text-xs tracking-[0.2px] text-black">{title}</p>
          </div>

          <div className={EXPERIENCE_PANEL_BODY_CLASS}>
            <div className={cn(EXPERIENCE_PANEL_MEDIA_CLASS, "bg-neutral-100")}>
              {stories.map((story) => (
                <Image
                  key={story.id}
                  src={story.image.src}
                  alt={story.image.alt}
                  fill
                  className={cn(
                    "object-cover transition-opacity duration-500 ease-out",
                    story.id === activeId ? "opacity-100" : "opacity-0",
                  )}
                  style={{ objectPosition: story.image.objectPosition ?? "center" }}
                  sizes="100vw"
                  priority={story.id === stories[0]!.id}
                />
              ))}

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent px-3 pb-3 pt-14"
              >
                <p className="font-extended text-sm tracking-[0.2px] text-white">
                  {activeStory.title}
                </p>
                <p className={`mt-1 text-white/80 ${pdpType.micro}`}>{activeStory.mood}</p>
                <p className={`mt-2 lowercase text-white/90 ${pdpType.micro}`}>
                  {activeStory.items.join(" · ")}
                </p>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-3 gap-1" aria-live="polite">
              {stories.map((story) => (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveId(story.id)}
                  aria-pressed={activeId === story.id}
                  className={cn(
                    "font-extended rounded-lg px-1 py-2 text-center text-[10px] leading-tight tracking-[0.2px] transition-colors",
                    activeId === story.id
                      ? "bg-black text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-black",
                  )}
                >
                  {story.title}
                </button>
              ))}
            </div>
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

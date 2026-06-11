"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

import { MaterialIcon } from "@/components/icons/material-icon";
import { GridItem, PageGrid } from "@/components/grid/page-grid";
import { cn } from "@/lib/cn";

import {
  PDP_AI_CONCIERGE,
  type PdpAiConciergePrompt,
} from "./pdp-data";
import { pdpModuleSectionClass, pdpModuleHeadingClass } from "./pdp-module-section";
import { pdpType } from "./pdp-type";

function ConciergeResponse({
  prompt,
  userQuery,
}: {
  prompt: PdpAiConciergePrompt | null;
  userQuery: string;
}) {
  const response = prompt?.response ?? PDP_AI_CONCIERGE.fallbackResponse;
  const highlights = prompt?.response.highlights;

  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
      aria-live="polite"
    >
      <div className="flex items-start gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black text-white">
          <MaterialIcon name="auto_awesome" size={18} className="text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-extended text-xs tracking-[0.2px] text-neutral-500">
            AI Concierge
          </p>
          <p className="font-extended mt-1 text-sm tracking-[0.2px] text-black">
            {response.headline}
          </p>
          <p className={`mt-2 text-neutral-700 ${pdpType.caption}`}>{response.body}</p>
        </div>
      </div>

      {highlights?.length ? (
        <ul className="flex flex-wrap gap-1.5">
          {highlights.map((highlight) => (
            <li
              key={highlight}
              className="font-extended rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] tracking-[0.2px] text-neutral-700"
            >
              {highlight}
            </li>
          ))}
        </ul>
      ) : null}

      {prompt?.response.images.length ? (
        <div className="grid grid-cols-2 gap-1.5">
          {prompt.response.images.map((image) => (
            <div
              key={image.src}
              className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover object-center"
                sizes="40vw"
              />
            </div>
          ))}
        </div>
      ) : null}

      {userQuery ? (
        <p className={`border-t border-neutral-100 pt-3 text-neutral-500 ${pdpType.micro}`}>
          You asked: &ldquo;{userQuery}&rdquo;
        </p>
      ) : null}
    </div>
  );
}

/** AI Concierge — experiential prompts with inline styling answers */
export function PdpAiConciergeModule() {
  const { title, placeholder, prompts, fallbackResponse } = PDP_AI_CONCIERGE;
  const [query, setQuery] = useState("");
  const [activePromptId, setActivePromptId] = useState<string | null>(null);
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);

  const hasQuery = query.trim().length > 0;
  const activePrompt =
    prompts.find((prompt) => prompt.id === activePromptId) ?? null;

  const runPrompt = useCallback((prompt: PdpAiConciergePrompt) => {
    setQuery(prompt.question);
    setActivePromptId(prompt.id);
    setSubmittedQuery(prompt.question);
    setShowResponse(true);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) {
        return;
      }

      const matchedPrompt = prompts.find(
        (prompt) => prompt.question.toLowerCase() === trimmed.toLowerCase(),
      );

      setSubmittedQuery(trimmed);
      setActivePromptId(matchedPrompt?.id ?? null);
      setShowResponse(true);
    },
    [query, prompts],
  );

  return (
    <section
      data-header-surface="light"
      className={pdpModuleSectionClass({ variant: "muted", rhythm: "compact" })}
    >
      <PageGrid fullWidth>
        <GridItem mobile={12} desktop={24}>
          <div className="flex flex-col gap-5">
            <h2 className={pdpModuleHeadingClass({ lead: false })}>{title}</h2>

            <form
              className="rounded-2xl bg-white p-3 shadow-sm"
              onSubmit={handleSubmit}
            >
              <label htmlFor="pdp-ai-prompt" className="sr-only">
                Ask the AI Concierge
              </label>

              <div className="flex items-start gap-2.5">
                <MaterialIcon
                  name="auto_awesome"
                  size={20}
                  className="mt-0.5 shrink-0 text-black"
                />
                <textarea
                  id="pdp-ai-prompt"
                  rows={2}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={placeholder}
                  className="font-extended min-h-[3.25rem] w-full resize-none bg-transparent text-sm leading-[1.35] tracking-[0.2px] text-black outline-none placeholder:text-neutral-400"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!hasQuery}
                  aria-label="Send prompt"
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    hasQuery
                      ? "bg-black text-white active:bg-neutral-800"
                      : "bg-neutral-100 text-neutral-400",
                  )}
                >
                  <MaterialIcon
                    name="arrow_upward"
                    size={20}
                    className={hasQuery ? "text-white" : "text-neutral-400"}
                  />
                </button>
              </div>
            </form>

            <div className="flex flex-col gap-2">
              <p className={`font-extended m-0 text-neutral-500 ${pdpType.micro}`}>
                Try asking
              </p>
              {prompts.map((prompt) => {
                const isActive = activePromptId === prompt.id && showResponse;

                return (
                  <button
                    key={prompt.id}
                    type="button"
                    onClick={() => runPrompt(prompt)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex w-full items-start gap-3 border p-3 text-left transition-colors duration-200",
                      isActive
                        ? "border-black bg-white shadow-sm"
                        : "border-neutral-200 bg-white active:bg-neutral-50",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center transition-colors",
                        isActive ? "bg-black text-white" : "bg-neutral-100 text-neutral-600",
                      )}
                    >
                      <MaterialIcon name={prompt.icon} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-extended block text-[10px] tracking-[0.2px] text-neutral-500">
                        {prompt.category}
                      </span>
                      <span className="font-extended mt-1 block text-sm leading-snug tracking-[0.2px] text-black">
                        {prompt.question}
                      </span>
                    </span>
                    <MaterialIcon
                      name="chevron_right"
                      size={20}
                      className={cn(
                        "mt-1 shrink-0 transition-colors",
                        isActive ? "text-black" : "text-neutral-300",
                      )}
                    />
                  </button>
                );
              })}
            </div>

            {showResponse ? (
              <ConciergeResponse
                prompt={activePrompt}
                userQuery={submittedQuery ?? ""}
              />
            ) : (
              <p className={`m-0 text-neutral-500 ${pdpType.micro}`}>
                {fallbackResponse.body}
              </p>
            )}
          </div>
        </GridItem>
      </PageGrid>
    </section>
  );
}

/** @deprecated Use PdpAiConciergeModule */
export const PdpProductSearchModule = PdpAiConciergeModule;

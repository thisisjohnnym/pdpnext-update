/** Mobile-first PDP copy — Helvetica Extended everywhere */
export const pdpType = {
  /** Captions, quotes, descriptive paragraphs */
  caption: "font-extended text-sm leading-[1.35] tracking-[0.2px] lg:text-xs",
  /** Product names, spec values, list rows */
  body: "font-extended text-sm leading-snug tracking-[0.2px] lg:text-xs",
  /** Prices, metadata, secondary lines */
  label: "font-extended text-xs tracking-[0.2px] lg:text-[11px]",
  /** Badges, chips, time labels */
  micro: "font-extended text-[11px] tracking-[0.2px] lg:text-[10px]",
  /** Uppercase tags (THIS ITEM, etc.) */
  tag: "font-extended text-[11px] uppercase tracking-[0.6px] lg:text-[10px]",
} as const;

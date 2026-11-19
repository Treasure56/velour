"use client";

import { useId, useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FilterGroupProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

/** Accordion group inside the filter drawer (open by default, smooth grid-rows transition). */
export function FilterGroup({ title, children, defaultOpen = true }: FilterGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className="border-b border-champagne">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-5 font-sans text-xs font-medium uppercase tracking-[0.2em]"
        >
          {title}
          {open ? <Minus aria-hidden size={14} strokeWidth={1.25} /> : <Plus aria-hidden size={14} strokeWidth={1.25} />}
        </button>
      </h3>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-500 ease-luxe motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useState } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { SORTS, type SortKey } from "@/lib/filter-products";
import { cn } from "@/lib/utils";
import { SortSheet } from "./SortSheet";

type SortSelectProps = {
  value: SortKey;
  onChange: (sort: SortKey) => void;
  className?: string;
};

/** Desktop/tablet: a quiet native select. Mobile: a "Sort" button that opens a bottom sheet. */
export function SortSelect({ value, onChange, className }: SortSelectProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  return (
    <div className={className}>
      <label className="hidden items-center gap-3 sm:flex">
        <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-mocha">Sort</span>
        <span className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value as SortKey)}
            className="cursor-pointer appearance-none bg-transparent py-2 pr-6 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-espresso"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            size={14}
            strokeWidth={1.25}
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
          />
        </span>
      </label>

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-haspopup="dialog"
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] sm:hidden",
        )}
      >
        <ArrowUpDown aria-hidden size={14} strokeWidth={1.25} />
        Sort
      </button>
      <SortSheet open={sheetOpen} onClose={closeSheet} value={value} onChange={onChange} />
    </div>
  );
}

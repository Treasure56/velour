"use client";

import { SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/ui";
import { activeFilterCount, type ShopFilters, type SortKey } from "@/lib/filter-products";
import { cn } from "@/lib/utils";
import { ActiveFilters } from "./ActiveFilters";
import { SortSelect } from "./SortSelect";

type FilterBarProps = {
  filters: ShopFilters;
  bounds: [number, number];
  update: (patch: Partial<ShopFilters>) => void;
  onSort: (sort: SortKey) => void;
  clearFilters: () => void;
  onOpenFilters: () => void;
  className?: string;
};

/**
 * Sticky bar under the navbar (follows it as it hides/shows, via --sticky-top).
 * Desktop: Filter + active pills on the left, sort on the right.
 * Mobile: Filter and Sort as two equal buttons; pills on a row below.
 */
export function FilterBar({ filters, bounds, update, onSort, clearFilters, onOpenFilters, className }: FilterBarProps) {
  const count = activeFilterCount(filters);

  return (
    <div
      data-filter-bar
      className={cn(
        "sticky top-(--sticky-top) z-40 border-b border-champagne bg-cream/95 backdrop-blur-md transition-[top] duration-400 ease-luxe motion-reduce:transition-none",
        className,
      )}
    >
      <Container className="grid grid-cols-2 divide-x divide-champagne sm:flex sm:h-16 sm:items-center sm:gap-6 sm:divide-x-0">
        <button
          type="button"
          onClick={onOpenFilters}
          aria-haspopup="dialog"
          className="flex h-12 shrink-0 items-center justify-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] sm:h-auto sm:justify-start"
        >
          <SlidersHorizontal aria-hidden size={14} strokeWidth={1.25} />
          Filter
          {count > 0 && <span className="tabular-nums text-mocha">({count})</span>}
        </button>

        <ActiveFilters
          filters={filters}
          bounds={bounds}
          update={update}
          clearFilters={clearFilters}
          className="hidden min-w-0 flex-1 sm:flex"
        />

        <SortSelect value={filters.sort} onChange={onSort} className="sm:ml-auto sm:shrink-0" />
      </Container>

      {count > 0 && (
        <Container className="border-t border-champagne/60 py-2.5 sm:hidden">
          <ActiveFilters filters={filters} bounds={bounds} update={update} clearFilters={clearFilters} />
        </Container>
      )}
    </div>
  );
}

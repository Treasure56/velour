"use client";

import { X } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { LENGTHS, TEXTURES, activeFilterCount, type ShopFilters } from "@/lib/filter-products";
import { cn } from "@/lib/utils";

type ActiveFiltersProps = {
  filters: ShopFilters;
  bounds: [number, number];
  update: (patch: Partial<ShopFilters>) => void;
  clearFilters: () => void;
  className?: string;
};

/** Small removable pills for each active filter, plus "Clear all". */
export function ActiveFilters({ filters, bounds, update, clearFilters, className }: ActiveFiltersProps) {
  if (activeFilterCount(filters) === 0) return null;

  const pills: { label: string; remove: () => void }[] = [
    ...filters.textures.map((key) => ({
      label: TEXTURES.find((t) => t.key === key)?.label ?? key,
      remove: () => update({ textures: filters.textures.filter((t) => t !== key) }),
    })),
    ...filters.lengths.map((key) => ({
      label: LENGTHS.find((l) => l.key === key)?.label ?? key,
      remove: () => update({ lengths: filters.lengths.filter((l) => l !== key) }),
    })),
    ...(filters.priceMin !== null || filters.priceMax !== null
      ? [
          {
            label: `${formatPrice(filters.priceMin ?? bounds[0])} – ${formatPrice(filters.priceMax ?? bounds[1])}`,
            remove: () => update({ priceMin: null, priceMax: null }),
          },
        ]
      : []),
    ...(filters.onSale ? [{ label: "On Sale", remove: () => update({ onSale: false }) }] : []),
  ];

  return (
    // Display comes from the caller (e.g. "hidden sm:flex") so classes never fight; defaults to flex.
    <div className={cn("items-center gap-2 overflow-x-auto scrollbar-none", className ?? "flex")}>
      <ul className="flex shrink-0 gap-2">
        {pills.map((pill) => (
          <li key={pill.label}>
            <button
              type="button"
              onClick={pill.remove}
              aria-label={`Remove filter: ${pill.label}`}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-champagne bg-ivory px-3 py-1.5 text-xs transition-colors duration-300 hover:border-espresso"
            >
              {pill.label}
              <X aria-hidden size={12} strokeWidth={1.5} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={clearFilters}
        className="shrink-0 whitespace-nowrap px-2 py-1.5 text-xs text-mocha underline-offset-4 hover:text-espresso hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

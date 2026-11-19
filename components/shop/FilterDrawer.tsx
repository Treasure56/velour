"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { LENGTHS, TEXTURES, type ShopFilters } from "@/lib/filter-products";
import { EASE } from "@/lib/motion";
import { Checkbox } from "./Checkbox";
import { FilterGroup } from "./FilterGroup";
import { PriceRange } from "./PriceRange";

type FilterDrawerProps = {
  open: boolean;
  /** Must be stable (useCallback) */
  onClose: () => void;
  filters: ShopFilters;
  update: (patch: Partial<ShopFilters>) => void;
  clearFilters: () => void;
  resultCount: number;
  bounds: [number, number];
  saleActive: boolean;
};

const toggle = <T,>(list: T[], value: T, on: boolean) => (on ? [...list, value] : list.filter((v) => v !== value));

/**
 * Left slide-in filter panel (all screen sizes). Filters apply live, so "Show X products" just
 * closes it. Esc and backdrop close it; focus is trapped; page scroll is locked.
 */
export function FilterDrawer({
  open,
  onClose,
  filters,
  update,
  clearFilters,
  resultCount,
  bounds,
  saleActive,
}: FilterDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);
  useScrollLock(open);

  const [minBound, maxBound] = bounds;
  const priceValue: [number, number] = [filters.priceMin ?? minBound, filters.priceMax ?? maxBound];

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden
              onClick={onClose}
              className="fixed inset-0 z-60 bg-espresso/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            />
            <motion.div
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-drawer-title"
              className="fixed inset-y-0 left-0 z-61 flex w-[min(26rem,92vw)] flex-col bg-cream text-espresso"
              initial={{ x: "-100%" }}
              animate={{ x: 0, transition: { duration: 0.6, ease: EASE.bezier } }}
              exit={{ x: "-100%", transition: { duration: 0.45, ease: EASE.bezier } }}
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-champagne px-6">
                <h2 id="filter-drawer-title" className="font-serif text-2xl font-light">
                  Filter
                </h2>
                <button
                  type="button"
                  data-autofocus
                  onClick={onClose}
                  aria-label="Close filters"
                  className="-mr-3 grid size-11 place-items-center"
                >
                  <X aria-hidden size={20} strokeWidth={1.25} />
                </button>
              </div>

              <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6">
                <FilterGroup title="Texture">
                  {TEXTURES.map((t) => (
                    <Checkbox
                      key={t.key}
                      label={t.label}
                      checked={filters.textures.includes(t.key)}
                      onChange={(on) => update({ textures: toggle(filters.textures, t.key, on) })}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Length">
                  {LENGTHS.map((l) => (
                    <Checkbox
                      key={l.key}
                      label={l.label}
                      checked={filters.lengths.includes(l.key)}
                      onChange={(on) => update({ lengths: toggle(filters.lengths, l.key, on) })}
                    />
                  ))}
                </FilterGroup>

                <FilterGroup title="Price">
                  <PriceRange
                    min={minBound}
                    max={maxBound}
                    value={priceValue}
                    onChange={([lo, hi]) =>
                      update({ priceMin: lo <= minBound ? null : lo, priceMax: hi >= maxBound ? null : hi })
                    }
                  />
                </FilterGroup>

                {saleActive && (
                  <FilterGroup title="Availability">
                    <Checkbox label="On Sale" checked={filters.onSale} onChange={(on) => update({ onSale: on })} />
                  </FilterGroup>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-champagne px-6 py-5">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-mocha underline-offset-4 hover:text-espresso hover:underline"
                >
                  Clear all
                </button>
                <Button variant="dark" onClick={onClose}>
                  Show {resultCount} {resultCount === 1 ? "product" : "products"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

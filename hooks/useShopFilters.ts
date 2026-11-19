"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_FILTERS, parseFilters, serializeFilters, type ShopFilters } from "@/lib/filter-products";

type UpdateMode = "push" | "replace";

/**
 * Shop filters live in the URL (shareable, back/forward friendly). Updates use the native
 * History API, which Next.js syncs with useSearchParams: shallow, no server round-trip, no reload.
 * - push: category tabs and sort (worth a history entry)
 * - replace: refining filters (checkboxes, price slider) so Back doesn't replay every click
 */
export function useShopFilters() {
  const params = useSearchParams();
  const filters = useMemo(() => parseFilters(new URLSearchParams(params.toString())), [params]);

  const update = useCallback((patch: Partial<ShopFilters>, mode: UpdateMode = "replace") => {
    const current = parseFilters(new URLSearchParams(window.location.search));
    const qs = serializeFilters({ ...current, ...patch });
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  }, []);

  /** Clears refining filters; keeps the category tab and the sort. */
  const clearFilters = useCallback(() => {
    const { textures, lengths, priceMin, priceMax, onSale } = DEFAULT_FILTERS;
    update({ textures, lengths, priceMin, priceMax, onSale });
  }, [update]);

  return { filters, update, clearFilters };
}

"use client";

import { useCallback, useMemo, useState } from "react";
import { Container } from "@/components/ui";
import { useShopFilters } from "@/hooks/useShopFilters";
import { filterProducts, priceBounds, serializeFilters, type ShopItem } from "@/lib/filter-products";
import { EmptyState } from "./EmptyState";
import { FilterBar } from "./FilterBar";
import { FilterDrawer } from "./FilterDrawer";
import { ProductGrid } from "./ProductGrid";
import { ShopHeader } from "./ShopHeader";

type ShopProps = {
  /** All products with server-resolved images and per-product discounts */
  items: ShopItem[];
  saleActive: boolean;
};

/** The shop: header + tabs, sticky filter/sort bar, grid, and the filter drawer, all driven by the URL. */
export function Shop({ items, saleActive }: ShopProps) {
  const { filters, update, clearFilters } = useShopFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const results = useMemo(() => filterProducts(items, filters), [items, filters]);
  const bounds = useMemo(() => priceBounds(items), [items]);

  return (
    <>
      <ShopHeader
        count={results.length}
        category={filters.category}
        onCategory={(category) => update({ category }, "push")}
      />

      {/* Direct child of the tall page container, otherwise position: sticky has no room to stick. */}
      <FilterBar
        className="mt-8 lg:mt-10"
        filters={filters}
        bounds={bounds}
        update={update}
        onSort={(sort) => update({ sort }, "push")}
        clearFilters={clearFilters}
        onOpenFilters={() => setDrawerOpen(true)}
      />

      <Container className="pb-24 pt-10 lg:pb-32 lg:pt-14">
        {results.length > 0 ? (
          <ProductGrid items={results} signature={serializeFilters(filters)} />
        ) : (
          <EmptyState onClear={clearFilters} />
        )}
      </Container>

      <FilterDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        filters={filters}
        update={update}
        clearFilters={clearFilters}
        resultCount={results.length}
        bounds={bounds}
        saleActive={saleActive}
      />
    </>
  );
}

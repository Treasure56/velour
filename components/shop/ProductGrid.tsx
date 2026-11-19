"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui";
import type { ShopItem } from "@/lib/filter-products";
import { EASE } from "@/lib/motion";

const PAGE = 12;
const SIZES = "(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 48vw";

type ProductGridProps = {
  items: ShopItem[];
  /** Changes whenever filters/sort change; resets "Load more" back to the first page. */
  signature: string;
};

/**
 * 2 / 3 / 4 column grid of the shared ProductCard. Cards glide to new positions when filters change
 * (layout + AnimatePresence, short fades); the stagger only plays on first load. 12 at a time.
 */
export function ProductGrid({ items, signature }: ProductGridProps) {
  // "Load more" count, reset when the filter signature changes (derived, no effect needed).
  const [page, setPage] = useState({ signature, count: PAGE });
  const count = page.signature === signature ? page.count : PAGE;
  const visible = items.slice(0, count);

  // After the first-load stagger has played, later entries just fade in.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-4 lg:grid-cols-3 lg:gap-y-14 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial>
          {visible.map((item, i) => (
            <motion.li
              key={item.product.id}
              layout
              initial={{ opacity: 0, y: settled ? 0 : 16 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: settled ? 0.4 : 0.7, ease: EASE.bezier, delay: settled ? 0 : Math.min(i, 11) * 0.06 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              transition={{ layout: { duration: 0.5, ease: EASE.bezier } }}
            >
              <ProductCard
                product={item.product}
                images={item.images}
                discount={item.discount}
                sizes={SIZES}
                eager={i < 4}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {items.length > count && (
        <div className="mt-16 flex flex-col items-center gap-5 lg:mt-20">
          <p className="text-xs text-mocha tabular-nums">
            Showing {count} of {items.length}
          </p>
          <Button variant="outline" onClick={() => setPage({ signature, count: count + PAGE })}>
            Load more
          </Button>
        </div>
      )}
    </MotionConfig>
  );
}

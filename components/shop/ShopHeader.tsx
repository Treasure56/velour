"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container, FadeUp } from "@/components/ui";
import { CATEGORIES, type CategoryKey } from "@/lib/filter-products";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ShopHeaderProps = {
  count: number;
  category: CategoryKey;
  onCategory: (category: CategoryKey) => void;
};

/** Breadcrumb, "The Collection." with the result count, and category tabs with a sliding underline. */
export function ShopHeader({ count, category, onCategory }: ShopHeaderProps) {
  return (
    <header className="pt-36 lg:pt-44">
      <Container>
        <FadeUp>
          <nav aria-label="Breadcrumb">
            <ol className="flex gap-2 text-xs text-mocha">
              <li>
                <Link href="/" className="hover:text-espresso">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-espresso">
                Shop
              </li>
            </ol>
          </nav>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h1 className="font-serif text-[clamp(2.75rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.01em]">
              The <em className="italic">Collection.</em>
            </h1>
            <p aria-live="polite" className="text-sm text-mocha tabular-nums">
              {count} {count === 1 ? "product" : "products"}
            </p>
          </div>

          <ul className="-mx-4 mt-8 flex gap-8 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0 lg:mt-10">
            {CATEGORIES.map((c) => {
              const active = c.key === category;
              return (
                <li key={c.key} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => onCategory(c.key)}
                    className={cn(
                      "relative whitespace-nowrap pb-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                      active ? "text-espresso" : "text-mocha hover:text-espresso",
                    )}
                  >
                    {c.label}
                    {active && (
                      <motion.span
                        layoutId="shop-category-underline"
                        aria-hidden
                        className="absolute inset-x-0 bottom-0 h-px bg-espresso"
                        transition={{ duration: 0.5, ease: EASE.bezier }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </FadeUp>
      </Container>
    </header>
  );
}

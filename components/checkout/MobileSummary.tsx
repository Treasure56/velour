"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { cn } from "@/lib/utils";
import type { CartItem, CartTotals } from "@/types/cart";
import { OrderSummary } from "./OrderSummary";

/** Phones/tablets: "Show order summary ▾ · ₦total" bar that expands the full summary. */
export function MobileSummary({ items, totals }: { items: CartItem[]; totals: CartTotals }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-champagne bg-ivory lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-order-summary"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-14 w-full items-center justify-between gap-4 px-4 text-sm sm:px-8"
      >
        <span className="inline-flex items-center gap-1.5">
          {open ? "Hide" : "Show"} order summary
          <ChevronDown
            aria-hidden
            size={16}
            strokeWidth={1.25}
            className={cn("transition-transform duration-500 ease-luxe motion-reduce:transition-none", open && "rotate-180")}
          />
        </span>
        <AnimatedPrice value={totals.total} className="font-serif text-xl" />
      </button>
      <div
        id="mobile-order-summary"
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-500 ease-luxe motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-6 pt-2 sm:px-8">
            <OrderSummary items={items} totals={totals} />
          </div>
        </div>
      </div>
    </div>
  );
}

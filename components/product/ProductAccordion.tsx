"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { Star } from "lucide-react";
import { careSteps, sampleReviews, shipping } from "@/data/product-content";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

/** Fired by the rating link to open a section (e.g. "reviews"). */
export const OPEN_SECTION_EVENT = "product:open-section";

function Item({ id, title, open, onToggle, children }: { id: string; title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  const panelId = useId();
  return (
    <section id={id} className="scroll-mt-32 border-b border-champagne">
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between py-5 text-left font-sans text-xs font-medium uppercase tracking-[0.2em]"
        >
          {title}
          {/* Plus whose vertical bar rotates flat into a minus */}
          <span aria-hidden className="relative size-3">
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
            <span
              className={cn(
                "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-500 ease-luxe motion-reduce:transition-none",
                open && "rotate-90",
              )}
            />
          </span>
        </button>
      </h2>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-500 ease-luxe motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-6 text-sm text-mocha">{children}</div>
        </div>
      </div>
    </section>
  );
}

/** Details, Hair Care, Shipping & Returns, Reviews. One open at a time. */
export function ProductAccordion({ product }: { product: Product }) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (id: string) => setOpen((current) => (current === id ? null : id));

  useEffect(() => {
    const onOpen = (e: Event) => setOpen((e as CustomEvent<string>).detail);
    window.addEventListener(OPEN_SECTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SECTION_EVENT, onOpen);
  }, []);

  const details = [
    ...product.details,
    ...(product.options.laceType ? [`Lace: ${product.options.laceType}`] : []),
    ...(product.category === "wigs" ? ["Cap size: Medium (22.5\"), adjustable"] : []),
  ];

  return (
    <div className="border-t border-champagne">
      <Item id="details" title="Details" open={open === "details"} onToggle={() => toggle("details")}>
        <ul className="grid gap-2">
          {details.map((d) => (
            <li key={d} className="flex gap-3">
              <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-champagne" />
              {d}
            </li>
          ))}
        </ul>
      </Item>

      <Item id="care" title="Hair Care" open={open === "care"} onToggle={() => toggle("care")}>
        <ol className="grid list-decimal gap-2 pl-4">
          {careSteps(product).map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </Item>

      <Item id="shipping" title="Shipping & Returns" open={open === "shipping"} onToggle={() => toggle("shipping")}>
        <dl className="grid gap-1.5">
          {shipping.delivery.map((d) => (
            <div key={d.region} className="flex justify-between gap-4">
              <dt>{d.region}</dt>
              <dd className="text-espresso">{d.time}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4">{shipping.returns}</p>
      </Item>

      <Item id="reviews" title={`Reviews (${product.reviewCount})`} open={open === "reviews"} onToggle={() => toggle("reviews")}>
        <ul className="grid gap-5">
          {sampleReviews.map((r) => (
            <li key={r.name}>
              <p className="flex gap-0.5" aria-label={`Rated ${r.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    aria-hidden
                    size={12}
                    strokeWidth={1.25}
                    className={i < r.rating ? "fill-espresso stroke-espresso" : "fill-none stroke-mocha/60"}
                  />
                ))}
              </p>
              <p className="mt-2 text-espresso">{r.text}</p>
              <p className="mt-1 text-xs">
                {r.name}, {r.city}
              </p>
            </li>
          ))}
        </ul>
      </Item>
    </div>
  );
}

import type { RefObject } from "react";
import { Clock, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui";
import { shippingConfig } from "@/data/shipping";
import { formatPrice } from "@/lib/currency";

type ProductActionsProps = {
  /** Receives the clicked button, the starting point of the fly-to-bag animation */
  onAddToBag: (from: Element) => void;
  onBuyNow: () => void;
  added: boolean;
  /** Wraps the main Add to Bag button so the sticky bar knows when it leaves the screen */
  addButtonRef: RefObject<HTMLDivElement | null>;
};

const FREE_DELIVERY_FROM = shippingConfig.freeShippingThreshold;

/** Add to Bag (blush) + Buy Now (espresso: adds, then goes to checkout), then three small trust lines. */
export function ProductActions({ onAddToBag, onBuyNow, added, addButtonRef }: ProductActionsProps) {
  const trust = [
    { icon: Truck, text: `Free delivery in Lagos over ${formatPrice(FREE_DELIVERY_FROM)}` },
    { icon: RotateCcw, text: "7-day easy returns" },
    { icon: Clock, text: "Ships in 24–48 hours" },
  ];

  return (
    <div>
      <div className="grid gap-3">
        <div ref={addButtonRef}>
          <Button onClick={(e) => onAddToBag(e.currentTarget)} className="w-full">
            {added ? "Added ✓" : "Add to Bag"}
          </Button>
        </div>
        <Button variant="dark" onClick={onBuyNow} className="w-full">
          Buy Now
        </Button>
      </div>
      <p aria-live="polite" className="sr-only">
        {added ? "Added to your bag" : ""}
      </p>

      <ul className="mt-5 grid gap-2 text-xs text-mocha">
        {trust.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <Icon aria-hidden size={16} strokeWidth={1.25} className="shrink-0 text-espresso" />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { describeOptions, lineUnitPrice } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { CartItem as CartLine } from "@/types/cart";

type CartItemProps = {
  item: CartLine;
  /** Promo code currently applied to a live promotion */
  codeActive: boolean;
  /** drawer: compact; page: table-like row (image | details | quantity | line total) */
  variant?: "drawer" | "page";
  /** Called when a link inside is followed (e.g. close the drawer) */
  onNavigate?: () => void;
};

/** One bag line: thumbnail, name, options, quantity, price (sale + crossed original), Remove. */
export function CartItem({ item, codeActive, variant = "drawer", onNavigate }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const unit = lineUnitPrice(item, codeActive);
  const discounted = unit < item.unitPrice;
  const href = `/product/${item.slug}`;
  const options = describeOptions(item.options);
  const page = variant === "page";

  const price = (
    <div className="text-right text-sm">
      <AnimatedPrice value={unit * item.quantity} className="font-medium" />
      {discounted && (
        <s className="block text-xs text-mocha/60 tabular-nums">{formatPrice(item.unitPrice * item.quantity)}</s>
      )}
    </div>
  );

  const stepper = (
    <QuantityStepper
      size="sm"
      hideLabel
      label={`Quantity for ${item.name}`}
      value={item.quantity}
      onChange={(q) => updateQuantity(item.lineId, q)}
    />
  );

  return (
    <div className={cn("grid gap-4", page ? "grid-cols-[5.5rem_1fr] sm:grid-cols-[6.5rem_1fr_auto_8rem] sm:items-center sm:gap-6" : "grid-cols-[4.5rem_1fr]")}>
      <Link
        href={href}
        onClick={onNavigate}
        tabIndex={-1}
        aria-hidden
        className="relative aspect-4/5 w-full overflow-hidden rounded-sm bg-ivory"
      >
        {item.image && <Image src={item.image} alt="" fill sizes="104px" className="object-cover" />}
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <Link href={href} onClick={onNavigate} className="font-serif text-lg leading-tight hover:underline hover:underline-offset-4">
            {item.name}
          </Link>
          {!page && price}
        </div>
        {options && <p className="mt-1 text-xs text-mocha">{options}</p>}
        {page && <p className="mt-1 text-xs text-mocha tabular-nums">{formatPrice(unit)} each</p>}

        <div className={cn("mt-auto flex items-end justify-between gap-3 pt-3", page && "sm:pt-4")}>
          <div className={cn(page && "sm:hidden")}>{stepper}</div>
          <button
            type="button"
            onClick={() => removeItem(item.lineId)}
            aria-label={`Remove ${item.name} from your bag`}
            className="text-xs text-mocha underline underline-offset-4 hover:text-espresso"
          >
            Remove
          </button>
          {page && <div className="sm:hidden">{price}</div>}
        </div>
      </div>

      {page && <div className="hidden sm:block">{stepper}</div>}
      {page && <div className="hidden sm:block">{price}</div>}
    </div>
  );
}

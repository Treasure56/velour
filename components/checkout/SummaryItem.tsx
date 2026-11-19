import Image from "next/image";
import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { formatPrice } from "@/lib/currency";

type SummaryItemProps = {
  name: string;
  image?: string;
  optionsLabel: string;
  quantity: number;
  /** Line total charged */
  price: number;
  /** Line total before the promo code, when it differs */
  originalPrice?: number;
};

/** Thumbnail with a small quantity badge, name, options and line price. Checkout + order confirmation. */
export function SummaryItem({ name, image, optionsLabel, quantity, price, originalPrice }: SummaryItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative size-16 shrink-0">
        <div className="relative size-full overflow-hidden rounded-sm border border-champagne/70 bg-cream">
          {image && <Image src={image} alt="" fill sizes="64px" className="object-cover" />}
        </div>
        <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-mocha text-[0.625rem] font-medium text-cream tabular-nums">
          <span className="sr-only">Quantity </span>
          {quantity}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg leading-tight">{name}</p>
        {optionsLabel && <p className="mt-0.5 text-xs text-mocha">{optionsLabel}</p>}
      </div>
      <div className="shrink-0 text-right text-sm">
        <AnimatedPrice value={price} />
        {originalPrice !== undefined && originalPrice !== price && (
          <s className="block text-xs text-mocha tabular-nums">{formatPrice(originalPrice)}</s>
        )}
      </div>
    </div>
  );
}

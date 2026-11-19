import { formatPrice } from "@/lib/currency";
import { getSalePrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type ProductPriceProps = {
  /** Lowest regular price */
  price: number;
  /** Live promotion discount (%), or null. Pass it from getActivePromotion() so ended sales never show. */
  discount: number | null;
  /** Prefix "From" when the product has several price points */
  from?: boolean;
  className?: string;
};

/** "From ₦xxx,xxx". On sale: the sale price in espresso, the original crossed out in mocha at 60%. */
export function ProductPrice({ price, discount, from = false, className }: ProductPriceProps) {
  const sale = getSalePrice(price, discount);
  const onSale = sale < price;

  return (
    <p className={cn("text-sm tabular-nums", className)}>
      {from && <span className="text-mocha">From </span>}
      <span className="font-medium text-espresso">{formatPrice(sale)}</span>
      {onSale && (
        <>
          <span className="sr-only">, was </span>
          <s className="ml-2 text-mocha/60">{formatPrice(price)}</s>
        </>
      )}
    </p>
  );
}

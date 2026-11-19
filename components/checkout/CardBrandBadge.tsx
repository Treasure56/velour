import { CARD_BRAND_LABEL, type CardBrand } from "@/lib/card";
import { cn } from "@/lib/utils";

/** Small text badge for a card brand (same quiet style as the footer's payment marks). */
export function CardBrandBadge({ brand, muted = false }: { brand: CardBrand; muted?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-sm border border-champagne bg-cream px-1.5 py-0.5 text-[0.5625rem] font-semibold uppercase tracking-[0.12em]",
        muted ? "text-mocha" : "text-espresso",
      )}
    >
      {CARD_BRAND_LABEL[brand]}
    </span>
  );
}

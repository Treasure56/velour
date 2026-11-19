import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductRatingProps = {
  rating: number;
  reviewCount: number;
  className?: string;
};

/** Five small stars (rounded to the nearest whole star) and the review count. */
export function ProductRating({ rating, reviewCount, className }: ProductRatingProps) {
  const filled = Math.round(rating);

  return (
    <p className={cn("flex items-center gap-1.5 text-xs text-mocha", className)}>
      <span className="sr-only">
        Rated {rating} out of 5 from {reviewCount} reviews
      </span>
      <span aria-hidden className="flex gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={12}
            strokeWidth={1.25}
            className={i < filled ? "fill-espresso stroke-espresso" : "fill-none stroke-mocha/60"}
          />
        ))}
      </span>
      <span aria-hidden className="tabular-nums">({reviewCount})</span>
    </p>
  );
}

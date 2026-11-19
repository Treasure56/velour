import { Check } from "lucide-react";
import type { ShippingMethod } from "@/data/shipping";
import { estimatedDelivery } from "@/lib/shipping";
import { cn } from "@/lib/utils";

const STAGES = ["Confirmed", "Packed", "Shipped", "Delivered"];
const dateFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "long" });

type OrderTimelineProps = {
  /** ISO date the order was placed */
  createdAt: string;
  method: ShippingMethod | null;
  className?: string;
};

/** Confirmed ✓ → Packed → Shipped → Delivered. Horizontal from sm, vertical on phones. Only "Confirmed" is active. */
export function OrderTimeline({ createdAt, method, className }: OrderTimelineProps) {
  const eta = method && estimatedDelivery(new Date(createdAt), method);

  return (
    <div className={className}>
      <h2 className="sr-only">Order progress</h2>
      <ol className="mx-auto grid w-fit gap-6 sm:w-full sm:grid-cols-4 sm:gap-0">
        {STAGES.map((stage, i) => {
          const active = i === 0;
          return (
            <li
              key={stage}
              className={cn(
                "relative flex items-center gap-4 sm:flex-col sm:gap-3",
                // Connector to the previous stage: vertical on phones, horizontal from sm.
                i > 0 &&
                  "before:absolute before:bottom-1/2 before:left-3 before:h-[calc(100%+1.5rem)] before:w-px before:bg-champagne sm:before:bottom-auto sm:before:left-auto sm:before:right-1/2 sm:before:top-3 sm:before:h-px sm:before:w-full",
              )}
            >
              <span
                className={cn(
                  "relative z-10 grid size-6 shrink-0 place-items-center rounded-full border",
                  active ? "border-espresso bg-espresso text-cream" : "border-champagne bg-cream",
                )}
              >
                {active && <Check aria-hidden size={12} strokeWidth={2} />}
              </span>
              <span
                className={cn(
                  "text-[0.6875rem] font-medium uppercase tracking-[0.18em]",
                  active ? "text-espresso" : "text-mocha/60",
                )}
              >
                {stage}
                <span className="sr-only">{active ? " (done)" : " (upcoming)"}</span>
              </span>
            </li>
          );
        })}
      </ol>
      {eta && (
        <p className="mt-8 text-center text-sm text-mocha">
          Estimated delivery: <span className="text-espresso">{dateFormat.formatRange(eta.earliest, eta.latest)}</span>
        </p>
      )}
    </div>
  );
}

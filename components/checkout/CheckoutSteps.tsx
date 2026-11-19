import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHECKOUT_STEPS, type CheckoutStep } from "@/store/checkout";

const LABELS: Record<CheckoutStep, string> = { contact: "Contact", shipping: "Shipping", payment: "Payment" };

type CheckoutStepsProps = {
  current: CheckoutStep;
  onSelect: (step: CheckoutStep) => void;
};

/**
 * Contact · Shipping · Payment. Current step in espresso, later ones in faded mocha; a thin line
 * fills as you advance. Completed steps show a ✓ and can be clicked to go back and edit.
 */
export function CheckoutSteps({ current, onSelect }: CheckoutStepsProps) {
  const currentIndex = CHECKOUT_STEPS.indexOf(current);

  return (
    <nav aria-label="Checkout progress">
      <ol className="flex items-center gap-3 text-[0.6875rem] font-medium uppercase tracking-[0.18em] sm:gap-4">
        {CHECKOUT_STEPS.map((step, i) => {
          const done = i < currentIndex;
          return (
            <Fragment key={step}>
              {i > 0 && (
                <li aria-hidden className="relative h-px max-w-20 flex-1 bg-champagne">
                  <span
                    className={cn(
                      "absolute inset-0 origin-left bg-espresso transition-transform duration-500 ease-luxe motion-reduce:transition-none",
                      i <= currentIndex ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </li>
              )}
              <li>
                {done ? (
                  <button
                    type="button"
                    onClick={() => onSelect(step)}
                    className="inline-flex min-h-11 items-center gap-1.5 uppercase text-mocha transition-colors hover:text-espresso"
                  >
                    <Check aria-hidden size={12} strokeWidth={2} />
                    {LABELS[step]}
                    <span className="sr-only"> (completed, edit)</span>
                  </button>
                ) : (
                  <span
                    aria-current={i === currentIndex ? "step" : undefined}
                    className={cn("inline-flex min-h-11 items-center", i === currentIndex ? "text-espresso" : "text-mocha/50")}
                  >
                    {LABELS[step]}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

import type { UseFormRegisterReturn } from "react-hook-form";
import type { ShippingMethod } from "@/data/shipping";
import { formatPrice } from "@/lib/currency";
import { shippingCost } from "@/lib/shipping";
import type { CartTotals } from "@/types/cart";
import { RadioCard } from "./RadioCard";

type ShippingMethodOptionsProps = {
  options: ShippingMethod[];
  selected: string;
  totals: CartTotals;
  error?: string;
  field: UseFormRegisterReturn;
};

/** Delivery method radio cards. Only the methods available for the address are offered. */
export function ShippingMethodOptions({ options, selected, totals, error, field }: ShippingMethodOptionsProps) {
  return (
    <fieldset aria-describedby={error ? "shipping-method-error" : undefined}>
      <legend className="font-serif text-xl font-light">Delivery method</legend>
      <div className="mt-4 grid gap-3">
        {options.map((method) => {
          const cost = shippingCost(method, totals);
          return (
            <RadioCard
              key={method.id}
              value={method.id}
              title={method.label}
              description={method.eta}
              aside={cost === 0 ? "Free" : formatPrice(cost)}
              selected={selected === method.id}
              {...field}
            />
          );
        })}
      </div>
      {error && (
        <p id="shipping-method-error" className="mt-2 text-xs text-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

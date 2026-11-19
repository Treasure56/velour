"use client";

import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import type { PaymentInput } from "@/lib/checkout-schema";
import { formatPrice } from "@/lib/currency";
import { instalmentPlan, type PaymentMethodId } from "@/lib/payment";
import { BankTransferDetails } from "./BankTransferDetails";
import { CardBrandBadge } from "./CardBrandBadge";
import { CardFields } from "./CardFields";
import { RadioCard } from "./RadioCard";

type PaymentMethodsProps = {
  register: UseFormRegister<PaymentInput>;
  control: Control<PaymentInput>;
  errors: FieldErrors<PaymentInput>;
  selected: PaymentMethodId | undefined;
  total: number;
};

/** Card / Bank Transfer / Pay in Instalments, each revealing its details when selected. */
export function PaymentMethods({ register, control, errors, selected, total }: PaymentMethodsProps) {
  const field = register("method");
  const plan = instalmentPlan(total);

  return (
    <fieldset>
      <legend className="sr-only">Payment method</legend>
      <div className="grid gap-3">
        <RadioCard
          value="card"
          title="Card"
          aside={
            <span className="flex gap-1">
              <CardBrandBadge brand="visa" muted />
              <CardBrandBadge brand="mastercard" muted />
              <CardBrandBadge brand="verve" muted />
            </span>
          }
          selected={selected === "card"}
          {...field}
        >
          <CardFields control={control} errors={errors} />
        </RadioCard>

        <RadioCard value="transfer" title="Bank Transfer" selected={selected === "transfer"} {...field}>
          <BankTransferDetails />
        </RadioCard>

        <RadioCard value="instalments" title="Pay in Instalments" selected={selected === "instalments"} {...field}>
          <p className="text-sm">
            Pay <strong className="font-medium tabular-nums">{formatPrice(plan.today)}</strong> today, then{" "}
            {plan.remaining} more payments of <span className="tabular-nums">{formatPrice(plan.each)}</span> every{" "}
            {plan.intervalWeeks} weeks.
          </p>
        </RadioCard>
      </div>
    </fieldset>
  );
}

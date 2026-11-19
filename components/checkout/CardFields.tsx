"use client";

import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { detectCardBrand, digitsOnly, formatCardNumber, formatExpiry } from "@/lib/card";
import type { PaymentInput } from "@/lib/checkout-schema";
import { CardBrandBadge } from "./CardBrandBadge";
import { FormField } from "./FormField";

type CardFieldsProps = {
  control: Control<PaymentInput>;
  errors: FieldErrors<PaymentInput>;
};

/**
 * DEMO card form: formatting + format checks only. The values exist only in this form's memory;
 * they are never stored, logged or sent (see lib/payment.ts).
 */
export function CardFields({ control, errors }: CardFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Controller
        control={control}
        name="cardNumber"
        render={({ field }) => {
          const brand = detectCardBrand(field.value ?? "");
          return (
            <FormField
              id="card-number"
              label="Card number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 5678 9012 3456"
              className="sm:col-span-2"
              error={errors.cardNumber?.message}
              {...field}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
              adornment={brand && <CardBrandBadge brand={brand} />}
            />
          );
        }}
      />
      <Controller
        control={control}
        name="cardExpiry"
        render={({ field }) => (
          <FormField
            id="card-expiry"
            label="Expiry (MM/YY)"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            maxLength={5}
            error={errors.cardExpiry?.message}
            {...field}
            value={field.value ?? ""}
            onChange={(e) => field.onChange(formatExpiry(e.target.value))}
          />
        )}
      />
      <Controller
        control={control}
        name="cardCvv"
        render={({ field }) => (
          <FormField
            id="card-cvv"
            label="Security code (CVV)"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            error={errors.cardCvv?.message}
            {...field}
            value={field.value ?? ""}
            onChange={(e) => field.onChange(digitsOnly(e.target.value).slice(0, 4))}
          />
        )}
      />
      <Controller
        control={control}
        name="cardName"
        render={({ field }) => (
          <FormField
            id="card-name"
            label="Name on card"
            autoComplete="cc-name"
            className="sm:col-span-2"
            error={errors.cardName?.message}
            {...field}
            value={field.value ?? ""}
          />
        )}
      />
    </div>
  );
}

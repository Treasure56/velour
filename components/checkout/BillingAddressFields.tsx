import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { countries } from "@/data/shipping";
import type { PaymentInput } from "@/lib/checkout-schema";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";

type BillingAddressFieldsProps = {
  register: UseFormRegister<PaymentInput>;
  errors: FieldErrors<PaymentInput>;
};

/** Shown only when "Same as shipping address" is unticked. */
export function BillingAddressFields({ register, errors }: BillingAddressFieldsProps) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <FormField
        id="bill-address"
        label="Billing address"
        autoComplete="billing address-line1"
        className="sm:col-span-2"
        error={errors.billingAddress?.message}
        {...register("billingAddress")}
      />
      <FormField
        id="bill-city"
        label="City"
        autoComplete="billing address-level2"
        error={errors.billingCity?.message}
        {...register("billingCity")}
      />
      <SelectField
        id="bill-country"
        label="Country"
        options={countries}
        autoComplete="billing country-name"
        error={errors.billingCountry?.message}
        {...register("billingCountry")}
      />
    </div>
  );
}

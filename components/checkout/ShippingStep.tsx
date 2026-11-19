"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";
import { countries, HOME_COUNTRY, nigerianStates } from "@/data/shipping";
import { shippingSchema, type ShippingInput, type ShippingValues } from "@/lib/checkout-schema";
import { availableShippingMethods } from "@/lib/shipping";
import { useCheckoutStore } from "@/store/checkout";
import type { CartTotals } from "@/types/cart";
import { FormField } from "./FormField";
import { SelectField } from "./SelectField";
import { ShippingMethodOptions } from "./ShippingMethodOptions";
import { StepHeading } from "./StepHeading";
import { StepReview } from "./StepReview";
import { StepSubmit } from "./StepSubmit";
import { TextareaField } from "./TextareaField";

/** Step 2: delivery address + delivery method (options depend on country and state). */
export function ShippingStep({ totals }: { totals: CartTotals }) {
  const { contact, shipping, shippingMethod, saveShipping, setShippingMethod, goTo } = useCheckoutStore(
    useShallow((s) => ({
      contact: s.contact,
      shipping: s.shipping,
      shippingMethod: s.shippingMethod,
      saveShipping: s.saveShipping,
      setShippingMethod: s.setShippingMethod,
      goTo: s.goTo,
    })),
  );
  const { register, handleSubmit, control, getValues, setValue, formState: { errors } } = useForm<
    ShippingInput,
    unknown,
    ShippingValues
  >({
    resolver: zodResolver(shippingSchema),
    mode: "onTouched",
    defaultValues: shipping ?? {
      country: HOME_COUNTRY,
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      notes: "",
      method: shippingMethod ?? "",
    },
  });
  const [country, state, method] = useWatch({ control, name: ["country", "state", "method"] });
  const options = availableShippingMethods(country, state);
  const isNigeria = country === HOME_COUNTRY;

  // Clear a chosen method that no longer applies (e.g. the state changed away from Lagos).
  const syncMethod = (nextCountry: string, nextState: string) => {
    const current = getValues("method");
    if (current && !availableShippingMethods(nextCountry, nextState).some((m) => m.id === current)) {
      setValue("method", "");
      setShippingMethod(null);
    }
  };

  const err = (name: keyof ShippingInput) => errors[name]?.message;

  return (
    <form onSubmit={handleSubmit(saveShipping)} method="post" noValidate>
      {contact && (
        <StepReview rows={[{ label: "Contact", value: `${contact.email} · ${contact.phone}`, onEdit: () => goTo("contact") }]} />
      )}
      <div className="mt-8">
        <StepHeading>Shipping address</StepHeading>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <SelectField
          id="ship-country"
          label="Country"
          options={countries}
          autoComplete="country-name"
          className="sm:col-span-2"
          {...register("country", {
            onChange: (e) => {
              setValue("state", "");
              syncMethod(e.target.value, "");
            },
          })}
        />
        <FormField id="ship-first" label="First name" autoComplete="given-name" error={err("firstName")} {...register("firstName")} />
        <FormField id="ship-last" label="Last name" autoComplete="family-name" error={err("lastName")} {...register("lastName")} />
        <FormField id="ship-address" label="Address" autoComplete="address-line1" className="sm:col-span-2" error={err("address")} {...register("address")} />
        <FormField id="ship-apartment" label="Apartment, suite, etc." optional autoComplete="address-line2" className="sm:col-span-2" {...register("apartment")} />
        <FormField id="ship-city" label="City" autoComplete="address-level2" error={err("city")} {...register("city")} />
        {isNigeria ? (
          <SelectField
            key="state-select"
            id="ship-state"
            label="State"
            options={nigerianStates}
            placeholder="Select state"
            autoComplete="address-level1"
            error={err("state")}
            {...register("state", { onChange: (e) => syncMethod(getValues("country"), e.target.value) })}
          />
        ) : (
          <FormField key="state-text" id="ship-state" label="State / Region" optional autoComplete="address-level1" {...register("state")} />
        )}
        <TextareaField
          id="ship-notes"
          label="Delivery notes"
          optional
          placeholder="Gate code, landmark, best time to deliver…"
          className="sm:col-span-2"
          error={err("notes")}
          {...register("notes")}
        />
      </div>

      <div className="mt-10">
        <ShippingMethodOptions
          options={options}
          selected={method}
          totals={totals}
          error={err("method")}
          field={register("method", { onChange: (e) => setShippingMethod(e.target.value) })}
        />
      </div>
      <StepSubmit>Continue to Payment</StepSubmit>
    </form>
  );
}

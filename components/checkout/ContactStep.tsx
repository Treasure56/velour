"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput, type ContactValues } from "@/lib/checkout-schema";
import { useCheckoutStore } from "@/store/checkout";
import { CheckboxField } from "./CheckboxField";
import { FormField } from "./FormField";
import { StepHeading } from "./StepHeading";
import { StepSubmit } from "./StepSubmit";

/** Step 1: email, phone (Nigerian or international) and the marketing opt-in. */
export function ContactStep() {
  const contact = useCheckoutStore((s) => s.contact);
  const saveContact = useCheckoutStore((s) => s.saveContact);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: contact ?? { email: "", phone: "", marketing: false },
  });

  return (
    <form onSubmit={handleSubmit(saveContact)} method="post" noValidate>
      <StepHeading>Contact</StepHeading>
      <div className="mt-6 grid gap-5">
        <FormField
          id="checkout-email"
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="checkout-phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+234 803 123 4567"
          hint="For delivery updates only."
          error={errors.phone?.message}
          {...register("phone")}
        />
        <CheckboxField label="Email me about new drops and offers" {...register("marketing")} />
      </div>
      <StepSubmit>Continue to Shipping</StepSubmit>
    </form>
  );
}

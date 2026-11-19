"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { detectCardBrand, lastFour } from "@/lib/card";
import { paymentSchema, type PaymentInput, type PaymentValues } from "@/lib/checkout-schema";
import { formatPrice } from "@/lib/currency";
import { buildOrder, createOrderNumber, saveOrder } from "@/lib/order";
import { processPayment } from "@/lib/payment";
import { getShippingMethod } from "@/lib/shipping";
import { useCheckoutStore } from "@/store/checkout";
import type { CartItem, CartTotals } from "@/types/cart";
import type { Order } from "@/types/order";
import { BillingAddressFields } from "./BillingAddressFields";
import { CheckboxField } from "./CheckboxField";
import { PayButton } from "./PayButton";
import { PaymentMethods } from "./PaymentMethods";
import { StepHeading } from "./StepHeading";
import { StepReview } from "./StepReview";

type PaymentStepProps = {
  items: CartItem[];
  /** Checkout totals, shipping included */
  totals: CartTotals;
};

/**
 * Step 3 (DEMO). Card values stay in this form's memory only (shouldUnregister drops them when
 * another method is chosen); after the mock payment only the order summary is saved.
 */
export function PaymentStep({ items, totals }: PaymentStepProps) {
  const router = useRouter();
  const { contact, shipping, goTo } = useCheckoutStore(
    useShallow((s) => ({ contact: s.contact, shipping: s.shipping, goTo: s.goTo })),
  );
  const [processing, setProcessing] = useState(false);
  const [failure, setFailure] = useState("");
  const { register, control, handleSubmit, formState: { errors } } = useForm<PaymentInput, unknown, PaymentValues>({
    resolver: zodResolver(paymentSchema),
    mode: "onTouched",
    shouldUnregister: true,
    defaultValues: { method: "card", billingSame: true },
  });
  const [method, billingSame] = useWatch({ control, name: ["method", "billingSame"] });

  if (!contact || !shipping) return null;
  const shippingMethod = getShippingMethod(shipping.method);

  const onSubmit = async (values: PaymentValues) => {
    setFailure("");
    setProcessing(true);
    const number = createOrderNumber();
    const result = await processPayment({ method: values.method, amount: totals.total, email: contact.email, reference: number });
    if (!result.ok) {
      setFailure(result.error);
      setProcessing(false);
      return;
    }
    // Keep only the brand and last four digits for display. Nothing else from the card is kept.
    const payment: Order["payment"] =
      values.method === "card"
        ? { method: "card", brand: detectCardBrand(values.cardNumber ?? ""), last4: lastFour(values.cardNumber ?? "") }
        : { method: values.method };
    saveOrder(buildOrder({ number, createdAt: new Date(), contact, shipping, items, totals, payment }));
    router.push("/order/success");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} method="post" noValidate>
      <StepReview
        rows={[
          { label: "Contact", value: contact.email, onEdit: () => goTo("contact") },
          {
            label: "Ship to",
            value: [shipping.address, shipping.city, shipping.state, shipping.country].filter(Boolean).join(", "),
            onEdit: () => goTo("shipping"),
          },
          {
            label: "Method",
            value: shippingMethod && `${shippingMethod.label} · ${totals.shipping ? formatPrice(totals.shipping) : "Free"}`,
            onEdit: () => goTo("shipping"),
          },
        ]}
      />
      <div className="mb-6 mt-8">
        <StepHeading>Payment</StepHeading>
        <p className="mt-1 text-xs text-mocha">Demo checkout: no real payment is taken and card details are never saved.</p>
      </div>

      <PaymentMethods register={register} control={control} errors={errors} selected={method} total={totals.total} />

      <div className="mt-8">
        <p className="font-serif text-xl font-light">Billing address</p>
        <CheckboxField label="Same as shipping address" {...register("billingSame")} />
        {!billingSame && <BillingAddressFields register={register} errors={errors} />}
      </div>

      {failure && (
        <p role="alert" className="mt-6 text-sm text-error">
          {failure}
        </p>
      )}
      <PayButton total={totals.total} processing={processing} />
      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-mocha">
        <Lock aria-hidden size={12} strokeWidth={1.5} />
        Encrypted &amp; secure <span aria-hidden>·</span> 7-day easy returns
      </p>
    </form>
  );
}

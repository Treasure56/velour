import { instalments } from "@/data/payment";

export type PaymentMethodId = "card" | "transfer" | "instalments";

export const PAYMENT_METHOD_LABEL: Record<PaymentMethodId, string> = {
  card: "Card",
  transfer: "Bank transfer",
  instalments: "Pay in instalments",
};

export type PaymentRequest = {
  method: PaymentMethodId;
  /** Naira, whole units */
  amount: number;
  email: string;
  /** Our order number, used as the provider's transaction reference */
  reference: string;
};

export type PaymentResult = { ok: true; reference: string } | { ok: false; error: string };

/**
 * The ONE place a real payment provider plugs in.
 *
 * DEMO: waits ~2s and always succeeds. No card data is accepted here on purpose: with a provider
 * such as Paystack, card details are typed into the provider's own secure popup/iframe and never
 * touch this site. To go live, replace the body with e.g. Paystack Inline:
 *   new PaystackPop().newTransaction({ key, email, amount: amount * 100, currency: "NGN", reference,
 *     onSuccess: (t) => resolve({ ok: true, reference: t.reference }), onCancel: () => resolve({ ok: false, ... }) })
 * and verify the transaction server-side (Route Handler with the secret key) before fulfilling.
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return { ok: true, reference: request.reference };
}

/** Split a total into `count` payments: equal whole-Naira parts, any remainder paid today. */
export function instalmentPlan(total: number, count = instalments.count) {
  const each = Math.floor(total / count);
  return { today: total - each * (count - 1), each, remaining: count - 1, intervalWeeks: instalments.intervalWeeks };
}

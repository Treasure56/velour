import { z } from "zod";
import { countries, HOME_COUNTRY, nigerianStates } from "@/data/shipping";
import { isCardNumberValid, isCvvValid, isExpiryValid } from "@/lib/card";
import { availableShippingMethods } from "@/lib/shipping";

const required = (message: string) => z.string().trim().min(1, message);

// ── Phone ───────────────────────────────────────────────────────────────────
const compact = (value: string) => value.replace(/[\s\-().]/g, "");
const NIGERIAN = /^(?:\+?234|0)([789][01]\d{8})$/;
const INTERNATIONAL = /^\+\d{8,15}$/;

/** Nigerian mobile (0803…, 234803…, +234 803…) or any international number starting with +. */
export const isValidPhone = (value: string) => NIGERIAN.test(compact(value)) || INTERNATIONAL.test(compact(value));

/** Nigerian numbers are stored as "+234 803 123 4567"; others as typed (trimmed). */
export function formatPhone(value: string) {
  const match = NIGERIAN.exec(compact(value));
  if (!match) return value.trim();
  const n = match[1];
  return `+234 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
}

// ── Step 1: Contact ─────────────────────────────────────────────────────────
export const contactSchema = z.object({
  email: required("Enter your email address").regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email, e.g. ada@example.com"),
  phone: required("Enter your phone number")
    .refine(isValidPhone, "Enter a valid phone number, e.g. +234 803 123 4567")
    .transform(formatPhone),
  marketing: z.boolean(),
});
export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;

// ── Step 2: Shipping ────────────────────────────────────────────────────────
export const shippingSchema = z
  .object({
    country: z.enum(countries),
    firstName: required("Enter your first name"),
    lastName: required("Enter your last name"),
    address: required("Enter your street address"),
    apartment: z.string().trim(),
    city: required("Enter your city"),
    state: z.string().trim(),
    notes: z.string().trim().max(300, "Please keep notes under 300 characters"),
    // Input is a string so the radios can start empty (""); output is a known method id.
    method: z.string().pipe(z.enum(["lagos-express", "nationwide-standard", "international-dhl"], "Choose a delivery method")),
  })
  .superRefine((v, ctx) => {
    if (v.country === HOME_COUNTRY && !(nigerianStates as readonly string[]).includes(v.state)) {
      ctx.addIssue({ code: "custom", path: ["state"], message: "Choose your state" });
    }
    if (!availableShippingMethods(v.country, v.state).some((m) => m.id === v.method)) {
      ctx.addIssue({ code: "custom", path: ["method"], message: "Choose a delivery method" });
    }
  });
export type ShippingInput = z.input<typeof shippingSchema>;
export type ShippingValues = z.output<typeof shippingSchema>;

// ── Step 3: Payment (DEMO: format checks only; values live in form memory, never saved) ──
export const paymentSchema = z
  .object({
    method: z.enum(["card", "transfer", "instalments"], "Choose a payment method"),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    cardName: z.string().optional(),
    billingSame: z.boolean(),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingCountry: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    const issue = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (v.method === "card") {
      if (!isCardNumberValid(v.cardNumber ?? "")) issue("cardNumber", "Enter a valid card number");
      if (!isExpiryValid(v.cardExpiry ?? "", new Date())) issue("cardExpiry", "Enter a valid expiry date (MM/YY)");
      if (!isCvvValid(v.cardCvv ?? "")) issue("cardCvv", "Enter the 3 or 4 digit security code");
      if (!v.cardName?.trim()) issue("cardName", "Enter the name on the card");
    }
    if (!v.billingSame) {
      if (!v.billingAddress?.trim()) issue("billingAddress", "Enter your billing address");
      if (!v.billingCity?.trim()) issue("billingCity", "Enter your billing city");
      if (!v.billingCountry?.trim()) issue("billingCountry", "Choose your billing country");
    }
  });
export type PaymentInput = z.input<typeof paymentSchema>;
export type PaymentValues = z.output<typeof paymentSchema>;

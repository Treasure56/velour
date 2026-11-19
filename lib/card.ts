/**
 * Card input helpers for the DEMO payment form. Format checks only: card values are never stored,
 * logged or sent anywhere. A real provider (see lib/payment.ts) collects card details itself.
 */

export type CardBrand = "visa" | "mastercard" | "verve";

export const CARD_BRAND_LABEL: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  verve: "Verve",
};

export const digitsOnly = (value: string) => value.replace(/\D/g, "");

/** Verve is checked first: some Verve ranges start with 5 like Mastercard. */
export function detectCardBrand(value: string): CardBrand | null {
  const d = digitsOnly(value);
  if (/^(5060|5061|5078|5079|6500)/.test(d)) return "verve";
  if (/^4/.test(d)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(d)) return "mastercard";
  return null;
}

/** "4242424242424242" → "4242 4242 4242 4242" (max 19 digits). */
export const formatCardNumber = (value: string) =>
  digitsOnly(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

export const isCardNumberValid = (value: string) => {
  const d = digitsOnly(value);
  return d.length >= 16 && d.length <= 19;
};

/** "0127" → "01/27"; a single digit above 1 becomes "0x/". */
export function formatExpiry(value: string) {
  let d = digitsOnly(value).slice(0, 4);
  if (/^[2-9]$/.test(d)) d = `0${d}`;
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/** MM/YY with a real month, not before the current month. */
export function isExpiryValid(value: string, now: Date) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export const isCvvValid = (value: string) => /^\d{3,4}$/.test(value.trim());

export const lastFour = (value: string) => digitsOnly(value).slice(-4);

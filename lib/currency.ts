/**
 * Single currency config. Change code/locale here to switch the whole site.
 */
export const currency = {
  code: "NGN",
  locale: "en-NG",
} as const;

const formatter = new Intl.NumberFormat(currency.locale, {
  style: "currency",
  currency: currency.code,
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 0,
});

/** Format a whole-unit amount, e.g. formatPrice(250000) → "₦250,000" */
export function formatPrice(amount: number) {
  return formatter.format(amount);
}

/**
 * Current sale. Change the details here, or set `active: false` to switch it off.
 * The banner (and the announcement-bar message) also disappear by themselves after `endDate`.
 * The campaign image lives here too, so the whole sale is edited in one place.
 */
export const holidayPromotion = {
  active: true,
  eyebrow: "The Christmas edit",
  headline: {
    first: "Gift yourself",
    second: "something",
    emphasis: "luxurious.",
  },
  subtext: "15% off all bundles, wigs and closures. This Christmas only.",
  discount: 15,
  /** Product categories the discount applies to (hair care is excluded). */
  categories: ["wigs", "bundles", "closures"],
  code: "VELOURXMAS",
  endDate: "2026-12-26T23:59:59+01:00",
  ctaLabel: "Shop the Sale",
  ctaLink: "/shop?sale=1",
  /** First message in the announcement bar while the sale is live. */
  announcement: "Christmas sale — 15% off with code VELOURXMAS",
  image: {
    src: "/media/holiday/holiday-banner.jpg",
    width: 1671,
    height: 941,
    alt: "Two models with long straight and wavy hair holding cream Velour bags, one tied with a satin bow",
  },
} as const;

export type Promotion = typeof holidayPromotion;

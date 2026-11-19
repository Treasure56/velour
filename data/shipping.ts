/** Delivery settings. Amounts in Naira. */
export const shippingConfig = {
  /** Orders at or above this (after discounts) ship free. */
  freeShippingThreshold: 300_000,
};

export type ShippingMethodId = "lagos-express" | "nationwide-standard" | "international-dhl";

export type ShippingMethod = {
  id: ShippingMethodId;
  label: string;
  eta: string;
  price: number;
  /** Free when the order reaches `freeShippingThreshold` */
  freeOverThreshold: boolean;
  /** Delivery window used for the estimated date on the confirmation page */
  deliveryDays: readonly [min: number, max: number];
  /** Count only Monday to Friday */
  workingDays: boolean;
};

export const shippingMethods: readonly ShippingMethod[] = [
  {
    id: "lagos-express",
    label: "Lagos Express",
    eta: "24–48 hours",
    price: 5_000,
    freeOverThreshold: true,
    deliveryDays: [1, 2],
    workingDays: false,
  },
  {
    id: "nationwide-standard",
    label: "Nationwide Standard",
    eta: "3–5 working days",
    price: 8_000,
    freeOverThreshold: true,
    deliveryDays: [3, 5],
    workingDays: true,
  },
  {
    id: "international-dhl",
    label: "International DHL",
    eta: "5–10 working days",
    price: 45_000,
    freeOverThreshold: false,
    deliveryDays: [5, 10],
    workingDays: true,
  },
];

export const HOME_COUNTRY = "Nigeria";

/** Countries we deliver to (Nigeria first, the default). */
export const countries = ["Nigeria", "Ghana", "United Kingdom", "United States", "Canada"] as const;
export type Country = (typeof countries)[number];

/** The 36 states + FCT, alphabetical. */
export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna",
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
] as const;

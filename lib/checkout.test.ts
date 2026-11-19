import { describe, expect, it } from "vitest";
import { shippingMethods } from "@/data/shipping";
import { cartTotals } from "@/lib/cart";
import { detectCardBrand, formatCardNumber, formatExpiry, isExpiryValid, lastFour } from "@/lib/card";
import { contactSchema, formatPhone, isValidPhone, shippingSchema } from "@/lib/checkout-schema";
import { instalmentPlan } from "@/lib/payment";
import { availableShippingMethods, checkoutTotals, estimatedDelivery } from "@/lib/shipping";
import type { CartItem } from "@/types/cart";

const NOW = Date.parse("2026-11-19T12:00:00+01:00");
const line = (unitPrice: number, quantity = 1, category: CartItem["category"] = "wigs"): CartItem => ({
  lineId: `x|${unitPrice}`,
  productId: "x",
  slug: "x",
  name: "X",
  category,
  options: {},
  unitPrice,
  salePrice: null,
  quantity,
});
const ids = (country: string, state: string) => availableShippingMethods(country, state).map((m) => m.id);

describe("shipping methods", () => {
  it("offers Lagos Express only in Lagos, DHL only abroad", () => {
    expect(ids("Nigeria", "Lagos")).toEqual(["lagos-express", "nationwide-standard"]);
    expect(ids("Nigeria", "Oyo")).toEqual(["nationwide-standard"]);
    expect(ids("Ghana", "")).toEqual(["international-dhl"]);
  });

  it("adds the method price to the total, free for local methods over the threshold", () => {
    const small = cartTotals([line(100_000)], null, NOW);
    expect(checkoutTotals(small, null)).toMatchObject({ shipping: null, total: 100_000 });
    expect(checkoutTotals(small, "lagos-express")).toMatchObject({ shipping: 5_000, total: 105_000 });

    const big = cartTotals([line(400_000)], null, NOW);
    expect(checkoutTotals(big, "nationwide-standard")).toMatchObject({ shipping: 0, total: 400_000 });
    expect(checkoutTotals(big, "international-dhl")).toMatchObject({ shipping: 45_000, total: 445_000 });
  });

  it("estimates delivery in working days where the method says so", () => {
    const nationwide = shippingMethods.find((m) => m.id === "nationwide-standard")!;
    // Thursday 19 Nov + 3–5 working days → Tue 24 – Thu 26 Nov
    const { earliest, latest } = estimatedDelivery(new Date(2026, 10, 19), nationwide);
    expect([earliest.getDate(), latest.getDate()]).toEqual([24, 26]);
  });
});

describe("payment helpers", () => {
  it("splits instalments into whole Naira, remainder today", () => {
    expect(instalmentPlan(1_000_001)).toEqual({ today: 250_001, each: 250_000, remaining: 3, intervalWeeks: 2 });
  });

  it("formats and recognises cards", () => {
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
    expect(detectCardBrand("4242")).toBe("visa");
    expect(detectCardBrand("5399 1234")).toBe("mastercard");
    expect(detectCardBrand("5061 2345")).toBe("verve");
    expect(detectCardBrand("9999")).toBeNull();
    expect(lastFour("4242 4242 4242 4242")).toBe("4242");
  });

  it("formats and checks expiry dates", () => {
    expect(formatExpiry("1228")).toBe("12/28");
    expect(formatExpiry("4")).toBe("04");
    const now = new Date(2026, 10, 19);
    expect(isExpiryValid("11/26", now)).toBe(true);
    expect(isExpiryValid("10/26", now)).toBe(false);
    expect(isExpiryValid("13/30", now)).toBe(false);
  });
});

describe("checkout validation", () => {
  it("accepts Nigerian and international phone numbers and normalises Nigerian ones", () => {
    expect(isValidPhone("0803 123 4567")).toBe(true);
    expect(isValidPhone("+2348031234567")).toBe(true);
    expect(isValidPhone("+44 7700 900123")).toBe(true);
    expect(isValidPhone("12345")).toBe(false);
    expect(formatPhone("08031234567")).toBe("+234 803 123 4567");
  });

  it("parses contact details", () => {
    const parsed = contactSchema.safeParse({ email: " ada@example.com ", phone: "08031234567", marketing: false });
    expect(parsed.success && parsed.data).toEqual({ email: "ada@example.com", phone: "+234 803 123 4567", marketing: false });
    expect(contactSchema.safeParse({ email: "ada@", phone: "080", marketing: false }).success).toBe(false);
  });

  it("requires a Nigerian state and an available delivery method", () => {
    const base = { country: "Nigeria", firstName: "Ada", lastName: "Obi", address: "1 Admiralty Way", apartment: "", city: "Lekki", notes: "" } as const;
    expect(shippingSchema.safeParse({ ...base, state: "Lagos", method: "lagos-express" }).success).toBe(true);
    expect(shippingSchema.safeParse({ ...base, state: "Oyo", method: "lagos-express" }).success).toBe(false);
    expect(shippingSchema.safeParse({ ...base, state: "", method: "nationwide-standard" }).success).toBe(false);
    expect(shippingSchema.safeParse({ ...base, country: "Ghana", state: "", method: "international-dhl" }).success).toBe(true);
  });
});

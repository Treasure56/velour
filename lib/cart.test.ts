import { describe, expect, it } from "vitest";
import { holidayPromotion } from "@/data/promotions";
import { shippingConfig } from "@/data/shipping";
import { cartTotals, clampQty, makeLineId, validatePromoCode } from "@/lib/cart";
import type { CartItem } from "@/types/cart";

const LIVE = Date.parse(holidayPromotion.endDate) - 86_400_000; // a day before the sale ends
const ENDED = Date.parse(holidayPromotion.endDate) + 1;
const CODE = holidayPromotion.code;
const PCT = holidayPromotion.discount;

const line = (over: Partial<CartItem>): CartItem => ({
  lineId: "x",
  productId: "p-001",
  slug: "s",
  name: "Wig",
  category: "wigs",
  options: {},
  unitPrice: 100_000,
  salePrice: null,
  quantity: 1,
  ...over,
});

describe("makeLineId", () => {
  it("is the same for the same product and options", () => {
    const a = makeLineId({ productId: "p-001", options: { length: 22, density: "180%" } });
    const b = makeLineId({ productId: "p-001", options: { length: 22, density: "180%", laceType: "13x4" } });
    expect(a).toBe(b);
  });
  it("differs when an option differs", () => {
    expect(makeLineId({ productId: "p-001", options: { length: 22 } })).not.toBe(
      makeLineId({ productId: "p-001", options: { length: 24 } }),
    );
  });
});

describe("clampQty", () => {
  it("keeps quantity between 1 and 10", () => {
    expect(clampQty(0)).toBe(1);
    expect(clampQty(4)).toBe(4);
    expect(clampQty(25)).toBe(10);
  });
});

describe("validatePromoCode", () => {
  it("accepts the configured code, case-insensitively", () => {
    expect(validatePromoCode(` ${CODE.toLowerCase()} `, LIVE)).toEqual({ ok: true, code: CODE });
  });
  it("rejects unknown codes", () => {
    expect(validatePromoCode("NOPE", LIVE).ok).toBe(false);
  });
  it("rejects the code once the promotion has ended", () => {
    expect(validatePromoCode(CODE, ENDED).ok).toBe(false);
  });
});

describe("cartTotals", () => {
  it("sums count and subtotal", () => {
    const t = cartTotals([line({ quantity: 2 }), line({ unitPrice: 50_000 })], null, LIVE);
    expect(t.itemCount).toBe(3);
    expect(t.subtotal).toBe(250_000);
    expect(t.discount).toBe(0);
    expect(t.total).toBe(250_000);
  });

  it("applies the promo percentage only to eligible categories when the code is applied", () => {
    const t = cartTotals([line({ unitPrice: 200_000 }), line({ category: "hair-care", unitPrice: 20_000 })], CODE, LIVE);
    expect(t.codeActive).toBe(true);
    expect(t.discount).toBe((200_000 * PCT) / 100);
    expect(t.total).toBe(220_000 - (200_000 * PCT) / 100);
  });

  it("ignores the code after the promotion ends", () => {
    const t = cartTotals([line({ unitPrice: 200_000 })], CODE, ENDED);
    expect(t.codeActive).toBe(false);
    expect(t.discount).toBe(0);
  });

  it("ships free at the threshold (after discount) and reports what's left otherwise", () => {
    const under = cartTotals([line({ unitPrice: 255_000 })], null, LIVE);
    expect(under.shipping).toBeNull();
    expect(under.amountToFreeShipping).toBe(shippingConfig.freeShippingThreshold - 255_000);

    const over = cartTotals([line({ unitPrice: shippingConfig.freeShippingThreshold })], null, LIVE);
    expect(over.shipping).toBe(0);
    expect(over.amountToFreeShipping).toBe(0);
  });

  it("an empty cart has no free shipping", () => {
    expect(cartTotals([], null, LIVE).shipping).toBeNull();
  });
});

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BankTransferDetails } from "@/components/checkout/BankTransferDetails";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useOrder } from "@/hooks/useOrder";
import { saveOrder } from "@/lib/order";
import { getShippingMethod } from "@/lib/shipping";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkout";
import { BagAnimation } from "./BagAnimation";
import { OrderDetails } from "./OrderDetails";
import { OrderTimeline } from "./OrderTimeline";

/**
 * /order/success. Reads the order summary saved after payment; with no order it sends the shopper
 * to /shop. On first view it empties the bag and the checkout progress (once per order).
 */
export function OrderConfirmation() {
  const router = useRouter();
  const { ready, order } = useOrder();

  useEffect(() => {
    if (ready && !order) router.replace("/shop");
  }, [ready, order, router]);

  useEffect(() => {
    if (!order || order.cartCleared) return;
    let cancelled = false;
    // Load both stores first so a late rehydration can't bring the old bag back.
    void Promise.all([useCartStore.persist.rehydrate(), useCheckoutStore.persist.rehydrate()]).then(() => {
      if (cancelled) return;
      useCartStore.getState().clearCart();
      useCheckoutStore.getState().reset();
      saveOrder({ ...order, cartCleared: true });
    });
    return () => {
      cancelled = true;
    };
  }, [order]);

  if (!order) return <div aria-hidden className="min-h-[80dvh]" />;

  return (
    <Container size="narrow" className="pb-24 pt-32 lg:pt-40">
      <div className="mx-auto max-w-2xl text-center">
        <BagAnimation className="mx-auto" />
        <h1 className="mt-8 font-serif text-[clamp(2.5rem,5vw,4rem)] font-light leading-[1.05]">
          Your hair is on its <em className="italic">way.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-mocha">
          Thank you, {order.address.firstName}. Your order <span className="font-medium text-espresso">{order.number}</span>{" "}
          is confirmed. We’ve sent the details to <span className="text-espresso">{order.email}</span>.
        </p>
      </div>

      <OrderTimeline createdAt={order.createdAt} method={getShippingMethod(order.shippingMethod)} className="mx-auto mt-14 max-w-2xl" />

      {order.payment.method === "transfer" && (
        <section aria-labelledby="transfer-title" className="mx-auto mt-12 max-w-2xl border border-champagne bg-ivory p-6 sm:p-8">
          <h2 id="transfer-title" className="font-serif text-2xl font-light">
            Complete your transfer
          </h2>
          <BankTransferDetails reference={order.number} className="mt-4" />
        </section>
      )}

      <OrderDetails order={order} className="mx-auto mt-8 max-w-2xl" />

      <div className="mt-12 flex flex-col items-center gap-5">
        <Button href="/shop">Continue Shopping</Button>
        <Link href="/" className="inline-flex min-h-11 items-center text-xs underline underline-offset-4 hover:text-mocha">
          Back to Home
        </Link>
      </div>
    </Container>
  );
}

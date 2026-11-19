import type { ReactNode } from "react";
import { CartSummary } from "@/components/cart/CartSummary";
import { SummaryItem } from "@/components/checkout/SummaryItem";
import { CARD_BRAND_LABEL } from "@/lib/card";
import { PAYMENT_METHOD_LABEL } from "@/lib/payment";
import { getShippingMethod } from "@/lib/shipping";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/order";

function Detail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-sans text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-mocha">{title}</h3>
      <div className="mt-2 leading-relaxed">{children}</div>
    </div>
  );
}

/** Ivory card: items, delivery address, shipping method, payment (card as "•••• 4242" only), totals. */
export function OrderDetails({ order, className }: { order: Order; className?: string }) {
  const { address, payment } = order;
  const method = getShippingMethod(order.shippingMethod);
  const paymentLabel =
    payment.method === "card" && payment.last4
      ? `${payment.brand ? CARD_BRAND_LABEL[payment.brand] : "Card"} •••• ${payment.last4}`
      : PAYMENT_METHOD_LABEL[payment.method];

  return (
    <section aria-labelledby="order-details-title" className={cn("border border-champagne bg-ivory p-6 text-left sm:p-8", className)}>
      <h2 id="order-details-title" className="font-serif text-2xl font-light">
        Order details
      </h2>
      <ul className="mt-6 grid gap-5">
        {order.items.map((item) => (
          <li key={item.lineId}>
            <SummaryItem
              name={item.name}
              image={item.image}
              optionsLabel={item.optionsLabel}
              quantity={item.quantity}
              price={item.price * item.quantity}
              originalPrice={item.unitPrice * item.quantity}
            />
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-6 border-t border-champagne pt-6 text-sm sm:grid-cols-3">
        <Detail title="Delivery address">
          {address.firstName} {address.lastName}
          <br />
          {address.address}
          {address.apartment && `, ${address.apartment}`}
          <br />
          {[address.city, address.state].filter(Boolean).join(", ")}
          <br />
          {address.country}
        </Detail>
        {method && (
          <Detail title="Shipping method">
            {method.label}
            <br />
            <span className="text-mocha">{method.eta}</span>
          </Detail>
        )}
        <Detail title="Payment">{paymentLabel}</Detail>
      </div>

      <div className="mt-8 border-t border-champagne pt-6">
        <CartSummary totals={order.totals} />
      </div>
    </section>
  );
}

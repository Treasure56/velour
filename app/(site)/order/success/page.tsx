import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage() {
  return <OrderConfirmation />;
}

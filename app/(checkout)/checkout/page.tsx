import type { Metadata } from "next";
import { CheckoutLayout } from "@/components/checkout";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutLayout />;
}

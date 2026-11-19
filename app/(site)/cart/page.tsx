import type { Metadata } from "next";
import { CartPageView } from "@/components/cart";
import { CartRecommendations } from "@/components/cart/CartRecommendations";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <CartPageView />
      <CartRecommendations />
    </>
  );
}

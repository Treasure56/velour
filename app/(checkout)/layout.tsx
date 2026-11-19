import { CheckoutFooter, CheckoutHeader } from "@/components/checkout";

/** Checkout chrome: no announcement bar, navbar or full footer. */
export default function CheckoutGroupLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <CheckoutHeader />
      <main id="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <CheckoutFooter />
    </div>
  );
}

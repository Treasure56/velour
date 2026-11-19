"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useLenis } from "@/components/layout/SmoothScroll";
import { EASE } from "@/lib/motion";
import { checkoutTotals } from "@/lib/shipping";
import { useCheckoutStore, type CheckoutStep } from "@/store/checkout";
import type { CartItem, CartTotals } from "@/types/cart";
import { CheckoutSteps } from "./CheckoutSteps";
import { ContactStep } from "./ContactStep";
import { PaymentStep } from "./PaymentStep";
import { ShippingStep } from "./ShippingStep";

type CheckoutFlowProps = {
  step: CheckoutStep;
  items: CartItem[];
  /** Cart totals before shipping */
  cartTotals: CartTotals;
};

/** Step indicator + the current step, with a soft fade/slide between steps. */
export function CheckoutFlow({ step, items, cartTotals }: CheckoutFlowProps) {
  const goTo = useCheckoutStore((s) => s.goTo);
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);
  const lenis = useLenis();
  const ref = useRef<HTMLDivElement>(null);

  // After a step change: bring the form top back into view and move focus to the new step's heading.
  const onExitComplete = () => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top < 0) {
      if (lenis) lenis.scrollTo(el, { offset: -24, duration: 0.8 });
      else el.scrollIntoView({ block: "start" });
    }
    window.setTimeout(() => el.querySelector<HTMLElement>("[data-step-heading]")?.focus({ preventScroll: true }), 60);
  };

  return (
    <div ref={ref}>
      <CheckoutSteps current={step} onSelect={goTo} />
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
          <motion.div
            key={step}
            className="mt-8"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE.bezier } }}
            exit={{ opacity: 0, x: -16, transition: { duration: 0.2, ease: EASE.bezier } }}
          >
            {step === "contact" && <ContactStep />}
            {step === "shipping" && <ShippingStep totals={cartTotals} />}
            {step === "payment" && <PaymentStep items={items} totals={checkoutTotals(cartTotals, shippingMethod)} />}
          </motion.div>
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
}

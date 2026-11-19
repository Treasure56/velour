import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

/** Minimal checkout header: demo notice, "Back to bag", centred logo, "Secure checkout". */
export function CheckoutHeader() {
  return (
    <header className="border-b border-champagne bg-cream">
      <p className="bg-blush px-4 py-2 text-center text-[0.6875rem] font-medium tracking-[0.08em] text-espresso">
        Demo store: no real payment will be taken.
      </p>
      <div className="mx-auto grid h-16 max-w-360 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 lg:h-20 lg:px-12">
        <Link
          href="/cart"
          className="-ml-2 inline-flex min-h-11 items-center gap-2 justify-self-start px-2 text-[0.6875rem] font-medium uppercase tracking-[0.18em] hover:text-mocha"
        >
          <ArrowLeft aria-hidden size={16} strokeWidth={1.25} />
          <span className="max-sm:sr-only">Back to bag</span>
        </Link>
        <Logo />
        <p className="inline-flex items-center gap-2 justify-self-end text-[0.6875rem] font-medium uppercase tracking-[0.18em]">
          <Lock aria-hidden size={14} strokeWidth={1.25} />
          <span className="max-sm:sr-only">Secure checkout</span>
        </p>
      </div>
    </header>
  );
}

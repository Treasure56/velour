"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import { DensitySelector } from "@/components/product/DensitySelector";
import { LengthSelector } from "@/components/product/LengthSelector";
import { Button } from "@/components/ui/Button";
import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { useAddToBag } from "@/hooks/useAddToBag";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useProductOptions } from "@/hooks/useProductOptions";
import { useScrollLock } from "@/hooks/useScrollLock";
import { toCartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import { EASE } from "@/lib/motion";
import { useCartStore, type QuickAddTarget } from "@/store/cart";

/** The modal body for one product (keyed by product, so selections reset per product). */
function QuickAddPanel({ target, onClose }: { target: QuickAddTarget; onClose: () => void }) {
  const { product, image, discount } = target;
  const options = useProductOptions(product, discount);
  const addToBag = useAddToBag();
  const panelRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true, onClose);
  useScrollLock(true);

  const add = () => {
    const from = imageRef.current;
    onClose();
    void addToBag(toCartItem(product, { inches: options.inches, density: options.density }, 1, image, discount), from);
  };

  return (
    <div className="fixed inset-0 z-65 flex items-end justify-center sm:items-center sm:p-6">
      <motion.div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-espresso/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
        className="relative max-h-[90svh] w-full overflow-y-auto rounded-t-lg bg-cream p-6 text-espresso sm:max-w-md sm:rounded-sm"
        data-lenis-prevent
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.45, ease: EASE.bezier } }}
        exit={{ y: 40, opacity: 0, transition: { duration: 0.3 } }}
      >
        <button
          type="button"
          data-autofocus
          onClick={onClose}
          aria-label="Close quick add"
          className="absolute right-3 top-3 grid size-10 place-items-center"
        >
          <X aria-hidden size={18} strokeWidth={1.25} />
        </button>

        <div className="flex gap-4 pr-8">
          <div ref={imageRef} className="relative aspect-4/5 w-20 shrink-0 overflow-hidden rounded-sm bg-ivory">
            {image && <Image src={image} alt="" fill sizes="80px" className="object-cover" />}
          </div>
          <div>
            <h2 id="quick-add-title" className="font-serif text-2xl font-light leading-tight">
              {product.name}
            </h2>
            <p className="mt-2 flex items-baseline gap-2 text-sm">
              <AnimatedPrice value={options.salePrice} className="font-medium" />
              {options.onSale && <s className="text-xs text-mocha/60 tabular-nums">{formatPrice(options.price)}</s>}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          {product.options.lengths.length > 0 && (
            <LengthSelector lengths={product.options.lengths} value={options.inches} onChange={options.setInches} />
          )}
          {product.options.densities && product.options.densities.length > 0 && (
            <DensitySelector densities={product.options.densities} value={options.density} onChange={options.setDensity} />
          )}
        </div>

        <Button onClick={add} className="mt-7 w-full">
          Add to Bag
        </Button>
      </motion.div>
    </div>
  );
}

/** Quick add for products with options: centred on desktop, a bottom sheet on mobile. */
export function QuickAddModal() {
  const target = useCartStore((s) => s.quickAdd);
  const closeQuickAdd = useCartStore((s) => s.closeQuickAdd);
  const onClose = useCallback(() => closeQuickAdd(), [closeQuickAdd]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{target && <QuickAddPanel key={target.product.id} target={target} onClose={onClose} />}</AnimatePresence>
    </MotionConfig>
  );
}

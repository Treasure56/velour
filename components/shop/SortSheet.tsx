"use client";

import { useRef } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { SORTS, type SortKey } from "@/lib/filter-products";
import { EASE } from "@/lib/motion";

type SortSheetProps = {
  open: boolean;
  /** Must be stable (useCallback) */
  onClose: () => void;
  value: SortKey;
  onChange: (sort: SortKey) => void;
};

/** Mobile sort: a small bottom sheet with the sort options. Picking one applies it and closes. */
export function SortSheet({ open, onClose, value, onChange }: SortSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);
  useScrollLock(open);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden
              onClick={onClose}
              className="fixed inset-0 z-60 bg-espresso/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              key="sheet"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Sort by"
              className="fixed inset-x-0 bottom-0 z-61 rounded-t-lg bg-cream px-6 pb-8 pt-3 text-espresso"
              initial={{ y: "100%" }}
              animate={{ y: 0, transition: { duration: 0.5, ease: EASE.bezier } }}
              exit={{ y: "100%", transition: { duration: 0.35, ease: EASE.bezier } }}
            >
              <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-full bg-champagne" />
              <p className="eyebrow text-mocha">Sort by</p>
              <ul className="mt-3 divide-y divide-champagne/60">
                {SORTS.map((s, i) => (
                  <li key={s.key}>
                    <button
                      type="button"
                      data-autofocus={i === 0 ? true : undefined}
                      aria-pressed={s.key === value}
                      onClick={() => {
                        onChange(s.key);
                        onClose();
                      }}
                      className="flex w-full items-center justify-between py-4 text-left text-sm"
                    >
                      {s.label}
                      {s.key === value && <Check aria-hidden size={16} strokeWidth={1.5} />}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

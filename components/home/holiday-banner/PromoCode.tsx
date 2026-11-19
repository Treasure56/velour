"use client";

import { useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

/** Dashed champagne box with the promo code and a Copy button ("Copied ✓" for 2s). */
export function PromoCode({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const onCopy = async () => {
    try {
      await copyText(code);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the code is still visible to copy by hand. */
    }
  };

  return (
    <div className={cn("flex items-stretch border border-dashed border-champagne/70", className)}>
      <span className="flex h-12 flex-1 items-center px-4 text-sm font-medium tracking-[0.2em] text-cream select-all">
        {code}
      </span>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? `Code ${code} copied` : `Copy code ${code}`}
        className="min-w-28 border-l border-dashed border-champagne/70 px-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-champagne transition-colors duration-300 hover:text-cream motion-reduce:transition-none"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Promo code copied to clipboard" : ""}
      </span>
    </div>
  );
}

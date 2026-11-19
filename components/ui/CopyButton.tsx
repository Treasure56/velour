"use client";

import { useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

type CopyButtonProps = {
  value: string;
  /** What is being copied, for screen readers, e.g. "account number" */
  label: string;
  className?: string;
};

/** Small text button: "Copy" → "Copied ✓" for 2s. */
export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const onCopy = async () => {
    try {
      await copyText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked: the value is still visible to copy by hand. */
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={onCopy}
        aria-label={`Copy ${label}`}
        className={cn(
          "inline-flex min-h-11 min-w-16 items-center justify-end text-[0.6875rem] font-medium uppercase tracking-[0.2em] underline underline-offset-4 hover:text-mocha",
          className,
        )}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </>
  );
}

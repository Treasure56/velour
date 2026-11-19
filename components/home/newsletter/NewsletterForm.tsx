"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { isValidEmail, subscribeToNewsletter } from "@/lib/newsletter";
import { EASE } from "@/lib/motion";

type Status = "idle" | "loading" | "success";

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: EASE.bezier } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: EASE.bezier } },
};

/**
 * One-line email form: bottom border only (espresso, turns champagne on focus), arrow submit.
 * Validates on submit, ~800ms loading, then fades to a thank-you line. Logic in lib/newsletter.ts.
 */
export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = status === "loading";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "");
    if (!isValidEmail(email)) {
      setError("That email doesn't look quite right. Please check it and try again.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    setStatus("loading");
    const result = await subscribeToNewsletter(email);
    if (result.ok) {
      setStatus("success");
    } else {
      setError(result.error);
      setStatus("idle");
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.p key="success" role="status" {...fade} className="py-3 font-serif text-2xl font-light italic">
            Welcome to the circle. Check your inbox for 10% off. ✦
          </motion.p>
        ) : (
          <motion.form key="form" {...fade} noValidate onSubmit={onSubmit} aria-label="Newsletter sign-up">
            <div className="flex items-center border-b border-espresso transition-[border-color,box-shadow] duration-500 ease-luxe focus-within:border-champagne focus-within:shadow-[0_1px_0_var(--color-champagne)] motion-reduce:transition-none">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                ref={inputRef}
                id="newsletter-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                spellCheck={false}
                placeholder="Your email address"
                disabled={loading}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "newsletter-error" : undefined}
                onChange={() => error && setError("")}
                className="min-w-0 flex-1 bg-transparent py-3 text-base text-espresso placeholder:text-mocha/70 focus-visible:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading}
                aria-label={loading ? "Joining" : "Join the circle"}
                className="grid size-11 shrink-0 place-items-center text-espresso transition-transform duration-500 ease-luxe hover:translate-x-1 disabled:hover:translate-x-0 motion-reduce:transition-none"
              >
                {loading ? (
                  <span aria-hidden className="animate-pulse font-serif text-xl leading-none">
                    …
                  </span>
                ) : (
                  <ArrowRight aria-hidden size={18} strokeWidth={1.25} />
                )}
              </button>
            </div>
            <p id="newsletter-error" aria-live="polite" className="mt-2 min-h-5 text-left text-xs text-mocha">
              {error}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";

/** "Pay ₦xxx" → small spinner + "Processing…" while the (mock) payment runs. Sticky at the bottom on phones. */
export function PayButton({ total, processing }: { total: number; processing: boolean }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-champagne bg-cream/95 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      <Button
        type="submit"
        variant="dark"
        size="lg"
        disabled={processing}
        aria-busy={processing || undefined}
        className="w-full disabled:opacity-90"
      >
        {processing ? (
          <>
            <span
              aria-hidden
              className="size-4 animate-spin rounded-full border border-cream/30 border-t-cream motion-reduce:animate-none"
            />
            Processing…
          </>
        ) : (
          <>Pay {formatPrice(total)}</>
        )}
      </Button>
      <p role="status" className="sr-only">
        {processing ? "Processing your payment, please wait." : ""}
      </p>
    </div>
  );
}

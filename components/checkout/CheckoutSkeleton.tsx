/** Quiet placeholder while the saved bag and checkout progress load (also shown while redirecting). */
export function CheckoutSkeleton() {
  return (
    <div aria-hidden className="flex-1 lg:grid lg:grid-cols-[58fr_42fr]">
      <div className="h-14 border-b border-champagne bg-ivory lg:hidden" />
      <div className="px-4 pt-8 sm:px-8 lg:px-12 lg:pt-12 xl:pr-20">
        <div className="mx-auto grid max-w-xl gap-5 lg:ml-auto lg:mr-0">
          <div className="h-11 w-2/3 bg-ivory/70" />
          <div className="mt-6 h-8 w-32 bg-ivory/70" />
          <div className="h-12 bg-ivory/70" />
          <div className="h-12 bg-ivory/70" />
        </div>
      </div>
      <div className="hidden border-l border-champagne bg-ivory lg:block" />
    </div>
  );
}

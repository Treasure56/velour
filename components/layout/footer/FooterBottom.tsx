import { footer } from "@/data/footer";
import { getCurrentYear } from "@/lib/year";
import { BackToTop } from "./BackToTop";

/** © line, monochrome payment labels, credit; then "Back to top". Stacks and centres on mobile. */
export async function FooterBottom() {
  const year = await getCurrentYear();

  return (
    <div className="text-xs text-cream/60">
      <div className="flex flex-col items-center gap-5 text-center lg:grid lg:grid-cols-3 lg:items-center lg:text-left">
        <p>
          © {year} Velour. All rights reserved.
        </p>
        <ul aria-label="Payment methods" className="flex flex-wrap justify-center gap-2">
          {footer.payments.map((method) => (
            <li
              key={method}
              className="rounded-sm border border-cream/25 px-2 py-1 text-[0.625rem] uppercase tracking-[0.14em]"
            >
              {method}
            </li>
          ))}
        </ul>
        <p className="lg:text-right">{footer.credit}</p>
      </div>
      <div className="mt-6 flex justify-center lg:justify-end">
        <BackToTop />
      </div>
    </div>
  );
}

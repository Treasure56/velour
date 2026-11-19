import { CopyButton } from "@/components/ui/CopyButton";
import { bankTransfer } from "@/data/payment";
import { cn } from "@/lib/utils";

type BankTransferDetailsProps = {
  /** Order number to use as the transfer reference (confirmation page) */
  reference?: string;
  className?: string;
};

/** Mock account details with a Copy button for the account number. Also shown on the confirmation page. */
export function BankTransferDetails({ reference, className }: BankTransferDetailsProps) {
  const rows = [
    { label: "Account name", value: bankTransfer.accountName },
    { label: "Account number", value: bankTransfer.accountNumber, copy: true },
    { label: "Bank", value: bankTransfer.bank },
    ...(reference ? [{ label: "Reference", value: reference }] : []),
  ];

  return (
    <div className={cn("text-sm", className)}>
      <dl className="divide-y divide-champagne/70">
        {rows.map((row) => (
          <div key={row.label} className="flex min-h-11 items-center justify-between gap-4">
            <dt className="text-xs text-mocha">{row.label}</dt>
            <dd className="flex items-center gap-4 text-right">
              <span className={cn(row.copy && "tracking-[0.08em] tabular-nums")}>{row.value}</span>
              {row.copy && <CopyButton value={row.value} label="account number" />}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-mocha">Your order will be confirmed once payment is received.</p>
    </div>
  );
}

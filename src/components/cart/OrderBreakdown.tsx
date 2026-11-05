import { cn, formatINR } from "@/lib/utils";
import { BUNDLE_DISCOUNT, SHIPPING_LABEL, type OrderTotals } from "@/lib/pricing";

/**
 * The one order breakdown used by the cart page, the cart drawer, checkout and
 * the handoff summary. Every figure comes from the shared pricing module.
 */
export function OrderBreakdown({
  totals,
  className,
  size = "default",
}: {
  totals: OrderTotals;
  className?: string;
  size?: "compact" | "default" | "large";
}) {
  const labelSize = size === "compact" ? "text-[11px]" : "text-xs";
  const valueSize = size === "compact" ? "text-[11px]" : "text-sm";

  return (
    <div className={cn("w-full", className)}>
      <dl className={cn("space-y-3", labelSize)}>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">
            Subtotal <span className="text-[0.9em] tabular-nums">({totals.itemCount} {totals.itemCount === 1 ? "tee" : "tees"})</span>
          </dt>
          <dd className={cn("font-medium tabular-nums", valueSize)}>{formatINR(totals.subtotal)}</dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className={cn("text-muted", totals.bundleUnlocked && "text-ink")}>
            Bundle discount
            {!totals.bundleUnlocked && (
              <span className="ml-2 hidden text-[9px] uppercase tracking-[0.08em] text-muted sm:inline">
                {totals.bundleRemaining} more for −{formatINR(BUNDLE_DISCOUNT)}
              </span>
            )}
          </dt>
          <dd className={cn("font-medium tabular-nums", valueSize, totals.bundleDiscount > 0 ? "text-ink" : "text-muted")}>
            −{formatINR(totals.bundleDiscount)}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-muted">Shipping</dt>
          <dd className={cn("font-semibold uppercase tracking-[0.08em]", valueSize)}>{SHIPPING_LABEL}</dd>
        </div>
      </dl>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-ink/20 pt-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em]">Final amount payable</p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-muted">Free shipping included</p>
        </div>
        <p
          className={cn(
            "shrink-0 font-semibold tabular-nums leading-none tracking-[-0.03em]",
            size === "compact" ? "text-xl" : size === "large" ? "text-4xl" : "text-3xl",
          )}
          aria-live="polite"
        >
          {formatINR(totals.total)}
        </p>
      </div>
    </div>
  );
}

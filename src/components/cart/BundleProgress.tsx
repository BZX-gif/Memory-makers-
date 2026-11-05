import { cn } from "@/lib/utils";
import { BUNDLE_QUANTITY, bundleMessage, type OrderTotals } from "@/lib/pricing";

/**
 * Four quiet ticks that fill as tees are added. Shared by the add-to-bag
 * notice, the cart drawer and the cart page so the message always agrees with
 * the order totals.
 */
export function BundleProgress({
  totals,
  className,
  showMessage = true,
}: {
  totals: OrderTotals;
  className?: string;
  showMessage?: boolean;
}) {
  const filled = Math.min(BUNDLE_QUANTITY, totals.itemCount);

  return (
    <div className={cn("w-full", className)}>
      <div
        className="flex items-center gap-1.5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={BUNDLE_QUANTITY}
        aria-valuenow={filled}
        aria-valuetext={`${totals.itemCount} of ${BUNDLE_QUANTITY} tees`}
      >
        {Array.from({ length: BUNDLE_QUANTITY }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-[3px] flex-1 transition-colors duration-500 ease-editorial",
              index < filled ? "bg-ink" : "bg-ink/15",
            )}
          />
        ))}
      </div>
      {showMessage && (
        <p
          className={cn(
            "mt-3 text-[11px] leading-relaxed",
            totals.bundleUnlocked ? "font-medium text-ink" : "text-muted",
          )}
        >
          {bundleMessage(totals)}
        </p>
      )}
    </div>
  );
}

import { BadgeIndianRupee, Camera, MessageCircle, Truck } from "lucide-react";
import { BUNDLE_DISCOUNT, BUNDLE_QUANTITY, ORIGINAL_UNIT_PRICE, UNIT_PRICE } from "@/lib/pricing";
import { formatINR } from "@/lib/utils";

/**
 * Trust signals built only from facts the store can stand behind:
 * the fixed price table, the free-shipping policy, the real-photo catalogue
 * and the personal WhatsApp confirmation step. No invented badges, ratings
 * or delivery promises.
 */
const signals = [
  {
    icon: Truck,
    label: "Free shipping",
    detail: "On every order, India-wide",
  },
  {
    icon: BadgeIndianRupee,
    label: `${formatINR(UNIT_PRICE)} flat`,
    detail: `MRP ${formatINR(ORIGINAL_UNIT_PRICE)} shown struck through · ${formatINR(BUNDLE_DISCOUNT)} off at ${BUNDLE_QUANTITY}+ tees`,
  },
  {
    icon: Camera,
    label: "Real photographs",
    detail: "The actual collection, shown unchanged",
  },
  {
    icon: MessageCircle,
    label: "Confirmed personally",
    detail: "Every order accepted by a human on WhatsApp",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="What you can count on" className="border-b border-ink/15">
      <ul className="frame grid grid-cols-2 gap-x-6 gap-y-8 py-9 sm:py-11 lg:grid-cols-4">
        {signals.map((signal) => (
          <li key={signal.label} className="flex items-start gap-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-ink/25">
              <signal.icon size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{signal.label}</p>
              <p className="mt-1.5 text-[10px] leading-relaxed tracking-[0.04em] text-muted">{signal.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { Info } from "lucide-react";

export function CatalogueNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-3 border border-ink/15 bg-chalk/60 ${compact ? "p-3" : "p-4"}`} role="note">
      <Info size={15} strokeWidth={1.6} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-[11px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">Your photos, clearly labelled.</span> Product names beginning with “Sample” are editable descriptive labels. Every tee is ₹600 (MRP ₹1,200) with free shipping; scarcity labels reflect manually configured catalogue stock. Materials, fit and measurements await owner confirmation.
      </p>
    </div>
  );
}

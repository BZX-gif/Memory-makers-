import { Info } from "lucide-react";

export function CatalogueNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-3 border border-ink/15 bg-chalk/60 ${compact ? "p-3" : "p-4"}`} role="note">
      <Info size={15} strokeWidth={1.6} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-[11px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">Your photos, clearly labelled.</span> Product names beginning with “Sample” are editable descriptive labels. Prices, materials, fit, sizes and stock await owner confirmation. Pictured colours and requested sizes are not a guarantee of availability.
      </p>
    </div>
  );
}

import { Info } from "lucide-react";

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-3 border border-ink/15 bg-chalk/60 ${compact ? "p-3" : "p-4"}`}>
      <Info size={15} strokeWidth={1.6} className="mt-0.5 shrink-0" aria-hidden="true" />
      <p className="text-[11px] leading-relaxed text-muted">
        <span className="font-semibold text-ink">Demo catalogue.</span> Sample products, prices and availability are for demonstration only. Replace them in <code className="font-mono text-[10px]">src/data/products.ts</code> before launch.
      </p>
    </div>
  );
}

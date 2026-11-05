"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityControl({
  quantity,
  onChange,
  label = "Quantity",
  compact = false,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  label?: string;
  compact?: boolean;
}) {
  const buttonClass = compact ? "h-9 w-9" : "h-12 w-12";
  return (
    <div
      className={`inline-flex items-center border border-ink/25 ${compact ? "h-9" : "h-12"}`}
      aria-label={label}
    >
      <button
        type="button"
        className={`${buttonClass} inline-flex items-center justify-center transition-colors hover:bg-ink hover:text-chalk disabled:pointer-events-none disabled:opacity-30`}
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= 1}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus size={14} strokeWidth={1.7} aria-hidden="true" />
      </button>
      <output
        className={`${compact ? "w-8 text-xs" : "w-11 text-sm"} text-center font-medium tabular-nums`}
        aria-live="polite"
        aria-label={`${label}: ${quantity}`}
      >
        {quantity}
      </output>
      <button
        type="button"
        className={`${buttonClass} inline-flex items-center justify-center transition-colors hover:bg-ink hover:text-chalk disabled:pointer-events-none disabled:opacity-30`}
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= 10}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus size={14} strokeWidth={1.7} aria-hidden="true" />
      </button>
    </div>
  );
}

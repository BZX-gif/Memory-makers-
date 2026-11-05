"use client";

import { RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="frame flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow text-muted">Something went off script</p>
      <h1 className="mt-5 text-5xl font-semibold uppercase tracking-[-0.055em] sm:text-7xl">Let’s try that again.</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">The page could not be loaded. Your shopping bag is saved on this device.</p>
      <button type="button" onClick={reset} className="button-dark mt-8"><RotateCcw size={15} /> Try again</button>
    </div>
  );
}

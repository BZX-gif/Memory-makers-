import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
    >
      <span
        className={cn(
          "text-[20px] font-black uppercase tracking-[-0.075em] transition-opacity group-hover:opacity-65",
          inverted && "text-chalk",
        )}
      >
        Memory
      </span>
      <span
        className={cn(
          "mt-[3px] self-end text-[9px] font-medium uppercase tracking-[0.42em]",
          inverted ? "text-chalk" : "text-ink",
        )}
      >
        Makers
      </span>
    </Link>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/#collections" },
  { label: "About", href: "/#story" },
];

export function Header() {
  const { itemCount, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/15 bg-paper/95 backdrop-blur-md">
      <div className="border-b border-ink/10 py-2 text-center">
        <p className="eyebrow text-[9px]">Independent ideas · Made wearable · India</p>
      </div>
      <div className="frame flex h-[72px] items-center justify-between lg:h-20">
        <Wordmark className="relative z-50" />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex" aria-label="Main navigation">
          {navigation.map((item) => {
            const active = item.href === "/" ? pathname === "/" : item.href === "/shop" && pathname.startsWith("/shop");
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-2 text-[11px] font-medium uppercase tracking-[0.12em] transition-opacity hover:opacity-50",
                  active && "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-5">
          <Link
            href="/cart"
            className="group flex min-h-11 items-center gap-2 px-2 text-[11px] font-medium uppercase tracking-[0.1em]"
          >
            <span className="hidden sm:inline">Bag</span>
            <span className="sr-only sm:hidden">Bag</span>
            <ShoppingBag size={18} strokeWidth={1.5} className="sm:hidden" aria-hidden="true" />
            <span className="inline-flex h-6 min-w-6 items-center justify-center border border-ink px-1 text-[10px] tabular-nums transition-colors group-hover:bg-ink group-hover:text-chalk">
              {hydrated ? itemCount : 0}
            </span>
            <span className="sr-only">{hydrated && itemCount === 1 ? "item" : "items"} in shopping bag</span>
          </Link>
          <button
            type="button"
            className="relative z-50 inline-flex h-11 w-11 items-center justify-center lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X size={23} strokeWidth={1.4} /> : <Menu size={23} strokeWidth={1.4} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-40 flex h-[calc(100svh-105px)] flex-col bg-paper lg:hidden"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="frame flex flex-1 flex-col justify-center" aria-label="Mobile navigation">
              {navigation.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={reduceMotion ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-ink/20 py-5 text-[clamp(2.3rem,10vw,4rem)] font-semibold uppercase leading-none tracking-[-0.055em]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight size={28} strokeWidth={1.2} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="frame flex items-end justify-between border-t border-ink/15 py-7">
              <p className="eyebrow leading-relaxed text-muted">Art · Words · Ideas<br />Made wearable.</p>
              <p className="font-serif text-2xl italic">Wear your memories.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

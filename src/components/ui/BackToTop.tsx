"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Quiet circular control that appears once the reader is deep in a page. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 14 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
          aria-label="Back to top"
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 bg-paper/90 text-ink shadow-[0_10px_30px_rgba(17,17,15,0.18)] backdrop-blur transition-colors hover:bg-ink hover:text-chalk"
        >
          <ArrowUp size={17} strokeWidth={1.6} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

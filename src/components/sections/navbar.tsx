"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { BasketIcon } from "../icons";

const LINKS = [
  { href: "#cups", label: "Cups" },
  { href: "#boxes", label: "Boxes" },
  { href: "#desserts", label: "Desserts" },
  { href: "#order", label: "How to order" },
];

/** Aceternity floating navbar: hides on scroll down, glides back on scroll up. */
export function Navbar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [solid, setSolid] = useState(false);
  const { count, setOpen, pulse } = useBasket();
  const [bump, setBump] = useState(false);
  const firstPulse = useRef(pulse);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 40);
    setVisible(y < 120 || y < prev);
  });

  useEffect(() => {
    if (pulse === firstPulse.current) return;
    setBump(true);
    setVisible(true);
    const t = setTimeout(() => setBump(false), 600);
    return () => clearTimeout(t);
  }, [pulse]);

  return (
    <AnimatePresence>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-4xl items-center justify-between gap-4 rounded-full border px-3 py-2 pl-6 transition-colors duration-300",
            solid
              ? "border-gold/30 bg-paper/80 shadow-[0_10px_40px_-15px_rgba(74,51,34,0.35)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          <a href="#top" className="font-display text-sm tracking-[0.25em] text-ink">
            <span className="text-gold">THE</span> GRAZING TABLE
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-[13px] tracking-[0.12em] text-cocoa uppercase transition-colors hover:bg-gold/15 hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "relative flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] tracking-[0.12em] text-cream uppercase transition-transform hover:bg-cocoa",
              bump && "scale-110",
            )}
            aria-label={`Open basket, ${count} items`}
          >
            <BasketIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Basket</span>
            <span
              className={cn(
                "grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-semibold text-ink tabular-nums transition-transform",
                bump && "scale-125",
              )}
            >
              {count}
            </span>
          </button>
        </nav>
      </motion.header>
    </AnimatePresence>
  );
}

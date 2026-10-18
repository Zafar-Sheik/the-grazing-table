"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Aceternity Card Hover Effect: a soft highlight glides between cards. */
export function HoverEffect({
  items,
  className,
}: {
  items: { title: string; icon?: ReactNode; body: ReactNode }[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2", className)}>
      {items.map((item, i) => (
        <div
          key={item.title}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === i && (
              <motion.span
                className="absolute inset-0 block h-full w-full rounded-[1.75rem] bg-gold/15"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10 h-full overflow-hidden rounded-3xl border border-gold/25 bg-paper p-7 transition-colors group-hover:border-gold/60">
            <div className="flex items-center gap-3">
              {item.icon}
              <h3 className="font-display text-lg tracking-[0.14em] text-cocoa uppercase">{item.title}</h3>
            </div>
            <div className="mt-5 text-[15px] leading-relaxed text-ink/80">{item.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

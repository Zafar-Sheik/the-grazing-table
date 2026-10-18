"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Aceternity FlipWords: cycles through words with a blurred letter reveal. */
export function FlipWords({
  words,
  duration = 2600,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % words.length), duration);
    return () => clearTimeout(t);
  }, [index, duration, words.length]);

  const word = words[index];

  return (
    <span className="relative inline-block">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30, x: 30, filter: "blur(8px)", scale: 1.6, position: "absolute" }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className={cn("relative z-10 inline-block whitespace-nowrap", className)}
        >
          {word.split("").map((ch, i) => (
            <motion.span
              key={word + i}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.035, duration: 0.3 }}
              className="inline-block"
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

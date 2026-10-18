"use client";

import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/** Aceternity "moving border" button: a gold glint orbits the pill outline. */
export function MovingBorderButton({
  children,
  className,
  innerClassName,
  as = "a",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  as?: "a" | "button";
} & ComponentPropsWithoutRef<"a"> &
  ComponentPropsWithoutRef<"button">) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "group relative inline-flex overflow-hidden rounded-full p-[1.5px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold",
        className,
      )}
      {...(rest as object)}
    >
      <span
        aria-hidden
        className="absolute inset-[-200%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#e2c48a_85%,#fff7e0_90%,transparent_100%)]"
      />
      <span
        className={cn(
          "relative inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium tracking-[0.18em] text-cream uppercase transition-colors group-hover:bg-cocoa",
          innerClassName,
        )}
      >
        {children}
      </span>
    </Tag>
  );
}

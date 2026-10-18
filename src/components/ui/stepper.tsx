"use client";

import { cn } from "@/lib/utils";
import { MinusIcon, PlusIcon } from "../icons";

export function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  label,
  size = "md",
  dark,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: "sm" | "md";
  dark?: boolean;
}) {
  const btn = cn(
    "grid place-items-center rounded-full transition-colors disabled:opacity-30",
    size === "sm" ? "h-7 w-7" : "h-10 w-10",
    dark ? "text-cream hover:bg-cream/10" : "text-ink hover:bg-gold/20",
  );
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border",
        dark ? "border-cream/25" : "border-cocoa/25 bg-paper",
      )}
    >
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label}`}>
        <MinusIcon className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label={label}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.min(max, n));
        }}
        onBlur={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange(Number.isNaN(n) ? min : Math.max(min, Math.min(max, n)));
        }}
        className={cn(
          "w-12 appearance-none bg-transparent text-center font-medium tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none",
          size === "sm" ? "text-sm" : "text-base",
          dark ? "text-cream" : "text-ink",
        )}
      />
      <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label}`}>
        <PlusIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

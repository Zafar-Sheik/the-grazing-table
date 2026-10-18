import { cn } from "@/lib/utils";

/** Gold laurel sprig used as a corner ornament, echoing the printed menus. */
export function Leaf({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      className={cn("leaf-sprig text-gold", flip && "-scale-x-100", className)}
    >
      <path className="leaf-stem" d="M8 112 C 40 84, 70 52, 112 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {[
        [30, 90, -35],
        [44, 76, 30],
        [56, 62, -40],
        [68, 50, 25],
        [80, 38, -45],
        [92, 26, 20],
      ].map(([x, y, r], i) => (
        <path
          key={i}
          className="leaf-blade"
          d="M0 0 C 6 -10, 20 -12, 26 -4 C 18 2, 6 4, 0 0 Z"
          fill="currentColor"
          fillOpacity={0.55 + (i % 2) * 0.25}
          transform={`translate(${x} ${y}) rotate(${r - 45})${i % 2 ? " scale(1 -1)" : ""}`}
        />
      ))}
    </svg>
  );
}

export function Flourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 20" fill="none" aria-hidden className={cn("h-4 w-44 text-gold", className)}>
      <path d="M0 10 H 70" stroke="currentColor" strokeWidth="1" />
      <path d="M130 10 H 200" stroke="currentColor" strokeWidth="1" />
      <path
        d="M72 10 C 80 2, 90 2, 100 10 C 110 18, 120 18, 128 10 C 120 2, 110 2, 100 10 C 90 18, 80 18, 72 10 Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="100" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

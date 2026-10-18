import { cn } from "@/lib/utils";
import { Flourish } from "./ui/leaf";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  children,
  dark,
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      <p
        data-reveal
        className={cn("font-sans text-xs tracking-[0.45em] uppercase", dark ? "text-gold-light" : "text-gold-deep")}
      >
        {eyebrow}
      </p>
      <h2
        data-reveal
        className={cn(
          "mt-4 font-serif text-[clamp(2.5rem,6vw,4.75rem)] leading-[1.02] font-medium",
          dark ? "text-cream" : "text-ink",
        )}
      >
        {title}
      </h2>
      <div data-reveal className="mt-5 flex justify-center">
        <Flourish />
      </div>
      {children && (
        <p data-reveal className={cn("mt-5 text-base leading-relaxed md:text-lg", dark ? "text-cream/70" : "text-ink/70")}>
          {children}
        </p>
      )}
    </div>
  );
}

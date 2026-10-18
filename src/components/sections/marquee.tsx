"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

const WORDS = [
  "Charcuterie Cups",
  "Grazing Boxes",
  "Grazing Tables",
  "Mini Desserts",
  "Picnics",
  "Gifting",
  "Date Nights",
  "Celebrations",
];

/** Infinite gold-on-ink ticker; scroll direction and speed steer it. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(".marquee-track", { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity() / 220;
            const dir = self.direction;
            gsap.to(loop, { timeScale: dir * Math.max(1, Math.min(Math.abs(v), 6)), duration: 0.3, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3 });
          },
        });
        return () => st.kill();
      });
    },
    { scope: root },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-8 font-serif text-3xl italic text-cream md:text-5xl">{w}</span>
          <span className="text-xl text-gold md:text-2xl">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div ref={root} aria-hidden className="relative -rotate-1 overflow-hidden border-y border-gold/40 bg-ink py-5 md:py-7">
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}

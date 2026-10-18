"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { rand } from "@/lib/menu";

/** Price that rolls to its new value with GSAP. */
export function AnimatedRand({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ v: value });

  useEffect(() => {
    const tween = gsap.to(current.current, {
      v: value,
      duration: 0.6,
      ease: "power3.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = rand(current.current.v);
      },
    });
    return () => {
      tween.kill();
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {rand(value)}
    </span>
  );
}

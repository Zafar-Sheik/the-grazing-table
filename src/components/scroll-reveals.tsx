"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Fades and lifts every [data-reveal] element as it scrolls into view. */
export function ScrollReveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set("[data-reveal]", { opacity: 0, y: 40 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true }),
      });
    });
  });
  return null;
}

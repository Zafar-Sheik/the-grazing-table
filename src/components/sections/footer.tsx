"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { CONTACT, OFFERINGS } from "@/lib/menu";
import { MovingBorderButton } from "../ui/moving-border";
import { Leaf } from "../ui/leaf";
import { InstagramIcon, WhatsAppIcon } from "../icons";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".footer-big", { type: "words", mask: "words" });
        gsap.from(split.words, {
          yPercent: 100,
          stagger: 0.08,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".footer-big", start: "top 85%" },
        });
        gsap.from(".footer-thanks", {
          opacity: 0,
          scale: 0.9,
          rotate: -6,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".footer-thanks", start: "top 90%" },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink px-5 pt-28 pb-10 text-cream">
      <Leaf className="absolute bottom-10 left-4 h-28 w-28 opacity-60" />
      <Leaf flip className="absolute bottom-10 right-4 h-28 w-28 opacity-60" />
      <div className="mx-auto max-w-5xl text-center">
        <p className="footer-thanks font-script text-6xl text-gold-light md:text-7xl">Thank you</p>
        <p className="mt-3 text-xs tracking-[0.4em] text-cream/60 uppercase">for supporting The Grazing Table</p>
        <h2 className="footer-big mx-auto mt-12 max-w-4xl font-serif text-[clamp(2.4rem,6vw,5rem)] leading-[1.05]">
          Let&apos;s make your next gathering unforgettable.
        </h2>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MovingBorderButton href={`https://wa.me/${CONTACT.whatsappIntl}`} target="_blank" rel="noreferrer" innerClassName="bg-cream text-ink group-hover:bg-gold-light">
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp {CONTACT.whatsappDisplay}
          </MovingBorderButton>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3.5 text-sm tracking-[0.12em] transition-colors hover:border-gold hover:text-gold-light"
          >
            <InstagramIcon className="h-4 w-4" /> @{CONTACT.instagram}
          </a>
        </div>

        <div className="mt-20 grid gap-8 border-t border-cream/10 pt-10 text-sm text-cream/60 sm:grid-cols-3">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-gold-light uppercase">Collection</p>
            <p className="mt-2">Mon–Sat · 08:00 – 17:00</p>
            <p>Sunday by arrangement</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.3em] text-gold-light uppercase">Notice</p>
            <p className="mt-2">48–72 hours for all orders</p>
            <p>Minimum 20 cups</p>
          </div>
          <div>
            <p className="text-[11px] tracking-[0.3em] text-gold-light uppercase">Payment</p>
            <p className="mt-2">50% deposit secures your order</p>
            <p>EFT or cash</p>
          </div>
        </div>

        <p className="mt-16 font-display text-[clamp(2rem,9vw,7rem)] leading-none text-cream/[0.07] select-none">GRAZING TABLE</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] tracking-[0.3em] text-cream/40 uppercase">
          {OFFERINGS.map((o, i) => (
            <li key={o} className="flex items-center gap-4">
              {i > 0 && <span className="text-gold">•</span>}
              {o}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-cream/30">© The Grazing Table · Created to Serve</p>
      </div>
    </footer>
  );
}

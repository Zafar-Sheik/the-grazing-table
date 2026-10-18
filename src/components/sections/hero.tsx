"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { OFFERINGS, CONTACT } from "@/lib/menu";
import { Spotlight } from "../ui/spotlight";
import { MovingBorderButton } from "../ui/moving-border";
import { Leaf } from "../ui/leaf";
import { ArrowIcon, WhatsAppIcon } from "../icons";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const platter = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-title", { type: "chars", mask: "chars" });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.from(".hero-the", { opacity: 0, letterSpacing: "1.4em", duration: 1.6 })
          .from(split.chars, { yPercent: 110, duration: 1.3, stagger: 0.035 }, "<0.15")
          .from(".hero-rule", { scaleX: 0, duration: 1.1 }, "-=0.9")
          .from(".hero-tag", { opacity: 0, y: 14, letterSpacing: "0.9em", duration: 1.2 }, "<")
          .from(".hero-offer", { opacity: 0, y: 12, stagger: 0.08, duration: 0.8 }, "-=0.8")
          .from(".hero-cta > *", { opacity: 0, y: 20, stagger: 0.1, duration: 0.9 }, "-=0.6")
          .from(platter.current, { opacity: 0, y: 60, scale: 0.92, duration: 1.8 }, 0.2)
          .from(".hero-root .leaf-stem", { drawSVG: 0, duration: 1.6, ease: "power2.inOut" }, 0.3)
          .from(".hero-root .leaf-blade", { scale: 0, transformOrigin: "0 0", stagger: 0.05, duration: 0.8, ease: "back.out(2)" }, 0.8);

        gsap.to(".platter-float", { y: -12, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

        gsap.to(platter.current, {
          yPercent: -18,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-copy", {
          yPercent: 25,
          opacity: 0.2,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });

        const xTo = gsap.quickTo(".platter-tilt", "rotationY", { duration: 0.8, ease: "power3" });
        const yTo = gsap.quickTo(".platter-tilt", "rotationX", { duration: 0.8, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 14);
          yTo(-(e.clientY / window.innerHeight - 0.5) * 8);
        };
        window.addEventListener("pointermove", onMove);
        return () => {
          window.removeEventListener("pointermove", onMove);
          split.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="hero-root relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-16"
    >
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(184,138,68,0.18)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />
      <Leaf className="absolute top-20 left-4 h-24 w-24 md:top-24 md:left-10 md:h-36 md:w-36" />
      <Leaf flip className="absolute top-20 right-4 h-24 w-24 md:top-24 md:right-10 md:h-36 md:w-36" />

      <div ref={platter} className="relative w-[min(88vw,560px)]" style={{ perspective: 900 }}>
        <div className="platter-tilt">
          <div className="platter-float">
            <Image
              src="/images/platter.png"
              alt="A gold cake stand laden with charcuterie, fresh berries, macarons and mini desserts"
              width={430}
              height={265}
              preload
              sizes="(min-width: 640px) 560px, 88vw"
              className="h-auto w-full drop-shadow-[0_30px_30px_rgba(74,51,34,0.15)]"
            />
          </div>
        </div>
        <div aria-hidden className="mx-auto -mt-3 h-4 w-2/3 rounded-[50%] bg-cocoa/15 blur-md" />
      </div>

      <div className="hero-copy relative mt-6 text-center">
        <p className="hero-the font-display text-xl tracking-[0.6em] text-ink md:text-2xl">THE</p>
        <h1 className="hero-title font-display text-[clamp(2.6rem,10vw,7.5rem)] leading-[0.95] font-normal text-ink">
          Grazing Table
        </h1>
        <div className="hero-rule mx-auto my-5 h-[2px] w-20 bg-gold" />
        <p className="hero-tag font-sans text-sm tracking-[0.55em] text-cocoa uppercase md:text-base">
          Created to Serve
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] tracking-[0.3em] text-bark uppercase">
          {OFFERINGS.map((o, i) => (
            <li key={o} className="hero-offer flex items-center gap-4">
              {i > 0 && <span className="text-gold">•</span>}
              {o}
            </li>
          ))}
        </ul>

        <div className="hero-cta mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MovingBorderButton href="#cups">
            Build your cup <ArrowIcon className="h-4 w-4" />
          </MovingBorderButton>
          <a
            href={`https://wa.me/${CONTACT.whatsappIntl}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cocoa/30 px-7 py-3.5 text-sm tracking-[0.18em] text-cocoa uppercase transition-colors hover:border-gold hover:bg-gold/10"
          >
            <WhatsAppIcon className="h-4 w-4" /> Chat with us
          </a>
        </div>
      </div>

    </section>
  );
}

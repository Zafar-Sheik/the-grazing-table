"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { POLICY } from "@/lib/menu";
import { SectionHeading } from "../section-heading";
import { HoverEffect } from "../ui/hover-effect";

const STEPS = [
  {
    when: "Step 01",
    title: "Curate your order",
    body: "Build your cups, pick your boxes and desserts above. Cup orders start at 20 cups; desserts come by the dozen.",
  },
  {
    when: "48–72 hours ahead",
    title: "Send it on WhatsApp",
    body: "Your basket becomes a ready-to-send message. Orders need 48–72 hours notice — weekends book up fast, so book early.",
  },
  {
    when: "To confirm",
    title: "Pay your 50% deposit",
    body: "A 50% non-refundable deposit via EFT or cash secures your slot. No order is confirmed until the deposit and proof of payment are received.",
  },
  {
    when: "24 hours before",
    title: "Finalise the details",
    body: "Confirm your final guest count and any customisations, and settle the balance.",
  },
  {
    when: "Collection day",
    title: "Collect & serve",
    body: "Collection only, Mon–Sat 08:00 – 17:00 (Sunday by arrangement). Please collect on time so everything is at its freshest.",
  },
];

export function OrderPolicy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".timeline-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ".timeline", start: "top 65%", end: "bottom 65%", scrub: 0.4 },
          },
        );
        gsap.utils.toArray<HTMLElement>(".timeline-step").forEach((step) => {
          gsap.from(step.querySelector(".timeline-dot"), {
            scale: 0,
            duration: 0.6,
            ease: "back.out(3)",
            scrollTrigger: { trigger: step, start: "top 65%" },
          });
          gsap.from(step.querySelectorAll(".timeline-text > *"), {
            opacity: 0,
            x: 40,
            stagger: 0.08,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: step, start: "top 70%" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="order" ref={root} className="relative px-5 py-28 md:py-36">
      <SectionHeading eyebrow="Order Policy" title="How ordering works">
        A little planning goes a long way. Here&apos;s the journey from craving to collection.
      </SectionHeading>

      <div className="timeline relative mx-auto mt-20 max-w-3xl">
        <div aria-hidden className="absolute top-2 bottom-2 left-[19px] w-px bg-gold/25 md:left-1/2">
          <div className="timeline-progress h-full w-full origin-top bg-gradient-to-b from-gold-light via-gold to-gold-deep" />
        </div>
        <ol className="space-y-16">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="timeline-step relative grid grid-cols-[40px_1fr] gap-6 md:grid-cols-2 md:gap-16"
            >
              <span
                aria-hidden
                className="timeline-dot absolute top-1 left-[11px] z-10 grid h-[18px] w-[18px] place-items-center rounded-full border border-gold bg-cream md:left-1/2 md:-translate-x-1/2"
              >
                <span className="h-2 w-2 rounded-full bg-gold" />
              </span>
              <span className="md:hidden" />
              <div className={`timeline-text ${i % 2 ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}>
                <p className="text-xs tracking-[0.3em] text-gold-deep uppercase">{s.when}</p>
                <h3 className="mt-2 font-serif text-3xl text-ink md:text-4xl">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-ink/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto mt-28 max-w-5xl">
        <h3 data-reveal className="text-center font-display text-xl tracking-[0.25em] text-cocoa uppercase">The fine print</h3>
        <div data-reveal>
          <HoverEffect
            className="mt-8"
            items={POLICY.map((p) => ({
              title: p.title,
              icon: <span className="h-2 w-2 rotate-45 bg-gold" />,
              body: (
                <ul className="space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-gold" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  );
}

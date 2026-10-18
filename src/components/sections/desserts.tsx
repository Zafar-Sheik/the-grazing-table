"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ACRYLIC, DESSERTS, PARTY_PACKAGES, rand } from "@/lib/menu";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../section-heading";
import { FocusCards } from "../ui/focus-cards";
import { Stepper } from "../ui/stepper";
import { CheckIcon, PlusIcon } from "../icons";

const GALLERY = [
  { title: "The dessert bar", src: "/images/dessert-1.jpg", caption: "Mousse, Oreo, trifle & more" },
  { title: "Strawberry layers", src: "/images/dessert-2.jpg", caption: "Fresh, creamy and layered by hand" },
  { title: "Passion fruit cheesecake", src: "/images/dessert-3.jpg", caption: "Silky, tangy and irresistible" },
];

export function Desserts() {
  return (
    <section id="desserts" className="relative overflow-hidden bg-ink px-5 py-28 text-cream md:py-36">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gold/15 blur-[120px]" />
      <SectionHeading dark eyebrow="Mini Desserts" title={<>Desserts by the <em className="text-gold-gradient">dozen</em></>}>
        Hand-layered dessert cups, sold in 12s. 48 hours notice required for all dessert orders.
      </SectionHeading>

      <div className="mx-auto mt-16 max-w-6xl">
        <div data-reveal>
          <FocusCards cards={GALLERY} />
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <DessertMenu />
          <div className="space-y-8">
            <PartyPackages />
            <Acrylic />
          </div>
        </div>
      </div>
    </section>
  );
}

function DessertMenu() {
  const { add } = useBasket();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<string | null>(null);

  return (
    <div data-reveal>
      <h3 className="font-display text-lg tracking-[0.2em] text-gold-light uppercase">Price per dozen</h3>
      <ul className="mt-6 divide-y divide-cream/10 border-y border-cream/10">
        {DESSERTS.map((d) => {
          const n = qty[d.name] ?? 1;
          return (
            <li key={d.name} className="group relative flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
              <span aria-hidden className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gradient-to-r from-gold/15 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              <div className="relative flex min-w-0 flex-1 items-baseline">
                <span className="font-serif text-2xl transition-transform duration-300 group-hover:translate-x-2">{d.name}</span>
                <span className="leaders hidden sm:block" />
                <span className="ml-auto font-display text-lg text-gold-light tabular-nums sm:ml-0">{rand(d.price)}</span>
              </div>
              <div className="relative flex items-center gap-2">
                <Stepper size="sm" dark value={n} min={1} max={30} onChange={(v) => setQty((p) => ({ ...p, [d.name]: v }))} label={`Dozens of ${d.name}`} />
                <button
                  type="button"
                  onClick={() => {
                    add({ kind: "dessert", title: `${d.name} (dozen)`, details: ["12 units"], unitPrice: d.price, qty: n });
                    setAdded(d.name);
                    setTimeout(() => setAdded((a) => (a === d.name ? null : a)), 1400);
                  }}
                  aria-label={`Add ${n} dozen ${d.name}`}
                  className="grid h-9 w-9 place-items-center rounded-full bg-gold text-ink transition-transform hover:scale-110"
                >
                  {added === d.name ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-cream/50">No mixed dozens unless stated. Custom desserts & flavours are quoted on request.</p>
    </div>
  );
}

function PartyPackages() {
  const { add } = useBasket();
  const [pkg, setPkg] = useState(PARTY_PACKAGES[0].key);
  const [picks, setPicks] = useState<string[]>([]);
  const [added, setAdded] = useState(false);
  const p = PARTY_PACKAGES.find((x) => x.key === pkg)!;

  const toggle = (name: string) => {
    setAdded(false);
    setPicks((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : prev.length < 4 ? [...prev, name] : [...prev.slice(1), name],
    );
  };

  return (
    <div data-reveal className="rounded-[2rem] border border-gold/30 bg-cream/[0.04] p-7 backdrop-blur">
      <p className="text-xs tracking-[0.3em] text-gold-light uppercase">Party packages · Core saver</p>
      <h3 className="mt-2 font-serif text-3xl">Any 4 desserts, for events</h3>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {PARTY_PACKAGES.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setPkg(x.key)}
            aria-pressed={pkg === x.key}
            className={cn(
              "relative rounded-2xl border p-4 text-left transition-colors",
              pkg === x.key ? "border-gold bg-gold/15" : "border-cream/15 hover:border-cream/40",
            )}
          >
            <p className="font-display text-2xl text-gold-light">{x.cups} <span className="text-sm">cups</span></p>
            <p className="mt-1 font-serif text-xl">{rand(x.price)}</p>
            <p className="mt-1 text-xs text-cream/50 italic">{x.note}</p>
          </button>
        ))}
      </div>

      <p className="mt-6 text-[11px] tracking-[0.25em] text-cream/60 uppercase">
        Pick your 4 desserts · {picks.length}/4
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {DESSERTS.map((d) => {
          const on = picks.includes(d.name);
          return (
            <button
              key={d.name}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(d.name)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[13px] transition-all",
                on ? "border-gold bg-gold text-ink" : "border-cream/20 text-cream/80 hover:border-gold",
              )}
            >
              {d.name}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={picks.length !== 4}
        onClick={() => {
          add({ kind: "package", title: `Party package — ${p.cups} cups`, details: [`Desserts: ${picks.join(", ")}`], unitPrice: p.price, qty: 1 });
          setAdded(true);
        }}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-xs font-medium tracking-[0.18em] text-ink uppercase transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:bg-cream/15 disabled:text-cream/40"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={String(added)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2">
            {added ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
            {added ? "Package added" : picks.length === 4 ? `Add package · ${rand(p.price)}` : `Choose ${4 - picks.length} more`}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}

function Acrylic() {
  const { add } = useBasket();
  const [flash, setFlash] = useState<string | null>(null);
  return (
    <div data-reveal className="rounded-[2rem] border border-cream/10 p-7">
      <p className="text-xs tracking-[0.3em] text-gold-light uppercase">Extras</p>
      <h3 className="mt-2 font-serif text-2xl">Upgrade to acrylic</h3>
      <ul className="mt-4 space-y-2.5">
        {ACRYLIC.map((a) => (
          <li key={a.key} className="flex items-center gap-3 text-[15px]">
            <span className="text-cream/80">{a.name.replace("Acrylic cup upgrade — ", "Acrylic cups ")}</span>
            <span className="leaders" />
            <span className="font-display text-gold-light tabular-nums">
              {rand(a.price)}
              {a.unit && <span className="text-xs text-cream/50"> {a.unit}</span>}
            </span>
            <button
              type="button"
              onClick={() => {
                add({ kind: "extra", title: a.name, details: [], unitPrice: a.price, qty: a.key === "spoon" ? 12 : 1 });
                setFlash(a.key);
                setTimeout(() => setFlash(null), 900);
              }}
              aria-label={`Add ${a.name}`}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/50 text-gold-light transition-colors hover:bg-gold hover:text-ink"
            >
              {flash === a.key ? <CheckIcon className="h-3.5 w-3.5" /> : <PlusIcon className="h-3.5 w-3.5" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

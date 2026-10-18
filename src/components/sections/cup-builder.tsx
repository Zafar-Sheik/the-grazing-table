"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useMemo, useState } from "react";
import { CUPS, EXTRAS, MIN_CUPS, rand, type CupKind, type CupItem } from "@/lib/menu";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../section-heading";
import { Stepper } from "../ui/stepper";
import { AnimatedRand } from "../ui/animated-number";
import { CheckIcon, PlusIcon } from "../icons";

type Selection = Record<string, string[]>;

const emptySelection = (cup: CupKind): Selection =>
  Object.fromEntries(cup.groups.map((g) => [g.key, [] as string[]]));

function textOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#1d1712" : "#fbf6ec";
}

export function CupBuilder() {
  const [kindKey, setKindKey] = useState<CupKind["key"]>("signature");
  const cup = CUPS.find((c) => c.key === kindKey)!;
  const [selections, setSelections] = useState<Record<string, Selection>>(() =>
    Object.fromEntries(CUPS.map((c) => [c.key, emptySelection(c)])),
  );
  const [qty, setQty] = useState(MIN_CUPS);
  const [added, setAdded] = useState(false);
  const { add, setOpen } = useBasket();

  const sel = selections[kindKey];

  const picked = useMemo(
    () =>
      cup.groups.flatMap((g) =>
        sel[g.key].map((name) => ({ group: g.key, item: g.items.find((i) => i.name === name)! })),
      ),
    [cup, sel],
  );
  const upgrades = picked.reduce((s, p) => s + (p.item.upgrade ?? 0), 0);
  const unit = cup.price + upgrades;
  const remaining = cup.count - picked.length;
  const complete = remaining === 0;

  const toggle = (groupKey: string, item: CupItem, choose: number) => {
    setAdded(false);
    setSelections((prev) => {
      const cur = prev[kindKey][groupKey];
      let next: string[];
      if (cur.includes(item.name)) next = cur.filter((n) => n !== item.name);
      else if (cur.length < choose) next = [...cur, item.name];
      else next = [...cur.slice(1), item.name]; // swap out the oldest pick
      return { ...prev, [kindKey]: { ...prev[kindKey], [groupKey]: next } };
    });
  };

  const surprise = () => {
    setAdded(false);
    const next: Selection = {};
    for (const g of cup.groups) {
      const pool = [...g.items].sort(() => Math.random() - 0.5);
      next[g.key] = pool.slice(0, g.choose).map((i) => i.name);
    }
    setSelections((prev) => ({ ...prev, [kindKey]: next }));
  };

  const reset = () => {
    setAdded(false);
    setSelections((prev) => ({ ...prev, [kindKey]: emptySelection(cup) }));
  };

  const addToBasket = () => {
    if (!complete) return;
    add({
      kind: "cup",
      title: cup.name,
      details: cup.groups.map(
        (g) =>
          `${g.title}: ${sel[g.key]
            .map((n) => {
              const it = g.items.find((i) => i.name === n);
              return it?.upgrade ? `${n} (+R${it.upgrade})` : n;
            })
            .join(", ")}`,
      ),
      unitPrice: unit,
      qty,
      isCup: true,
    });
    setAdded(true);
  };

  return (
    <section id="cups" className="relative px-5 py-28 md:py-36">
      <SectionHeading eyebrow="Charcuterie & Sweet Cups" title={<>Build your <em className="text-gold-gradient not-italic font-semibold">perfect</em> cup</>}>
        Pick from each section below and watch your cup come together. Minimum order is {MIN_CUPS} cups.
      </SectionHeading>

      {/* Cup type switch */}
      <div data-reveal className="mt-12 flex justify-center">
        <div className="relative inline-flex rounded-full border border-gold/40 bg-paper p-1.5">
          {CUPS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setKindKey(c.key)}
              className={cn(
                "relative z-10 rounded-full px-5 py-3 text-xs tracking-[0.18em] uppercase transition-colors sm:px-8 sm:text-sm",
                kindKey === c.key ? "text-cream" : "text-cocoa hover:text-ink",
              )}
            >
              {kindKey === c.key && (
                <motion.span
                  layoutId="cup-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {c.name}<span className="hidden sm:inline"> · R{c.price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {/* Live cup preview */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <CupPreview cup={cup} picked={picked} />
          <div className="mt-6 text-center">
            <p className="font-serif text-2xl text-ink">{cup.name}</p>
            <p className="mt-1 text-sm text-ink/60">{cup.tagline}</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button type="button" onClick={surprise} className="rounded-full border border-gold/50 px-5 py-2 text-xs tracking-[0.18em] text-cocoa uppercase transition-colors hover:bg-gold/15">
                ✦ Surprise me
              </button>
              <button type="button" onClick={reset} className="rounded-full px-5 py-2 text-xs tracking-[0.18em] text-ink/50 uppercase transition-colors hover:text-ink">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Choices */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={kindKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-9"
            >
              {cup.groups.map((g) => {
                const chosen = sel[g.key];
                return (
                  <fieldset key={g.key}>
                    <legend className="flex w-full items-baseline justify-between gap-4 border-b border-gold/30 pb-3">
                      <span className="font-display text-base tracking-[0.14em] text-bark uppercase md:text-lg">
                        {g.title} <span className="font-sans text-sm tracking-normal normal-case text-ink/50">(choose {g.choose})</span>
                      </span>
                      <span className="flex gap-1.5" aria-label={`${chosen.length} of ${g.choose} chosen`}>
                        {Array.from({ length: g.choose }).map((_, i) => (
                          <span key={i} className={cn("h-2 w-2 rounded-full transition-colors duration-300", i < chosen.length ? "bg-gold" : "bg-gold/25")} />
                        ))}
                      </span>
                    </legend>
                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {g.items.map((item) => {
                        const on = chosen.includes(item.name);
                        return (
                          <motion.button
                            key={item.name}
                            type="button"
                            whileTap={{ scale: 0.94 }}
                            onClick={() => toggle(g.key, item, g.choose)}
                            aria-pressed={on}
                            className={cn(
                              "group flex items-center gap-2.5 rounded-full border py-2.5 pr-4 pl-2.5 text-[15px] transition-all duration-200",
                              on
                                ? "border-ink bg-ink text-cream shadow-[0_8px_24px_-12px_rgba(29,23,18,0.6)]"
                                : "border-cocoa/20 bg-paper text-ink hover:-translate-y-0.5 hover:border-gold",
                            )}
                          >
                            <span
                              className="grid h-6 w-6 place-items-center rounded-full ring-1 ring-black/10 transition-transform group-hover:scale-110"
                              style={{ background: item.color }}
                            >
                              {on && <CheckIcon className="h-3.5 w-3.5" style={{ color: textOn(item.color) }} />}
                            </span>
                            {item.name}
                            {item.upgrade && (
                              <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", on ? "bg-gold text-ink" : "bg-gold/15 text-gold-deep")}>
                                +R{item.upgrade}
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Summary */}
          <div className="mt-12 rounded-[2rem] border border-gold/30 bg-paper p-6 shadow-[0_30px_60px_-40px_rgba(74,51,34,0.5)] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.3em] text-bark uppercase">Per cup</p>
                <p className="mt-1 font-serif text-3xl text-ink">
                  <AnimatedRand value={unit} />
                  {upgrades > 0 && <span className="ml-2 align-middle text-sm text-gold-deep">incl. R{upgrades} upgrades</span>}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs tracking-[0.3em] text-bark uppercase">Cups</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Stepper value={qty} onChange={(v) => { setQty(v); setAdded(false); }} min={MIN_CUPS} label="Number of cups" />
                  {[20, 50, 100].map((n) => (
                    <button key={n} type="button" onClick={() => { setQty(n); setAdded(false); }} className={cn("rounded-full px-3 py-2 text-xs transition-colors", qty === n ? "bg-gold/25 text-ink" : "text-ink/50 hover:text-ink")}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs tracking-[0.3em] text-bark uppercase">Total</p>
                <AnimatedRand value={unit * qty} className="mt-1 block font-serif text-4xl font-semibold text-ink" />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink/60" aria-live="polite">
                {complete ? (added ? "Added — keep building or review your basket." : "Your cup is complete. Looks delicious.") : `Choose ${remaining} more item${remaining === 1 ? "" : "s"} to complete your cup.`}
              </p>
              <div className="flex gap-3">
                {added && (
                  <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-cocoa/30 px-5 py-3 text-xs tracking-[0.18em] text-cocoa uppercase hover:bg-gold/10">
                    View basket
                  </button>
                )}
                <button
                  type="button"
                  disabled={!complete}
                  onClick={addToBasket}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3 text-xs tracking-[0.18em] text-cream uppercase transition-all hover:bg-cocoa disabled:cursor-not-allowed disabled:bg-ink/25"
                >
                  {added ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
                  Add {qty} cups
                </button>
              </div>
            </div>
          </div>

          <ExtrasRow />
        </div>
      </div>
    </section>
  );
}

function CupPreview({ cup, picked }: { cup: CupKind; picked: { group: string; item: CupItem }[] }) {
  const filled = picked.length;
  return (
    <div className="relative mx-auto aspect-[3/4] w-[min(78vw,340px)]">
      {/* glow */}
      <div aria-hidden className="absolute inset-x-8 bottom-0 h-10 rounded-[50%] bg-cocoa/20 blur-xl" />
      {/* lid rim */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-20 h-5 rounded-full border border-white/70 bg-gradient-to-b from-white/70 to-white/20 shadow-[0_4px_12px_-4px_rgba(74,51,34,0.4)]" />
      <div
        className="absolute inset-x-0 top-2.5 bottom-0 overflow-hidden bg-gradient-to-b from-white/50 to-white/20 ring-1 ring-white/70"
        style={{ clipPath: "polygon(0 0, 100% 0, 86% 100%, 14% 100%)" }}
      >
        <LayoutGroup>
          <div className="absolute inset-x-0 bottom-0 flex h-full flex-col-reverse">
            <AnimatePresence initial={false}>
              {picked.map(({ item }, i) => (
                <motion.div
                  layout
                  key={cup.key + item.name}
                  initial={{ y: -420, opacity: 0, rotate: i % 2 ? 4 : -4 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ x: i % 2 ? 300 : -300, opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  className="relative flex shrink-0 items-center justify-center overflow-hidden border-t border-white/30 text-[11px] font-medium tracking-[0.12em] uppercase sm:text-xs"
                  style={{
                    height: `${100 / cup.count}%`,
                    background: `linear-gradient(180deg, ${item.color}, ${item.color}dd)`,
                    color: textOn(item.color),
                  }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 opacity-30 mix-blend-overlay [background-image:radial-gradient(circle_at_20%_30%,white_1.5px,transparent_2px),radial-gradient(circle_at_70%_60%,white_1px,transparent_1.5px)] [background-size:22px_18px,16px_14px]"
                  />
                  <span className="relative">{item.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
        {/* glass highlight */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[18%] w-6 bg-gradient-to-b from-white/70 via-white/20 to-transparent blur-[2px]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_30px_rgba(255,255,255,0.6)]" />
      </div>
      {/* counter */}
      <div className="absolute -right-2 top-10 z-30 grid h-20 w-20 place-items-center rounded-full border border-gold/50 bg-paper text-center shadow-lg">
        <div>
          <p className="font-serif text-2xl leading-none text-ink tabular-nums">
            {filled}/{cup.count}
          </p>
          <p className="mt-1 text-[9px] tracking-[0.2em] text-bark uppercase">items</p>
        </div>
      </div>
      {filled === 0 && (
        <p className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-16 text-center font-serif text-xl text-ink/40 italic">
          Tap an ingredient to start filling
        </p>
      )}
    </div>
  );
}

function ExtrasRow() {
  const { add } = useBasket();
  const [flash, setFlash] = useState<string | null>(null);
  return (
    <div className="mt-6 rounded-[2rem] border border-dashed border-gold/50 p-6">
      <p className="text-xs tracking-[0.3em] text-bark uppercase">Extras for your order</p>
      <p className="mt-1 text-sm text-ink/60">Only these three extras are available — no others.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {EXTRAS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => {
              add({ kind: "extra", title: x.name, details: [], unitPrice: x.price, qty: 1 });
              setFlash(x.key);
              setTimeout(() => setFlash(null), 900);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-cocoa/20 bg-paper px-4 py-2.5 text-sm transition-colors hover:border-gold"
          >
            {flash === x.key ? <CheckIcon className="h-4 w-4 text-gold-deep" /> : <PlusIcon className="h-4 w-4 text-gold-deep" />}
            {x.name} <span className="text-ink/50">{rand(x.price)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

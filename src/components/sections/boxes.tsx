"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { BOXES, EXTRAS, VEG_BOXES, VEG_INCLUDES, rand, type Box } from "@/lib/menu";
import { useBasket } from "@/lib/basket";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../section-heading";
import { CardBody, CardContainer, CardItem } from "../ui/three-d-card";
import { FlipWords } from "../ui/flip-words";
import { Stepper } from "../ui/stepper";
import { AnimatedRand } from "../ui/animated-number";
import { CheckIcon, PlusIcon } from "../icons";

const SIZES = ["small", "medium", "large"] as const;

export function Boxes() {
  const [veg, setVeg] = useState(false);

  return (
    <section id="boxes" className="relative overflow-hidden bg-linen/60 px-5 py-28 md:py-36">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <SectionHeading eyebrow="Grazing Boxes" title="Curated luxury in every box">
        <span className="block">
          Perfectly curated for{" "}
          <FlipWords
            words={["picnics", "gifting", "date nights", "small celebrations", "family gatherings"]}
            className="font-serif text-2xl text-gold-deep italic md:text-3xl"
          />
        </span>
      </SectionHeading>

      <div data-reveal className="mt-12 flex justify-center">
        <button
          type="button"
          role="switch"
          aria-checked={veg}
          onClick={() => setVeg((v) => !v)}
          className="group flex items-center gap-4 rounded-full border border-gold/40 bg-paper py-2 pr-6 pl-2 text-sm"
        >
          <span className={cn("relative h-8 w-14 rounded-full transition-colors duration-300", veg ? "bg-[#5d7a3a]" : "bg-ink")}>
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn("absolute top-1 h-6 w-6 rounded-full bg-cream", veg ? "right-1" : "left-1")}
            />
          </span>
          <span className="tracking-[0.16em] uppercase">
            {veg ? "Vegetarian (no meat)" : "Classic grazing"}
          </span>
        </button>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-3">
        {SIZES.map((size, i) => {
          const box = BOXES.find((b) => b.key === size)!;
          const vegBox = VEG_BOXES.find((b) => b.key === size)!;
          return (
            <div data-reveal key={size} className={cn(i === 1 && "md:-translate-y-6")}>
              <BoxCard box={box} veg={veg} vegPrice={vegBox.price} vegName={vegBox.name} featured={i === 1} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function BoxCard({
  box,
  veg,
  vegPrice,
  vegName,
  featured,
}: {
  box: Box;
  veg: boolean;
  vegPrice: number;
  vegName: string;
  featured?: boolean;
}) {
  const { add } = useBasket();
  const [choices, setChoices] = useState<string[]>(() => box.choices?.map((c) => c.options[0]) ?? []);
  const [upgrades, setUpgrades] = useState<string[]>([]);
  const [extras, setExtras] = useState<Record<string, number>>({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const availableExtras = EXTRAS.filter((x) => !(veg && x.key === "meat"));
  const base = veg ? vegPrice : box.price;
  const upgradeCost = veg ? 0 : (box.upgrades ?? []).filter((u) => upgrades.includes(u.name)).reduce((s, u) => s + u.price, 0);
  const extrasCost = availableExtras.reduce((s, x) => s + (extras[x.key] ?? 0) * x.price, 0);
  const unit = base + upgradeCost + extrasCost;

  const onAdd = () => {
    const details: string[] = [];
    if (veg) details.push(`Vegetarian: ${VEG_INCLUDES.join(", ").toLowerCase()}`);
    else box.choices?.forEach((c, i) => details.push(`${c.label}: ${choices[i]}`));
    if (!veg) {
      for (const u of box.upgrades ?? []) if (upgrades.includes(u.name)) details.push(`Upgrade: ${u.name} (+R${u.price})`);
    }
    for (const x of availableExtras) if (extras[x.key]) details.push(`${x.name} ×${extras[x.key]}`);
    add({ kind: "box", title: veg ? vegName : box.name, details, unitPrice: unit, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <CardContainer className="w-full">
      <CardBody
        className={cn(
          "group/card relative h-full w-full rounded-[2rem] border p-7 transition-shadow",
          featured
            ? "border-gold bg-ink text-cream shadow-[0_40px_80px_-40px_rgba(29,23,18,0.8)]"
            : "border-gold/30 bg-paper text-ink shadow-[0_30px_60px_-45px_rgba(74,51,34,0.6)]",
        )}
      >
        {featured && (
          <CardItem translateZ={40} className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-semibold tracking-[0.25em] text-ink uppercase">
            Gift ready
          </CardItem>
        )}
        <CardItem translateZ={30} className="text-xs tracking-[0.3em] uppercase opacity-60">
          {box.pax}
        </CardItem>
        <CardItem translateZ={50} as="h3" className="mt-2 font-serif text-3xl leading-tight">
          <AnimatePresence mode="wait">
            <motion.span key={String(veg)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="block">
              {veg ? vegName : box.name}
            </motion.span>
          </AnimatePresence>
        </CardItem>
        <CardItem translateZ={60} className="mt-3 flex items-baseline gap-2">
          <AnimatedRand value={base} className={cn("font-display text-4xl", featured ? "text-gold-light" : "text-gold-deep")} />
        </CardItem>
        {box.note && (
          <CardItem translateZ={20} as="p" className="mt-2 text-sm italic opacity-70">
            {box.note}
          </CardItem>
        )}

        <CardItem translateZ={25} className="mt-6 w-full">
          <p className="text-[11px] tracking-[0.25em] uppercase opacity-60">Includes</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {(veg
              ? [...box.includes.filter((x) => !/meat/i.test(x)), ...VEG_INCLUDES]
              : box.includes
            ).map((inc) => (
              <li
                key={inc}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[12.5px]",
                  featured ? "bg-cream/10" : "bg-linen",
                  veg && VEG_INCLUDES.includes(inc) && "bg-[#5d7a3a]/20 text-[#3f5a22]",
                  veg && VEG_INCLUDES.includes(inc) && featured && "text-[#c7dca6]",
                )}
              >
                {inc}
              </li>
            ))}
          </ul>
        </CardItem>

        {/* Options */}
        <div className="mt-6 space-y-4">
          {!veg &&
            box.choices?.map((c, ci) => (
              <div key={c.label}>
                <p className="text-[11px] tracking-[0.25em] uppercase opacity-60">Choose your {c.label.toLowerCase()}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {c.options.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setChoices((prev) => prev.map((p, i) => (i === ci ? o : p)))}
                      aria-pressed={choices[ci] === o}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                        choices[ci] === o ? "border-gold bg-gold text-ink" : "border-current/20 hover:border-gold",
                      )}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          {!veg && box.upgrades && (
            <div>
              <p className="text-[11px] tracking-[0.25em] uppercase opacity-60">Upgrades</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {box.upgrades.map((u) => {
                  const on = upgrades.includes(u.name);
                  return (
                    <button
                      key={u.name}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setUpgrades((prev) => (on ? prev.filter((x) => x !== u.name) : [...prev, u.name]))}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                        on ? "border-gold bg-gold text-ink" : "border-current/20 hover:border-gold",
                      )}
                    >
                      {on && <CheckIcon className="h-3.5 w-3.5" />}
                      {u.name} +R{u.price}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase opacity-60">Extras</p>
            <div className="mt-2 space-y-2">
              {availableExtras.map((x) => (
                <div key={x.key} className="flex items-center justify-between gap-3 text-[13.5px]">
                  <span>
                    {x.name} <span className="opacity-50">{rand(x.price)}</span>
                  </span>
                  <Stepper
                    size="sm"
                    dark={featured}
                    value={extras[x.key] ?? 0}
                    onChange={(v) => setExtras((prev) => ({ ...prev, [x.key]: v }))}
                    max={20}
                    label={`${x.name} for ${box.name}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={cn("mt-7 flex items-center justify-between gap-3 border-t pt-5", featured ? "border-cream/15" : "border-gold/25")}>
          <Stepper size="sm" dark={featured} value={qty} onChange={setQty} min={1} max={50} label={`Number of ${box.name}es`} />
          <CardItem translateZ={40} as="div">
            <button
              type="button"
              onClick={onAdd}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs tracking-[0.16em] uppercase transition-colors",
                featured ? "bg-gold text-ink hover:bg-gold-light" : "bg-ink text-cream hover:bg-cocoa",
              )}
            >
              {added ? <CheckIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
              {added ? "Added" : <>Add · {rand(unit * qty)}</>}
            </button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}

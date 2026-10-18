"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useBasket } from "@/lib/basket";
import { CONTACT, MIN_CUPS, rand } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { Stepper } from "../ui/stepper";
import { BasketIcon, CloseIcon, WhatsAppIcon } from "../icons";

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function BasketDrawer() {
  const { lines, open, setOpen, total, setQty, remove, clear, cupsShort, cupCount } = useBasket();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");

  const minDate = useMemo(() => {
    if (!open) return "";
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return toISODate(d);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, setOpen]);

  const isSunday = date ? new Date(`${date}T12:00:00`).getDay() === 0 : false;
  const tooSoon = date ? date < minDate : false;
  const hasDessert = lines.some((l) => l.kind === "dessert" || l.kind === "package");

  const message = useMemo(() => {
    const out: string[] = ["Hi The Grazing Table! I'd like to place an order:", ""];
    lines.forEach((l, i) => {
      out.push(`${i + 1}. ${l.title} × ${l.qty} — ${rand(l.unitPrice * l.qty)}`);
      l.details.forEach((d) => out.push(`   • ${d}`));
    });
    out.push("", `Estimated total: ${rand(total)}`, `50% deposit: ${rand(Math.ceil(total / 2))}`, "");
    if (name) out.push(`Name: ${name}`);
    if (date) {
      const pretty = new Date(`${date}T12:00:00`).toLocaleDateString("en-ZA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      out.push(`Collection: ${pretty}${isSunday ? " (Sunday — by arrangement)" : ` at ${time}`}`);
    }
    if (notes) out.push(`Notes: ${notes}`);
    return out.join("\n");
  }, [lines, total, name, date, time, notes, isSunday]);

  const canSend = lines.length > 0 && cupsShort === 0;
  const waHref = `https://wa.me/${CONTACT.whatsappIntl}?text=${encodeURIComponent(message)}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Your basket"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-paper shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-gold/25 px-6 py-5">
              <div>
                <p className="text-[11px] tracking-[0.3em] text-bark uppercase">Your order</p>
                <h2 className="font-serif text-3xl text-ink">Basket</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close basket" className="grid h-10 w-10 place-items-center rounded-full hover:bg-gold/15">
                <CloseIcon className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <BasketIcon className="h-12 w-12 text-gold" />
                  <p className="mt-4 font-serif text-2xl text-ink">Your basket is empty</p>
                  <p className="mt-2 text-sm text-ink/60">Build a cup, choose a box or add a dozen desserts to get started.</p>
                  <a href="#cups" onClick={() => setOpen(false)} className="mt-6 rounded-full bg-ink px-6 py-3 text-xs tracking-[0.18em] text-cream uppercase">
                    Start building
                  </a>
                </div>
              ) : (
                <>
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {lines.map((l) => (
                        <motion.li
                          key={l.id}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30, height: 0, marginTop: 0 }}
                          className="overflow-hidden rounded-2xl border border-gold/25 bg-cream/60 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-serif text-xl leading-tight text-ink">{l.title}</p>
                              <p className="text-xs text-ink/50">
                                {rand(l.unitPrice)} each
                              </p>
                            </div>
                            <p className="font-display text-ink tabular-nums">{rand(l.unitPrice * l.qty)}</p>
                          </div>
                          {l.details.length > 0 && (
                            <ul className="mt-2 space-y-0.5 text-[13px] leading-snug text-ink/65">
                              {l.details.map((d) => (
                                <li key={d}>· {d}</li>
                              ))}
                            </ul>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <Stepper size="sm" value={l.qty} min={l.minQty ?? 1} max={500} onChange={(v) => setQty(l.id, v)} label={`Quantity of ${l.title}`} />
                            <button type="button" onClick={() => remove(l.id)} className="text-xs tracking-[0.15em] text-ink/50 uppercase hover:text-berry">
                              Remove
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {cupsShort > 0 && (
                    <p className="mt-4 rounded-xl bg-berry/10 px-4 py-3 text-sm text-berry">
                      You have {cupCount} cups — the minimum cup order is {MIN_CUPS}. Add {cupsShort} more to continue.
                    </p>
                  )}

                  <div className="mt-6 space-y-4">
                    <label className="block">
                      <span className="text-[11px] tracking-[0.25em] text-bark uppercase">Your name</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-cocoa/20 bg-paper px-4 py-3 outline-none focus:border-gold" placeholder="Full name" autoComplete="name" />
                    </label>
                    <div className="grid grid-cols-[1fr_auto] gap-3">
                      <label className="block">
                        <span className="text-[11px] tracking-[0.25em] text-bark uppercase">Collection date</span>
                        <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 w-full rounded-xl border border-cocoa/20 bg-paper px-4 py-3 outline-none focus:border-gold" />
                      </label>
                      <label className="block">
                        <span className="text-[11px] tracking-[0.25em] text-bark uppercase">Time</span>
                        <select value={time} onChange={(e) => setTime(e.target.value)} disabled={isSunday} className="mt-1.5 w-full rounded-xl border border-cocoa/20 bg-paper px-3 py-3 outline-none focus:border-gold disabled:opacity-40">
                          {Array.from({ length: 10 }, (_, i) => `${String(8 + i).padStart(2, "0")}:00`).map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    {(tooSoon || isSunday || hasDessert) && (
                      <p className="text-xs leading-relaxed text-ink/60">
                        {tooSoon && "Orders need 48–72 hours notice — please pick a later date. "}
                        {isSunday && "Sunday collections are by arrangement — we'll confirm a time with you. "}
                        {hasDessert && "Dessert orders need 48 hours notice."}
                      </p>
                    )}
                    <label className="block">
                      <span className="text-[11px] tracking-[0.25em] text-bark uppercase">Notes</span>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1.5 w-full resize-none rounded-xl border border-cocoa/20 bg-paper px-4 py-3 outline-none focus:border-gold" placeholder="Occasion, allergies, customisations…" />
                    </label>
                  </div>
                </>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t border-gold/25 bg-cream/70 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs tracking-[0.25em] text-bark uppercase">Estimated total</span>
                  <span className="font-serif text-3xl text-ink">{rand(total)}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between text-sm text-ink/60">
                  <span>50% deposit to confirm</span>
                  <span>{rand(Math.ceil(total / 2))}</span>
                </div>
                <a
                  href={canSend && !tooSoon ? waHref : undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!canSend || tooSoon}
                  className={cn(
                    "mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-xs font-medium tracking-[0.18em] uppercase transition-colors",
                    canSend && !tooSoon ? "bg-[#1f7a4d] text-white hover:bg-[#186640]" : "pointer-events-none bg-ink/15 text-ink/40",
                  )}
                >
                  <WhatsAppIcon className="h-4 w-4" /> Send order on WhatsApp
                </a>
                <div className="mt-3 flex items-center justify-between text-[11px] text-ink/50">
                  <span>Collection only · EFT or cash</span>
                  <button type="button" onClick={clear} className="tracking-[0.15em] uppercase hover:text-berry">
                    Clear basket
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MIN_CUPS } from "./menu";

export type BasketLine = {
  id: string;
  kind: "cup" | "box" | "dessert" | "package" | "extra";
  title: string;
  details: string[];
  unitPrice: number;
  qty: number;
  /** Lines that count towards the 20-cup minimum. */
  isCup?: boolean;
  minQty?: number;
};

type BasketCtx = {
  lines: BasketLine[];
  add: (line: Omit<BasketLine, "id">) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  total: number;
  count: number;
  cupCount: number;
  cupsShort: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  pulse: number;
};

const Ctx = createContext<BasketCtx | null>(null);
const STORAGE_KEY = "tgt-basket-v1";

const sameLine = (a: Omit<BasketLine, "id">, b: BasketLine) =>
  a.kind === b.kind &&
  a.title === b.title &&
  a.unitPrice === b.unitPrice &&
  a.details.join("|") === b.details.join("|");

export function BasketProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BasketLine[]>([]);
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring persisted state once on mount
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, hydrated]);

  const add = useCallback((line: Omit<BasketLine, "id">) => {
    setLines((prev) => {
      const existing = prev.find((l) => sameLine(line, l));
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, qty: l.qty + line.qty } : l,
        );
      }
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      return [...prev, { ...line, id }];
    });
    setPulse((p) => p + 1);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, qty: Math.max(l.minQty ?? 1, qty) } : l,
      ),
    );
  }, []);

  const remove = useCallback(
    (id: string) => setLines((prev) => prev.filter((l) => l.id !== id)),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const total = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const cupCount = lines
      .filter((l) => l.isCup)
      .reduce((s, l) => s + l.qty, 0);
    const cupsShort = cupCount > 0 && cupCount < MIN_CUPS ? MIN_CUPS - cupCount : 0;
    return {
      lines,
      add,
      setQty,
      remove,
      clear,
      total,
      count,
      cupCount,
      cupsShort,
      open,
      setOpen,
      pulse,
    };
  }, [lines, add, setQty, remove, clear, open, pulse]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBasket() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBasket must be used inside BasketProvider");
  return ctx;
}

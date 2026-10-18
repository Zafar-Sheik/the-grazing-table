"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Aceternity Focus Cards: hovering one card blurs and dims the rest. */
export function FocusCards({
  cards,
  columns = 3,
}: {
  cards: { title: string; src: string; caption?: string }[];
  columns?: 2 | 3;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div className={cn("grid grid-cols-1 gap-5", columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
      {cards.map((card, i) => (
        <div
          key={card.src}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "relative aspect-[4/3.4] overflow-hidden rounded-3xl ring-1 ring-gold/30 transition-all duration-300 ease-out",
            hovered !== null && hovered !== i && "scale-[0.97] blur-[2px] opacity-70",
          )}
        >
          <Image
            src={card.src}
            alt={card.title}
            fill
            sizes={columns === 2 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 33vw, 100vw"}
            className={cn("object-cover transition-transform duration-700", hovered === i && "scale-110")}
          />
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/85 via-ink/20 to-transparent p-6 transition-opacity duration-300",
              hovered === i ? "opacity-100" : "opacity-0 sm:opacity-0 max-sm:opacity-100",
            )}
          >
            <p className="font-serif text-2xl text-cream">{card.title}</p>
            {card.caption && <p className="mt-1 text-sm text-cream/70">{card.caption}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

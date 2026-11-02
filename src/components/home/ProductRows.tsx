"use client";

import Link from "next/link";
import { useState } from "react";
import { cx } from "@/lib/cx";
import type { Product } from "@/lib/nav";

/*
  Products in development as plain rows (Figma Alma · Home › Produkty › Zoznam). Hovering a row shows
  a preview on the right: one line from a day in that service and a hatched "vo vývoji" tile (idea 6).
*/
const SCENES: Record<string, string> = {
  dos: "Opatrovateľka ráno vidí, ku komu ide a čo obec potrebuje potvrdiť.",
  stacionar: "Príchod klienta jedným ťuknutím, denný program sa doplní sám.",
  pobytove: "Lieky, strava a úhrady klienta na jednej karte, bez zošitov.",
  "sluzby-a-pomocky": "Pacient si pozrie prehľad o sebe a objedná dopravu na kontrolu.",
};

export function ProductRows({ products }: { products: readonly Product[] }) {
  const [hovered, setHovered] = useState<Product>(products[0]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px] lg:gap-16">
      <ul className="flex flex-col" onMouseLeave={() => setHovered(products[0])}>
        {products.map((p) => {
          const on = hovered.slug === p.slug;
          return (
            <li key={p.slug} className="border-t border-border-default last:border-b">
              <Link
                href={p.href}
                onMouseEnter={() => setHovered(p)}
                onFocus={() => setHovered(p)}
                className={cx(
                  "focus-ring group -mx-3 flex flex-col gap-2 rounded-12 px-3 py-5 transition-[background-color,transform] duration-200 lg:grid lg:grid-cols-[220px_1fr_auto] lg:items-start lg:gap-8",
                  on && "lg:translate-x-1 lg:bg-bg-muted",
                )}
              >
                <span className="flex flex-col gap-1">
                  <span className="text-h4 text-text-primary">{p.name}</span>
                  <span className="text-caption text-text-tertiary">{p.statusLabel}</span>
                </span>
                <span className="text-body-s text-text-secondary lg:text-body-m">{p.summary}</span>
                <span className="text-label-s text-accent-text lg:pt-0.5">
                  Viac o produkte <span aria-hidden="true" className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Preview (desktop) */}
      <div aria-hidden="true" className="hidden lg:block">
        <div className="sticky top-28 flex flex-col overflow-hidden rounded-16 border border-border-default">
          <div className="hatched flex aspect-[300/170] items-center justify-center bg-bg-surface">
            <span className="rounded-8 bg-bg-surface px-2.5 py-1 text-caption text-text-tertiary shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              {hovered.statusLabel.toLowerCase()}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 border-t border-border-default bg-bg-page p-4">
            <p className="text-label-s text-text-primary">{hovered.name}</p>
            <p key={hovered.slug} className="text-body-s text-text-secondary animate-[fade-in_0.3s_ease-out]">
              {SCENES[hovered.slug] ?? hovered.audience}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

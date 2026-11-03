"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { DATES } from "@/lib/nav";

/*
  Numbers computed from today's date in the visitor's browser (idea 5): which day of the pilot it is and how many
  days remain to the two legal milestones. Rendered after mount so the server and the client never disagree;
  each number counts up when it scrolls into view.
*/
const DAY = 86_400_000;

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / DAY);
}

function local(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

type Tile = { value: number | null; suffix: string; label: string; detail: string };

function compute(): Tile[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pilotDay = daysBetween(local(DATES.pilotStart), today) + 1;
  const toAllowance = daysBetween(today, local(DATES.allowance));
  const toEzdravie = daysBetween(today, local(DATES.ezdravie));
  return [
    {
      value: Math.max(0, pilotDay),
      suffix: ".",
      label: "deň pilotu Alma ADOS",
      detail: "od októbra 2026 · Arcidiecézna charita Košice",
    },
    {
      value: toAllowance > 0 ? toAllowance : null,
      suffix: "",
      label: toAllowance > 0 ? "dní do príspevku na pomoc pri odkázanosti" : "príspevok na pomoc pri odkázanosti",
      detail: "január 2027 · prvý mesiac s nárokom, zákon 406/2025 Z. z.",
    },
    {
      value: toEzdravie > 0 ? toEzdravie : null,
      suffix: "",
      label: toEzdravie > 0 ? "dní do povinného identifikátora eZdravie v dávkach ADOS" : "povinný identifikátor eZdravie v dávkach ADOS",
      detail: "1. 7. 2027 · zákon 136/2026 Z. z., bez neho poisťovňa výkon neuhradí",
    },
  ];
}

const PLACEHOLDER: Tile[] = [
  { value: null, suffix: "", label: "deň pilotu Alma ADOS", detail: "od októbra 2026 · Arcidiecézna charita Košice" },
  { value: null, suffix: "", label: "dní do príspevku na pomoc pri odkázanosti", detail: "január 2027 · prvý mesiac s nárokom, zákon 406/2025 Z. z." },
  { value: null, suffix: "", label: "dní do povinného identifikátora eZdravie v dávkach ADOS", detail: "1. 7. 2027 · zákon 136/2026 Z. z., bez neho poisťovňa výkon neuhradí" },
];

/*
  The number as a counter: every digit sits in its own column that rolls from 0 to its value once the tile
  scrolls into view, the next column 120 ms after the previous one. Reduced motion shows the value at once.
*/
function Odometer({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const digits = String(to).split("");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cols = Array.from(el.querySelectorAll<HTMLElement>("[data-col]"));
    const settle = (animate: boolean) =>
      cols.forEach((col, i) => {
        col.style.transitionDelay = animate ? `${i * 120}ms` : "0ms";
        col.style.transform = `translateY(${-Number(col.dataset.col) * 1.05}em)`;
      });
    if (prefersReducedMotion()) {
      settle(false);
      return;
    }
    const trigger = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => settle(true) });
    return () => trigger.kill();
  }, [to]);
  return (
    <span ref={ref} aria-label={`${to}${suffix}`} className="inline-flex h-[1.05em] items-start overflow-hidden leading-none tabular-nums">
      {digits.map((d, i) => (
        <span key={i} aria-hidden="true" className="relative inline-block h-[1.05em] w-[0.62em] overflow-hidden">
          <span
            data-col={d}
            className="absolute left-0 top-0 flex flex-col transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          >
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} className="block h-[1.05em] text-center">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}

export function LiveNumbers() {
  const [tiles, setTiles] = useState<Tile[] | null>(null);
  useEffect(() => {
    setTiles(compute());
  }, []);
  const shown = tiles ?? PLACEHOLDER;

  return (
    <dl className="gsap-reveal grid gap-px overflow-hidden rounded-16 border border-border-default bg-border-default sm:grid-cols-3">
      {shown.map((t) => (
        <div key={t.label} className="flex flex-col gap-1 bg-bg-surface p-6 lg:p-7">
          <dd className="order-1 text-mobile-h2 text-text-primary lg:text-display lg:text-[56px]">
            {t.value === null ? (tiles ? "platí" : "—") : <Odometer to={t.value} suffix={t.suffix} />}
          </dd>
          <dt className="order-2 text-body-m text-text-secondary">{t.label}</dt>
          <dd className="order-3 text-caption text-text-tertiary">{t.detail}</dd>
        </div>
      ))}
      <p className="col-span-full bg-bg-page px-6 py-2.5 text-caption text-text-tertiary">
        Čísla sa počítajú z dnešného dátumu.
      </p>
    </dl>
  );
}

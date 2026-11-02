"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
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
      detail: "1. 1. 2027 · zákon 406/2025 Z. z.",
    },
    {
      value: toEzdravie > 0 ? toEzdravie : null,
      suffix: "",
      label: toEzdravie > 0 ? "dní do identifikátora eZdravie pre ADOS" : "identifikátor eZdravie pre ADOS",
      detail: "1. 7. 2027 · harmonogram NCZI, nie je právne záväzný",
    },
  ];
}

const PLACEHOLDER: Tile[] = [
  { value: null, suffix: "", label: "deň pilotu Alma ADOS", detail: "od októbra 2026 · Arcidiecézna charita Košice" },
  { value: null, suffix: "", label: "dní do príspevku na pomoc pri odkázanosti", detail: "1. 1. 2027 · zákon 406/2025 Z. z." },
  { value: null, suffix: "", label: "dní do identifikátora eZdravie pre ADOS", detail: "1. 7. 2027 · harmonogram NCZI, nie je právne záväzný" },
];

/* Counts from 0 to the value once the number scrolls into view */
function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = `${to}${suffix}`;
      return;
    }
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration: 1.4,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`;
      },
    });
    const trigger = ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => tween.play() });
    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [to, suffix]);
  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
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
            {t.value === null ? (tiles ? "platí" : "—") : <CountUp to={t.value} suffix={t.suffix} />}
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

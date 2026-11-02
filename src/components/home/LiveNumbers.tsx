"use client";

import { useEffect, useState } from "react";
import { DATES } from "@/lib/nav";

/*
  Numbers computed from today's date in the visitor's browser (idea 5): which day of the pilot it is and how many
  days remain to the two legal milestones. Rendered after mount so the server and the client never disagree.
*/
const DAY = 86_400_000;

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / DAY);
}

function local(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

type Tile = { value: string; label: string; detail: string };

function compute(): Tile[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pilotDay = daysBetween(local(DATES.pilotStart), today) + 1;
  const toAllowance = daysBetween(today, local(DATES.allowance));
  const toEzdravie = daysBetween(today, local(DATES.ezdravie));
  return [
    {
      value: pilotDay > 0 ? `${pilotDay}.` : "0",
      label: "deň pilotu Alma ADOS",
      detail: "od októbra 2026 · Arcidiecézna charita Košice",
    },
    {
      value: toAllowance > 0 ? String(toAllowance) : "platí",
      label: toAllowance > 0 ? "dní do príspevku na pomoc pri odkázanosti" : "príspevok na pomoc pri odkázanosti",
      detail: "1. 1. 2027 · zákon 406/2025 Z. z.",
    },
    {
      value: toEzdravie > 0 ? String(toEzdravie) : "platí",
      label: toEzdravie > 0 ? "dní do identifikátora eZdravie pre ADOS" : "identifikátor eZdravie pre ADOS",
      detail: "1. 7. 2027 · harmonogram NCZI, nie je právne záväzný",
    },
  ];
}

export function LiveNumbers() {
  const [tiles, setTiles] = useState<Tile[] | null>(null);
  useEffect(() => {
    setTiles(compute());
  }, []);

  const shown = tiles ?? [
    { value: "—", label: "deň pilotu Alma ADOS", detail: "od októbra 2026 · Arcidiecézna charita Košice" },
    { value: "—", label: "dní do príspevku na pomoc pri odkázanosti", detail: "1. 1. 2027 · zákon 406/2025 Z. z." },
    { value: "—", label: "dní do identifikátora eZdravie pre ADOS", detail: "1. 7. 2027 · harmonogram NCZI, nie je právne záväzný" },
  ];

  return (
    <dl className="gsap-reveal grid gap-px overflow-hidden rounded-16 border border-border-default bg-border-default sm:grid-cols-3">
      {shown.map((t) => (
        <div key={t.label} className="flex flex-col gap-1 bg-bg-surface p-5">
          <dd className="order-1 text-h2 tabular-nums text-text-primary">{t.value}</dd>
          <dt className="order-2 text-body-s text-text-secondary">{t.label}</dt>
          <dd className="order-3 text-caption text-text-tertiary">{t.detail}</dd>
        </div>
      ))}
      <p className="col-span-full bg-bg-page px-5 py-2 text-caption text-text-tertiary">
        Čísla sa počítajú z dnešného dátumu.
      </p>
    </dl>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/gsap";

/*
  Čo sa mení a kedy: the verified milestones of 2026/2027 on a vertical line that is drawn by scrolling.
  The line grows to where the viewport's 60 % line crosses it; a milestone lights up once the line reaches it.
  With reduced motion everything is shown at once. Dates: zákon 406/2025 Z. z. (Čl. I účinný 31. 12. 2026,
  nárok najskôr za január 2027), zákon 136/2026 Z. z. (identifikátor eZdravie od 1. 7. 2027).
*/
const MILESTONES = [
  {
    date: "október 2026",
    title: "Alma ADOS beží v pilote",
    text: "Každodenná prevádzka sestier Arcidiecéznej charity Košice. Pripomienky z terénu idú do ďalšej verzie.",
    now: true,
  },
  {
    date: "31. 12. 2026",
    title: "Účinnosť zákona 406/2025 Z. z.",
    text: "Príspevok na pomoc pri odkázanosti. Záväzok poskytovať službu vo všeobecnom hospodárskom záujme sa zapisuje do IS SoS (§ 61a zákona 448/2008 Z. z.).",
  },
  {
    date: "január 2027",
    title: "Prvý mesiac s nárokom na príspevok",
    text: "Odkázaná osoba ho dostane z úradu práce po preukázaní zaplatenej úhrady, preto potrebuje od poskytovateľa mesačné vyúčtovanie hodín.",
  },
  {
    date: "1. 7. 2027",
    title: "Identifikátor eZdravie v dávkach ADOS",
    text: "Bez identifikátora záznamu v eZdravie poisťovňa výkon neuhradí (zákon 136/2026 Z. z.).",
  },
  {
    date: "2027",
    title: "Predaj Alma ADOS a piloty ďalších produktov",
    text: "DOS, Stacionár a Pobytové idú rovnakou cestou: najprv pilot s reálnym zariadením, potom predaj.",
  },
];

export function Timeline2027() {
  const trackRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const prog = progRef.current;
    const list = listRef.current;
    if (!track || !prog || !list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>("[data-ms]"));
    if (prefersReducedMotion()) {
      prog.style.height = "100%";
      items.forEach((m) => m.setAttribute("data-on", ""));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = track.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height));
      prog.style.height = `${p * 100}%`;
      const reach = r.top + r.height * p;
      items.forEach((m) => {
        const on = m.getBoundingClientRect().top + 10 <= reach + 1;
        if (on) m.setAttribute("data-on", "");
        else m.removeAttribute("data-on");
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-[480px_1fr] lg:gap-24">
      <h3 className="gsap-reveal text-h3 text-text-primary">Čo sa mení a kedy</h3>
      <div className="relative pl-11">
        <div ref={trackRef} aria-hidden="true" className="absolute bottom-2 left-[14px] top-2 w-0.5 rounded-full bg-border-default">
          <div ref={progRef} className="w-full rounded-full bg-accent" style={{ height: 0 }} />
        </div>
        <ol ref={listRef} className="flex flex-col gap-12">
          {MILESTONES.map((m) => (
            <li
              key={m.date}
              data-ms
              className={cx(
                "group relative flex flex-col gap-1 opacity-45 transition-[opacity,transform] duration-500 ease-out",
                "translate-x-1.5 data-on:translate-x-0 data-on:opacity-100",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[37px] top-1.5 size-3.5 rounded-full border-2 border-border-default bg-bg-page transition-[background-color,border-color,box-shadow] duration-300 group-data-on:border-accent group-data-on:bg-accent group-data-on:shadow-[0_0_0_5px_var(--color-accent-soft)]"
              />
              <span className="text-eyebrow text-accent-text">
                {m.date}
                {m.now && <span className="ml-1.5 normal-case tracking-normal text-text-tertiary">· prebieha</span>}
              </span>
              <span className="text-h4 text-text-primary">{m.title}</span>
              <span className="max-w-[56ch] text-body-m text-text-secondary">{m.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

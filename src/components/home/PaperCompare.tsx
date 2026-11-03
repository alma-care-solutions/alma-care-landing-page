"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { Caveat } from "next/font/google";
import { cx } from "@/lib/cx";

const hand = Caveat({ subsets: ["latin", "latin-ext"], weight: ["400", "600"], display: "swap" });

/*
  Paper / Alma comparison (idea 1): the same visit twice. Left a handwritten visit record on a printed form,
  as nurses fill it in today (illustration following the usual form, until a real scan from the pilot partner
  is available); right the real visit screen of the Alma ADOS nurse app during the same visit.
  The visit is the one from the hero phone: Pavol Novotný, 12. 10., 10:10, codes 3407 and 3423A.
*/
const FIELDS: { label: string; value: string; wide?: boolean }[] = [
  { label: "Pacient", value: "Novotný Pavol" },
  { label: "Rok narodenia", value: "1952" },
  { label: "Dátum návštevy", value: "12. 10. 2026" },
  { label: "Čas od – do", value: "10:10 – 11:10" },
  { label: "Diagnóza", value: "Z48.0 starostl. o chir. obväzy", wide: true },
  { label: "Výkony (kód)", value: "3407, 3423A" },
  { label: "TK / P / TT", value: "127/86 · 81 · 36,4" },
  { label: "Rana", value: "pooperačná PDK 4×5 cm, bez sekrécie, preväz", wide: true },
  { label: "Poznámka", value: "pacient nedopočuje – zvoniť dlhšie, kľúč u susedy", wide: true },
];

export function PaperCompare() {
  const [cut, setCut] = useState(50);
  const [touched, setTouched] = useState(false);
  const touchedRef = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // When the comparison scrolls into view, the divider swings once (50 → 64 → 40 → 50) to show it can be dragged;
  // it stops at once if the visitor takes over, and never runs with reduced motion.
  useEffect(() => {
    const box = boxRef.current;
    if (!box || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now() + 500;
        const keys: [number, number][] = [
          [0, 50],
          [0.4, 64],
          [0.8, 40],
          [1, 50],
        ];
        const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
        const tick = (now: number) => {
          if (touchedRef.current) return;
          const t = Math.min(1, Math.max(0, (now - start) / 2200));
          let i = 1;
          while (i < keys.length - 1 && keys[i][0] < t) i++;
          const [t0, v0] = keys[i - 1];
          const [t1, v1] = keys[i];
          setCut(v0 + (v1 - v0) * ease((t - t0) / (t1 - t0)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(box);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const takeOver = () => {
    touchedRef.current = true;
    setTouched(true);
  };

  return (
    <figure className="gsap-reveal flex w-full flex-col gap-3">
      <div
        ref={boxRef}
        className="relative aspect-square w-full select-none overflow-hidden rounded-16 bg-bg-muted ring-1 ring-border-default sm:aspect-[4/3]"
        style={{ ["--cut" as string]: `${cut}%` }}
      >
        {/* Paper: printed form with a handwritten record */}
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-[#e9e6df] p-[3%] @container">
          <div
            className="relative h-full w-full -rotate-[0.6deg] overflow-hidden bg-[#fcfbf6] p-[3.5%] text-[clamp(7px,1.55cqw,12px)] text-[#3a3f4a] shadow-[0_6px_24px_rgba(30,30,30,0.18),0_1px_0_rgba(0,0,0,0.05)]"
            style={{ backgroundImage: "radial-gradient(circle at 80% 10%, rgba(0,0,0,0.035), transparent 45%)" }}
          >
            <div className="flex items-start justify-between border-b-2 border-[#3a3f4a] pb-[1.5%]">
              <div>
                <p className="text-[1.15em] font-bold uppercase tracking-[0.06em]">Záznam o návšteve pacienta</p>
                <p className="text-[0.8em] uppercase tracking-[0.08em] text-[#6b7280]">
                  Agentúra domácej ošetrovateľskej starostlivosti · príloha k dokumentácii
                </p>
              </div>
              <p className="text-[0.75em] text-[#6b7280]">č. ____ / 2026</p>
            </div>
            <dl className="mt-[2.5%] grid grid-cols-2 gap-x-[4%]">
              {FIELDS.map((f) => (
                <div
                  key={f.label}
                  className={cx("flex items-baseline gap-[3%] border-b border-dotted border-[#9aa0ab] py-[1.6%]", f.wide && "col-span-2")}
                >
                  <dt className="shrink-0 text-[0.8em] uppercase tracking-[0.05em] text-[#6b7280]">{f.label}</dt>
                  <dd className={cx(hand.className, "truncate text-[1.75em] leading-none text-[#1d3f8c]")}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-[4%] grid grid-cols-2 gap-x-[6%]">
              <div className="border-t border-[#3a3f4a] pt-[2%] text-[0.75em] uppercase tracking-[0.05em] text-[#6b7280]">
                Podpis sestry
                <span className={cx(hand.className, "ml-[6%] text-[2.2em] normal-case tracking-normal text-[#1d3f8c]")}>M. Kováčová</span>
              </div>
              <div className="border-t border-[#3a3f4a] pt-[2%] text-[0.75em] uppercase tracking-[0.05em] text-[#6b7280]">
                Podpis pacienta
                <span className={cx(hand.className, "ml-[6%] text-[2.2em] normal-case tracking-normal text-[#1d3f8c]")}>Novotný</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alma ADOS: the real visit screen of the nurse app, whole, standing on a calm panel */}
        <div className="absolute inset-0 bg-accent-soft" style={{ clipPath: "inset(0 0 0 var(--cut))" }}>
          <div className="absolute inset-y-[4%] left-1/2 aspect-[1206/2622] -translate-x-1/2 overflow-hidden rounded-[7%/3.3%] shadow-[0_18px_40px_-12px_rgba(20,23,31,0.35)] ring-1 ring-black/10">
            <Image
              src="/images/phone-visit-ongoing-2610.png"
              alt="Aplikácia pre sestry Alma ADOS: prebiehajúca návšteva Pavla Novotného s výkonmi 3407 a 3423A, dekurzom a materiálom"
              fill
              quality={90}
              sizes="(min-width: 1280px) 240px, 40vw"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Divider and handle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent"
          style={{ left: "var(--cut)" }}
        >
          <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-text-inverse shadow-[0_6px_16px_rgba(20,23,31,0.25)] ring-[3px] ring-bg-surface/90">
            {!touched && <span className="absolute inset-0 rounded-full ring-2 ring-accent animate-ping-slow" />}
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 7 4 12l5 5" />
              <path d="m15 7 5 5-5 5" />
            </svg>
          </span>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 rounded-8 bg-bg-dark/70 px-2.5 py-1 text-caption font-medium text-text-inverse"
        >
          Papier
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 rounded-8 bg-bg-dark/70 px-2.5 py-1 text-caption font-medium text-text-inverse"
        >
          Alma ADOS
        </span>

        <label htmlFor={id} className="sr-only">
          Porovnanie papierového záznamu o návšteve a tej istej návštevy v aplikácii Alma ADOS
        </label>
        <input
          id={id}
          type="range"
          min={6}
          max={94}
          value={cut}
          onPointerDown={takeOver}
          onKeyDown={takeOver}
          onChange={(e) => {
            takeOver();
            setCut(Number(e.target.value));
          }}
          className="absolute inset-0 m-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="text-caption text-text-tertiary">
        Tá istá návšteva dvakrát: vľavo ručný záznam o návšteve (ilustrácia podľa bežného formulára), vpravo
        skutočná obrazovka návštevy v aplikácii pre sestry. Potiahnite predel.
      </figcaption>
    </figure>
  );
}

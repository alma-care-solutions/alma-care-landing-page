"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { Caveat } from "next/font/google";
import { cx } from "@/lib/cx";

const hand = Caveat({ subsets: ["latin", "latin-ext"], weight: ["400", "600"], display: "swap" });

/*
  Paper / Alma comparison (idea 1): the same visit twice. Left a handwritten visit record on a printed form,
  as nurses fill it in today (illustration following the usual form, until a real scan from the pilot partner
  is available); right the real Vykazovanie screen of Alma ADOS where such records wait for approval.
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
  const id = useId();

  return (
    <figure className="gsap-reveal flex w-full flex-col gap-3">
      <div
        className="relative aspect-[2400/1633] w-full select-none overflow-hidden rounded-16 bg-bg-muted ring-1 ring-border-default"
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
                  className={cx("flex items-baseline gap-[3%] border-b border-dotted border-[#9aa0ab] py-[1.4%]", f.wide && "col-span-2")}
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

        {/* Alma ADOS: real Vykazovanie screen */}
        <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 var(--cut))" }}>
          <Image
            src="/images/web-reporting-2610.png"
            alt="Webová aplikácia Alma ADOS, Vykazovanie: návštevy čakajúce na kontrolu s výkonmi a stavom"
            fill
            quality={90}
            sizes="(min-width: 1280px) 656px, 100vw"
            className="object-cover object-top"
          />
        </div>

        {/* Divider and handle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent"
          style={{ left: "var(--cut)" }}
        >
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full bg-accent px-2.5 py-1.5 text-[11px] font-semibold leading-none text-text-inverse shadow-[0_6px_16px_rgba(20,23,31,0.25)]">
            <span>◂</span>
            <span>▸</span>
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
          Porovnanie papierového záznamu o návšteve a obrazovky Vykazovanie v Alma ADOS
        </label>
        <input
          id={id}
          type="range"
          min={6}
          max={94}
          value={cut}
          onChange={(e) => setCut(Number(e.target.value))}
          className="absolute inset-0 m-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="text-caption text-text-tertiary">
        Tá istá návšteva dvakrát: vľavo ručný záznam o návšteve (ilustrácia podľa bežného formulára), vpravo
        skutočná obrazovka Vykazovanie v Alma ADOS, kde takéto záznamy čakajú na kontrolu. Potiahnite predel.
      </figcaption>
    </figure>
  );
}

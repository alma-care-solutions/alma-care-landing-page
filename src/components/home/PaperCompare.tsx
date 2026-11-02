"use client";

import Image from "next/image";
import { useId, useState } from "react";

/*
  Paper / Alma comparison (idea 1): the same day and the same nurses. Left a handwritten daily roster
  (illustration, until a real scanned form from the pilot partner is available), right the real
  "Dnes" screen of Alma ADOS. The visitor drags the divider.
*/
const ROWS = [
  { name: "Hojstričová", visits: "2 / 6", where: "Hornyáková?", note: "nevolala" },
  { name: "Kmecová", visits: "2 / 3", where: "Horváth", note: "" },
  { name: "Rigová", visits: "1 / 3", where: "Gecseová?", note: "volať!" },
  { name: "Pastírová", visits: "2 / 4", where: "Balážová", note: "" },
  { name: "Bérešová", visits: "2 / 4", where: "Nagyová", note: "" },
  { name: "Zelenayová", visits: "1 / 5", where: "Čekanová?", note: "mešká" },
];

export function PaperCompare() {
  const [cut, setCut] = useState(48);
  const id = useId();

  return (
    <figure className="gsap-reveal flex w-full flex-col gap-3">
      <div
        className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-16 ring-1 ring-border-default"
        style={{ ["--cut" as string]: `${cut}%` }}
      >
        {/* Paper */}
        <div aria-hidden="true" className="paper absolute inset-0 overflow-hidden p-[4%] text-[clamp(9px,1.9cqw,14px)] @container">
          <div className="flex items-baseline justify-between border-b border-[#c9c0a3] pb-1">
            <span className="text-[0.85em] font-semibold uppercase tracking-[0.08em] text-[#6b6450]">
              Rozpis sestier · pondelok 12. 10.
            </span>
            <span className="paper-hand text-[1.1em]">strana 1/2</span>
          </div>
          <table className="paper-hand mt-[2%] w-full border-collapse text-[1.25em] leading-[1.9]">
            <thead>
              <tr className="text-[0.7em] uppercase tracking-[0.06em] text-[#6b6450] [font-family:var(--font-sans)]">
                <th className="text-left font-semibold">Sestra</th>
                <th className="text-left font-semibold">Návštevy</th>
                <th className="text-left font-semibold">Kde je</th>
                <th className="text-left font-semibold">Pozn.</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.name} className={i % 2 ? "rotate-[0.2deg]" : "-rotate-[0.2deg]"}>
                  <td>{r.name}</td>
                  <td>{r.visits}</td>
                  <td className={r.where.endsWith("?") ? "text-[#8a5a2b]" : ""}>{r.where}</td>
                  <td className="text-[#a3342f]">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="paper-hand mt-[2%] text-[1.1em] text-[#8a5a2b]">VšZP dávka?? 496 výkonov, prepísať do piatku</p>
        </div>

        {/* Alma ADOS: real screen */}
        <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 var(--cut))" }}>
          <Image
            src="/images/web-dnes-2610.png"
            alt="Webová aplikácia Alma ADOS, Dnes: sestry v teréne so stavom návštev, pripravené dávky pre poisťovne"
            fill
            sizes="(min-width: 1280px) 656px, 100vw"
            className="object-cover object-left-top"
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
          Porovnanie papierového rozpisu a obrazovky Alma ADOS
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
        Rovnaký deň, rovnaké sestry: vľavo papierový rozpis (ilustrácia), vpravo skutočná obrazovka Alma ADOS s
        ukážkovými údajmi. Potiahnite predel.
      </figcaption>
    </figure>
  );
}

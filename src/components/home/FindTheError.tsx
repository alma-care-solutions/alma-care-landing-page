"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Caveat } from "next/font/google";
import { cx } from "@/lib/cx";
import { PhoneFrame } from "@/components/ui/Phone";

const hand = Caveat({ subsets: ["latin", "latin-ext"], weight: ["400", "600"], display: "swap" });

/*
  Nájdite chybu na papieri (replaces the paper / Alma slider): a handwritten visit record of the hero visit
  (Pavol Novotný, 12. 10., 10:10) with four real mistakes from practice. A click on a wrong field underlines it
  and shows how Alma prevents that mistake at the patient; a click on a correct field shakes and says so.
  The paper is an illustration following the usual form until a real scan from the pilot partner arrives.
*/
type ErrorKey = "datum" | "kod" | "rana" | "podpis";

const ERRORS: { key: ErrorKey; title: string; text: string }[] = [
  {
    key: "datum",
    title: "Dátum z minulého mesiaca",
    text: "Návšteva bola 12. 10., na papieri je 12. 9. Poisťovňa takú návštevu vráti. V Alme dátum a čas vznikajú z návštevy, ktorá práve beží, sestra ich nepíše.",
  },
  {
    key: "kod",
    title: "Nečitateľný kód výkonu",
    text: "„34Z3A“ neexistuje, mal to byť 3423A. V Alme sestra výkon odškrtne zo zoznamu naplánovaných, kód sa nedá pomýliť ani zle prepísať.",
  },
  {
    key: "rana",
    title: "Chýba rozmer rany",
    text: "Pri preväze rany treba zapísať veľkosť, bez nej sa výkon 3423A nedá obhájiť. Alma pri rane pýta dĺžku a šírku a bez nich návštevu nepustí na kontrolu.",
  },
  {
    key: "podpis",
    title: "Chýba podpis sestry",
    text: "Bez podpisu záznam neplatí a zistí sa to až pri kontrole. V Alme záznam potvrdzuje sestra v telefóne, s menom a časom, bez potvrdenia sa nič nezapíše.",
  },
];

type Field = { label: string; value: string; wide?: boolean; error?: ErrorKey };

const FIELDS: Field[] = [
  { label: "Pacient", value: "Novotný Pavol" },
  { label: "Rok narodenia", value: "1952" },
  { label: "Dátum návštevy", value: "12. 9. 2026", error: "datum" },
  { label: "Čas od – do", value: "10:10 – 11:10" },
  { label: "Diagnóza", value: "Z48.0 starostl. o chir. obväzy", wide: true },
  { label: "Výkony (kód)", value: "3407, 34Z3A", error: "kod" },
  { label: "TK / P / TT", value: "127/86 · 81 · 36,4" },
  { label: "Rana", value: "pooperačná PDK, bez sekrécie, preväz", wide: true, error: "rana" },
  { label: "Poznámka", value: "pacient nedopočuje – zvoniť dlhšie, kľúč u susedy", wide: true },
];

export function FindTheError({ intro }: { intro: ReactNode }) {
  const [found, setFound] = useState<ErrorKey[]>([]);
  const [shaking, setShaking] = useState<string | null>(null);
  const [okHint, setOkHint] = useState(false);
  const all = found.length === ERRORS.length;

  const hit = (field: string, error?: ErrorKey) => {
    if (!error) {
      setShaking(field);
      setOkHint(true);
      window.setTimeout(() => setShaking((s) => (s === field ? null : s)), 400);
      return;
    }
    setOkHint(false);
    setFound((f) => (f.includes(error) ? f : [...f, error]));
  };

  const hotClass = (field: string, error?: ErrorKey) =>
    cx(
      "focus-ring block w-full cursor-pointer rounded-[6px] text-left transition-[background-color,box-shadow] duration-200 hover:bg-accent/10",
      error && found.includes(error) && "bg-[#fbe9e6] shadow-[0_0_0_2px_#c0392b]",
      shaking === field && "motion-safe:animate-[shake_0.35s]",
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[480px_1fr] lg:gap-16">
      {/* Copy column */}
      <div className="gsap-reveal flex flex-col items-start gap-5">{intro}</div>

      {/* The paper */}
      <figure className="gsap-reveal flex flex-col gap-3 lg:row-span-2">
        <div className="rounded-16 bg-[#e9e6df] p-[4%] @container">
          <div
            className="relative -rotate-[0.5deg] bg-[#fcfbf6] p-[4%] text-[clamp(8px,1.8cqw,13px)] text-[#3a3f4a] shadow-[0_6px_24px_rgba(30,30,30,0.18),0_1px_0_rgba(0,0,0,0.05)]"
            style={{ backgroundImage: "radial-gradient(circle at 80% 10%, rgba(0,0,0,0.035), transparent 45%)" }}
          >
            <div className="flex items-start justify-between gap-2 border-b-2 border-[#3a3f4a] pb-[2%]">
              <div>
                <p className="text-[1.15em] font-bold uppercase tracking-[0.06em]">Záznam o návšteve pacienta</p>
                <p className="text-[0.8em] uppercase tracking-[0.08em] text-[#6b7280]">
                  Agentúra domácej ošetrovateľskej starostlivosti · príloha k dokumentácii
                </p>
              </div>
              <p className="text-[0.75em] text-[#6b7280]">č. ____ / 2026</p>
            </div>
            <dl className="mt-[3%] grid grid-cols-2 gap-x-[4%]">
              {FIELDS.map((f) => (
                <div key={f.label} className={cx("border-b border-dotted border-[#9aa0ab] py-[1.4%]", f.wide && "col-span-2")}>
                  <button
                    type="button"
                    onClick={() => hit(f.label, f.error)}
                    aria-pressed={f.error ? found.includes(f.error) : undefined}
                    className={cx(hotClass(f.label, f.error), "flex items-baseline gap-[3%] px-[1%] py-[0.6%]")}
                  >
                    <dt className="shrink-0 text-[0.8em] uppercase tracking-[0.05em] text-[#6b7280]">{f.label}</dt>
                    <dd
                      className={cx(
                        hand.className,
                        "min-w-0 truncate text-[1.8em] leading-none text-[#1d3f8c]",
                        f.error && found.includes(f.error) && "underline decoration-[#c0392b] decoration-wavy decoration-2 underline-offset-[0.12em]",
                      )}
                    >
                      {f.value}
                    </dd>
                  </button>
                </div>
              ))}
            </dl>
            <div className="mt-[5%] grid grid-cols-2 gap-x-[6%]">
              <button
                type="button"
                onClick={() => hit("podpis", "podpis")}
                aria-pressed={found.includes("podpis")}
                className={cx(hotClass("podpis", "podpis"), "min-h-[3.4em] border-t border-[#3a3f4a] pt-[2%] text-[0.75em] uppercase tracking-[0.05em] text-[#6b7280]")}
              >
                Podpis sestry
              </button>
              <button
                type="button"
                onClick={() => hit("podpis-pacienta")}
                className={cx(hotClass("podpis-pacienta"), "min-h-[3.4em] border-t border-[#3a3f4a] pt-[2%] text-[0.75em] uppercase tracking-[0.05em] text-[#6b7280]")}
              >
                Podpis pacienta
                <span className={cx(hand.className, "ml-[6%] text-[2.3em] normal-case tracking-normal text-[#1d3f8c]")}>Novotný</span>
              </button>
            </div>
          </div>
        </div>
        <figcaption className="text-caption text-text-tertiary">
          Ručný záznam tej istej návštevy, akú vidíte hore v telefóne (ilustrácia podľa bežného formulára). Štyri miesta sú zle,
          kliknite na ne.
        </figcaption>
      </figure>

      {/* Score, explanations, the same visit in Alma */}
      <div className="gsap-reveal flex flex-col gap-4" aria-live="polite">
        <div className="flex items-center justify-between gap-3 text-body-s text-text-secondary">
          <span>{all ? "Všetky štyri chyby nájdené" : `Našli ste ${found.length} zo ${ERRORS.length} chýb`}</span>
          <span className="flex gap-1.5" aria-hidden="true">
            {ERRORS.map((e, i) => (
              <i key={e.key} className={cx("block size-2.5 rounded-full", i < found.length ? "bg-[#c0392b]" : "bg-border-default")} />
            ))}
          </span>
        </div>
        <ol className="flex flex-col gap-2.5">
          {found.map((key, i) => {
            const e = ERRORS.find((x) => x.key === key)!;
            return (
              <li key={key} className="grid grid-cols-[22px_1fr] gap-3 rounded-12 border border-border-default bg-bg-surface p-4 animate-[fade-in_0.3s_ease-out]">
                <span className="flex size-[22px] items-center justify-center rounded-full bg-[#c0392b] text-[12px] font-bold text-text-inverse">
                  {i + 1}
                </span>
                <div>
                  <p className="text-label-m text-text-primary">{e.title}</p>
                  <p className="mt-0.5 text-body-s text-text-secondary">{e.text}</p>
                </div>
              </li>
            );
          })}
          {!all && (
            <li className="grid grid-cols-[22px_1fr] gap-3 rounded-12 border border-border-default bg-bg-surface p-4">
              <span className="flex size-[22px] items-center justify-center rounded-full bg-accent text-[12px] font-bold text-text-inverse">?</span>
              <div>
                <p className="text-label-m text-text-primary">{okHint ? "Toto je v poriadku" : "Hľadajte na papieri"}</p>
                <p className="mt-0.5 text-body-s text-text-secondary">
                  {okHint
                    ? "Tento údaj sedí. Chyby sú v dátume, v kódoch, pri rane a pri podpisoch."
                    : "Keď kliknete na správne pole, ukážeme, ako tej chybe Alma predchádza."}
                </p>
              </div>
            </li>
          )}
          {all && (
            <li className="grid grid-cols-[22px_1fr] gap-3 rounded-12 bg-accent-soft p-4 animate-[fade-in_0.3s_ease-out]">
              <span className="flex size-[22px] items-center justify-center rounded-full bg-status-success text-[12px] font-bold text-text-inverse">✓</span>
              <div>
                <p className="text-label-m text-text-primary">Každá z nich sa dnes zistí až v kancelárii</p>
                <p className="mt-0.5 text-body-s text-text-secondary">
                  S odstupom dní a telefonátom sestre. V Alme ich sestra nemá ako urobiť, lebo záznam vzniká u pacienta z návštevy,
                  ktorá práve beží.
                </p>
              </div>
            </li>
          )}
        </ol>
        <div className="flex items-start gap-4 rounded-12 bg-accent-soft p-4">
          {/* Width on a wrapper: PhoneFrame is w-full */}
          <div className="w-[88px] shrink-0">
            <PhoneFrame bezel="thin">
              <Image
                src="/images/phone-visit-ongoing-2610.png"
                alt="Prebiehajúca návšteva Pavla Novotného v aplikácii pre sestry Alma ADOS"
                fill
                sizes="88px"
                quality={90}
                className="object-cover object-top"
              />
            </PhoneFrame>
          </div>
          <p className="text-body-s text-text-secondary">
            <span className="font-semibold text-text-primary">Tá istá návšteva v Alme.</span> Dátum a čas sú z návštevy, výkony zo
            zoznamu, rana pýta rozmer, dekurz je povinný a záznam potvrdí sestra. Nič z toho sa nedá zabudnúť.
          </p>
        </div>
      </div>
    </div>
  );
}

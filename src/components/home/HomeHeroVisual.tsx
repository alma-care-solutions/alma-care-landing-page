"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cx } from "@/lib/cx";
import { hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { BrowserFrame } from "@/components/ui/Browser";
import { PhoneFrame } from "@/components/ui/Phone";
import { PreviewLabel } from "@/components/ui/PreviewLabel";

/*
  Real Alma ADOS screens in the home hero, with three behaviours:
  - the phone tells one visit in three real screens: the day plan, the visit before it starts, the visit running.
    Each step has one real tap target (the 10:10 row in the plan, the "Začať návštevu" button), a click on it moves
    on; the story also plays by itself. When the visit starts, the web gets the notification about the same visit
    (Pavol Novotný, 10:10, nurse Monika), so both screens tell one story (ideas 2 and 11).
  - the browser tilts a few degrees towards the cursor (idea 9),
  - a magnifier over the browser lets the visitor read the real rows (idea 13).
  Tilt and magnifier run only with a fine pointer and without reduced motion.
*/
type Step = {
  src: string;
  alt: string;
  caption: string;
  ms: number;
  notify: boolean;
  /** The real control on the screenshot that moves the story on, in % of the screen */
  tap?: { label: string; left: string; top: string; width: string; height: string };
};

const STEPS: Step[] = [
  {
    src: "/images/phone-plan-2610.png",
    alt: "Aplikácia pre sestry: plán návštev na deň",
    caption: "Plán dňa. Sestra otvorí návštevu Pavla Novotného o 10:10.",
    ms: 3800,
    notify: false,
    tap: { label: "Otvoriť návštevu Pavla Novotného o 10:10", left: "10%", top: "53.5%", width: "86%", height: "8.5%" },
  },
  {
    src: "/images/phone-visit-detail-2610.png",
    alt: "Aplikácia pre sestry: detail návštevy pred začatím s pacientom a plánovanými výkonmi",
    caption: "Pred návštevou: pacient, plánované výkony, posledné merania. Sestra začne návštevu.",
    ms: 3800,
    notify: false,
    tap: { label: "Začať návštevu", left: "4%", top: "81.3%", width: "92%", height: "5.8%" },
  },
  {
    src: "/images/phone-visit-ongoing-2610.png",
    alt: "Aplikácia pre sestry: prebiehajúca návšteva so záznamom výkonov",
    caption: "Návšteva beží. Kancelária vidí v tej istej chvíli, že začala.",
    ms: 5600,
    notify: false,
  },
];
STEPS[2].notify = true;

const WEB = {
  src: "/images/web-planning-2610.png",
  aspect: 2400 / 1633,
  alt: "Webová aplikácia Alma ADOS, Plánovanie: týždeň návštev rozdelený podľa sestier s časmi, kódmi výkonov a menami pacientov",
};
const ZOOM = 2;
const LENS = 176;

export function HomeHeroVisual() {
  const [step, setStep] = useState(0);
  const [fine, setFine] = useState(false);
  const [lensOn, setLensOn] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgBoxRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFine(hasFinePointer() && !prefersReducedMotion());
  }, []);

  // The story plays by itself in a loop; a click on the real control moves on at once (and restarts the timer)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = window.setTimeout(() => setStep((i) => (i + 1) % STEPS.length), STEPS[step].ms);
    return () => window.clearTimeout(t);
  }, [step]);

  const next = () => setStep((i) => (i + 1) % STEPS.length);
  const current = STEPS[step];
  const notify = current.notify;

  const onBrowserMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!fine) return;
    const tilt = tiltRef.current;
    const box = imgBoxRef.current;
    const lens = lensRef.current;
    if (!tilt || !box || !lens) return;

    // Tilt: a few degrees towards the cursor
    const tr = tilt.getBoundingClientRect();
    const rx = ((0.5 - (e.clientY - tr.top) / tr.height) * 5).toFixed(2);
    const ry = (((e.clientX - tr.left) / tr.width - 0.5) * 7).toFixed(2);
    tilt.style.transform = `perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg)`;

    // Magnifier over the screenshot area (below the browser chrome); object-cover object-top centres horizontally
    const r = box.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) {
      setLensOn(false);
      return;
    }
    const boxAspect = r.width / r.height;
    let w: number;
    let h: number;
    let ox = 0;
    if (WEB.aspect >= boxAspect) {
      h = r.height;
      w = h * WEB.aspect;
      ox = (r.width - w) / 2;
    } else {
      w = r.width;
      h = w / WEB.aspect;
    }
    lens.style.left = `${x - LENS / 2}px`;
    lens.style.top = `${y - LENS / 2}px`;
    lens.style.backgroundImage = `url(${WEB.src})`;
    lens.style.backgroundSize = `${w * ZOOM}px ${h * ZOOM}px`;
    lens.style.backgroundPosition = `${-((x - ox) * ZOOM - LENS / 2)}px ${-(y * ZOOM - LENS / 2)}px`;
    setLensOn(true);
  };

  const onBrowserLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
    setLensOn(false);
  };

  return (
    <figure data-hero="visual" className="flex w-full max-w-[1200px] flex-col items-center gap-5 self-center">
      <div className="relative w-full aspect-[1000/900] sm:aspect-[1200/718]">
        {/* Browser: Plánovanie; when the phone reaches the started visit, it receives the notification */}
        <div
          data-hero="browser"
          className="absolute left-[-12%] top-0 w-[124%] max-w-none sm:left-0 sm:w-[86.667%]"
          onPointerMove={onBrowserMove}
          onPointerLeave={onBrowserLeave}
        >
          <div
            ref={tiltRef}
            className="rounded-12 shadow-[0_2px_6px_rgba(20,23,31,0.06),0_24px_48px_-12px_rgba(20,23,31,0.1)] transition-transform duration-150 ease-out will-change-transform"
          >
            <BrowserFrame>
              <div ref={imgBoxRef} className={cx("relative aspect-[1200/780] w-full", fine && "cursor-zoom-in")}>
                <Image
                  src={WEB.src}
                  alt={WEB.alt}
                  fill
                  priority
                  quality={90}
                  sizes="(min-width: 1280px) 1040px, 124vw"
                  className="object-cover object-top"
                />
                {/* Notification in the web app about the visit started on the phone (same patient, time and nurse) */}
                <div
                  role="status"
                  aria-hidden={!notify}
                  className={cx(
                    "absolute right-[2.5%] top-[4%] w-[38%] min-w-[220px] rounded-12 bg-bg-surface p-3 shadow-[0_16px_40px_rgba(20,23,31,0.22)] ring-1 ring-border-default transition-all duration-500",
                    notify ? "translate-y-0 opacity-100 delay-300" : "pointer-events-none -translate-y-2 opacity-0",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-2">
                      <span className="absolute inset-0 rounded-full bg-status-success animate-ping-slow" />
                      <span className="relative size-2 rounded-full bg-status-success" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-status-success">
                      Návšteva začala
                    </span>
                    <span className="ml-auto text-[11px] tabular-nums text-text-tertiary">10:10</span>
                  </div>
                  <p className="mt-1.5 text-[14px] font-semibold leading-tight text-text-primary">Pavol Novotný</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-text-secondary">
                    Monika K. · 3407 Odmeranie TK, pulzu a teploty · 3423A Preväz rany
                  </p>
                </div>
                {/* Magnifier */}
                <div
                  ref={lensRef}
                  aria-hidden="true"
                  className={cx(
                    "pointer-events-none absolute z-10 rounded-full bg-bg-surface bg-no-repeat shadow-[0_12px_32px_rgba(20,23,31,0.3)] ring-2 ring-accent transition-opacity duration-150",
                    lensOn ? "opacity-100" : "opacity-0",
                  )}
                  style={{ width: LENS, height: LENS }}
                />
              </div>
            </BrowserFrame>
          </div>
        </div>

        {/* Phone: one visit in three screens; the real control on each screen moves the story on */}
        <div
          data-hero="phone-wrap"
          className="absolute left-[60%] top-[1.5%] w-[40%] sm:left-[75.333%] sm:top-[13.37%] sm:w-[24.667%]"
        >
          <div data-hero="phone">
            <PhoneFrame>
              {STEPS.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1280px) 280px, 40vw"
                  quality={90}
                  priority={i === 0}
                  className={cx("object-cover object-top transition-opacity duration-500", i === step ? "opacity-100" : "opacity-0")}
                  aria-hidden={i !== step}
                />
              ))}
              {current.tap && (
                <button
                  type="button"
                  onClick={next}
                  aria-label={`${current.tap.label} (ukážka)`}
                  className="focus-ring absolute cursor-pointer rounded-full"
                  style={{ left: current.tap.left, top: current.tap.top, width: current.tap.width, height: current.tap.height }}
                />
              )}
            </PhoneFrame>
          </div>
        </div>

        {/* Right of the app sidebar, so the label never covers its dark background */}
        <div data-hero="label" className="absolute bottom-[1%] left-[10%] sm:bottom-[4.4%] sm:left-[16.5%]">
          <PreviewLabel />
        </div>
      </div>

      <figcaption
        data-hero="caption"
        className="flex w-full max-w-[760px] flex-col items-center gap-1 text-center text-body-s text-text-tertiary"
      >
        <span key={step} className="animate-[fade-in_0.4s_ease-out] text-text-secondary">
          {current.caption}
        </span>
        <span>Obrazovky sú z testovacej verzie s ukážkovými údajmi.</span>
      </figcaption>
    </figure>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { cx } from "@/lib/cx";
import { hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { BrowserFrame } from "@/components/ui/Browser";
import { PhoneFrame } from "@/components/ui/Phone";
import { PreviewLabel } from "@/components/ui/PreviewLabel";

/*
  Real Alma ADOS screens in the home hero, with four behaviours:
  - the phone cycles through three real screens until the visitor taps it (idea 2),
  - a tap on "Začať návštevu" starts the visit: the phone shows the ongoing visit and the web switches to
    "Dnes" with the nurse's row highlighted (idea 11),
  - the browser tilts a few degrees towards the cursor (idea 9),
  - a magnifier over the browser lets the visitor read the real rows (idea 13).
  Tilt and magnifier run only with a fine pointer and without reduced motion.
*/
const PHONE_CYCLE = [
  { src: "/images/phone-today-2610.png", alt: "Aplikácia pre sestry: dnešný deň s poradím návštev" },
  { src: "/images/phone-plan-2610.png", alt: "Aplikácia pre sestry: plán návštev" },
  {
    src: "/images/phone-visit-detail-2610.png",
    alt: "Aplikácia pre sestry: detail návštevy pred začatím s pacientom, plánovanými výkonmi a tlačidlom Začať návštevu",
  },
];
const PHONE_ONGOING = {
  src: "/images/phone-visit-ongoing-2610.png",
  alt: "Aplikácia pre sestry: prebiehajúca návšteva so záznamom výkonov",
};
const WEB_PLANNING = {
  src: "/images/web-planning-2610.png",
  aspect: 2400 / 1633,
  left: false,
  alt: "Webová aplikácia Alma ADOS, Plánovanie: týždeň návštev rozdelený podľa sestier s časmi, kódmi výkonov a menami pacientov",
};
const WEB_TODAY = {
  src: "/images/web-dnes-2610.png",
  aspect: 2400 / 1099,
  left: true,
  alt: "Webová aplikácia Alma ADOS, Dnes: sestry v teréne, stav ich návštev a mapa",
};
const CYCLE_MS = 3600;
const TAP_INDEX = 2; // the visit detail screen with the "Začať návštevu" button
const ZOOM = 2;
const LENS = 176;

export function HomeHeroVisual() {
  const [idx, setIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fine, setFine] = useState(false);
  const [lensOn, setLensOn] = useState(false);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgBoxRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFine(hasFinePointer() && !prefersReducedMotion());
  }, []);

  // The phone cycles through real screens until the visitor taps it
  useEffect(() => {
    if (started || paused || prefersReducedMotion()) return;
    const t = window.setTimeout(() => setIdx((i) => (i + 1) % PHONE_CYCLE.length), CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [idx, started, paused]);

  const toggleVisit = () => setStarted((s) => !s);

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

    // Magnifier over the screenshot area (below the browser chrome)
    const r = box.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (x < 0 || y < 0 || x > r.width || y > r.height) {
      setLensOn(false);
      return;
    }
    const web = started ? WEB_TODAY : WEB_PLANNING;
    const boxAspect = r.width / r.height;
    let w: number;
    let h: number;
    let ox = 0;
    if (web.aspect >= boxAspect) {
      // object-cover crops horizontally: object-top centres, object-left-top keeps the left edge
      h = r.height;
      w = h * web.aspect;
      ox = web.left ? 0 : (r.width - w) / 2;
    } else {
      w = r.width;
      h = w / web.aspect;
    }
    lens.style.left = `${x - LENS / 2}px`;
    lens.style.top = `${y - LENS / 2}px`;
    lens.style.backgroundImage = `url(${web.src})`;
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
        {/* Browser: Plánovanie, after the tap Dnes with the nurse's row highlighted */}
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
                  src={WEB_PLANNING.src}
                  alt={WEB_PLANNING.alt}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1040px, 124vw"
                  className={cx("object-cover object-top transition-opacity duration-500", started && "opacity-0")}
                />
                <Image
                  src={WEB_TODAY.src}
                  alt={WEB_TODAY.alt}
                  fill
                  sizes="(min-width: 1280px) 1040px, 124vw"
                  className={cx("object-cover object-left-top transition-opacity duration-500", !started && "opacity-0")}
                  aria-hidden={!started}
                />
                {/* Highlight of the nurse's row in "Sestry dnes" (position relative to the cropped Dnes screenshot) */}
                <div
                  aria-hidden="true"
                  className={cx(
                    "pointer-events-none absolute transition-opacity duration-500",
                    started ? "opacity-100 delay-300" : "opacity-0",
                  )}
                  style={{ left: "16.4%", top: "61.6%", width: "76.6%", height: "5.4%" }}
                >
                  <span className="absolute inset-0 rounded-8 bg-accent/10 ring-2 ring-accent" />
                  <span className="absolute -top-8 left-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium leading-none text-text-inverse shadow-[0_6px_16px_rgba(20,23,31,0.25)]">
                    <span className="size-1.5 rounded-full bg-text-inverse" />
                    Návšteva práve začala
                  </span>
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

        {/* Phone: cycles through screens; a tap starts the visit */}
        <div
          data-hero="phone-wrap"
          className="absolute left-[60%] top-[1.5%] w-[40%] sm:left-[75.333%] sm:top-[13.37%] sm:w-[24.667%]"
        >
          <div data-hero="phone" className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={toggleVisit}
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
              aria-pressed={started}
              aria-label={started ? "Ukončiť ukážku návštevy" : "Začať návštevu (ukážka): telefón aj web zareagujú"}
              className="focus-ring block w-full cursor-pointer rounded-[12.4%/5.9%] text-left"
            >
              <PhoneFrame>
                {PHONE_CYCLE.map((s, i) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 1280px) 280px, 40vw"
                    priority={i === 0}
                    className={cx(
                      "object-cover object-top transition-opacity duration-500",
                      !started && i === idx ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden={started || i !== idx}
                  />
                ))}
                <Image
                  src={PHONE_ONGOING.src}
                  alt={PHONE_ONGOING.alt}
                  fill
                  sizes="(min-width: 1280px) 280px, 40vw"
                  className={cx("object-cover object-top transition-opacity duration-500", !started && "opacity-0")}
                  aria-hidden={!started}
                />
                {/* Tap target over the real "Začať návštevu" button */}
                {!started && idx === TAP_INDEX && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[4%] top-[81.4%] h-[5.6%] w-[92%] rounded-full ring-2 ring-text-inverse/80"
                  >
                    <span className="absolute inset-0 rounded-full ring-2 ring-text-inverse animate-ping-slow" />
                  </span>
                )}
              </PhoneFrame>
            </button>
            {/* Progress of the cycling screens */}
            <div aria-hidden="true" className="flex gap-1.5 px-[6%]">
              {PHONE_CYCLE.map((s, i) => (
                <span key={s.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-border-default">
                  <span
                    key={`${i}-${idx}-${started}`}
                    className={cx(
                      "block h-full origin-left rounded-full bg-accent",
                      started ? "scale-x-0" : i < idx ? "scale-x-100" : i === idx ? "hero-cycle-fill" : "scale-x-0",
                    )}
                    style={i === idx && !started ? { animationDuration: `${CYCLE_MS}ms`, animationPlayState: paused ? "paused" : "running" } : undefined}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right of the app sidebar, so the label never covers its dark background */}
        <div data-hero="label" className="absolute bottom-[1%] left-[10%] sm:bottom-[4.4%] sm:left-[16.5%]">
          <PreviewLabel />
        </div>
      </div>

      <figcaption
        data-hero="caption"
        aria-live="polite"
        className="flex w-full max-w-[760px] flex-col items-center gap-2 text-center text-body-s text-text-tertiary sm:flex-row sm:justify-center sm:gap-3"
      >
        {started ? (
          <>
            <span>Sestra začala návštevu v telefóne. Kancelária to vidí v tej istej chvíli.</span>
            <button
              type="button"
              onClick={toggleVisit}
              className="focus-ring rounded-[4px] text-label-s text-accent-text underline-offset-2 hover:underline"
            >
              Vrátiť späť
            </button>
          </>
        ) : (
          <span>Ťuknite na telefón a pozrite, čo uvidí kancelária. Obrazovky sú z testovacej verzie s ukážkovými údajmi.</span>
        )}
      </figcaption>
    </figure>
  );
}

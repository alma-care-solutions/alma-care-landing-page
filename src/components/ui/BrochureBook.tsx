"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/gsap";
import { BROCHURE } from "@/lib/brochure";

/*
  The product brochure as a book (idea 6): the 22 pages of the PDF (public/images/brozura) in a full-screen
  overlay with a page-turn animation. Desktop shows spreads (cover alone, then 2–3, 4–5 …), narrow screens
  one page at a time. The download link stays in the bar. Opened from BrochureBookButton.
*/
const N = 22;
const W = 910;
const H = 1287;
const FLIP_MS = 900;
const src = (i: number) => `/images/brozura/strana-${String(i).padStart(2, "0")}.jpg`;

type Flip = { dir: "next" | "prev"; front: number; back: number } | null;

function Page({ n, priority = false }: { n: number; priority?: boolean }) {
  return (
    <Image
      src={src(n)}
      alt={`Brožúra Alma ADOS, strana ${n}`}
      width={W}
      height={H}
      sizes="(min-width: 700px) 42vw, 88vw"
      quality={90}
      priority={priority}
      className="block h-full w-full object-cover"
    />
  );
}

export function BrochureBook({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [single, setSingle] = useState(false);
  const [s, setS] = useState(0); // 0 = cover; spread k = pages 2k and 2k+1; single mode: page s (1-based), 0 = cover
  const [flip, setFlip] = useState<Flip>(null);
  const [going, setGoing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const busy = useRef(false);

  const pagesAt = useCallback(
    (idx: number) => {
      if (single) return { l: null, r: idx === 0 ? 1 : idx };
      if (idx === 0) return { l: null, r: 1 };
      const l = 2 * idx;
      const r = 2 * idx + 1;
      return { l: l <= N ? l : null, r: r <= N ? r : null };
    },
    [single],
  );
  const maxS = single ? N : Math.ceil((N - 1) / 2);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 699px)");
    const apply = () => setSingle(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, s, single]);

  const turn = (target: number, dir: "next" | "prev") => {
    if (busy.current || target < 0 || target > maxS) return;
    const from = pagesAt(s);
    const to = pagesAt(target);
    const front = dir === "next" ? (single ? from.r : from.r) : single ? from.r : from.l;
    const backPage = dir === "next" ? (single ? to.r : to.l) : single ? to.r : to.r;
    if (!front || prefersReducedMotion()) {
      setS(target);
      return;
    }
    busy.current = true;
    setFlip({ dir, front, back: backPage ?? front });
    setS(target);
    requestAnimationFrame(() => requestAnimationFrame(() => setGoing(true)));
    window.setTimeout(() => {
      setFlip(null);
      setGoing(false);
      busy.current = false;
    }, FLIP_MS + 20);
  };
  const next = () => turn(s + 1, "next");
  const back = () => turn(s - 1, "prev");

  if (!open) return null;
  const p = pagesAt(s);
  // Rendered through a portal: the section column carries a transform from the reveal animation, which would
  // otherwise trap the fixed overlay inside the column.
  // During a flip the page under the flipper is the one being revealed, so the base layer shows the target spread
  const info = single
    ? `Strana ${p.r} / ${N}`
    : p.l && p.r
      ? `Strany ${p.l}–${p.r} / ${N}`
      : p.l
        ? `Strana ${p.l} / ${N}`
        : "Obálka";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Produktová brožúra Alma ADOS"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4 bg-bg-dark/95 px-4 py-6 animate-[fade-in_0.25s_ease-out]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Zavrieť brožúru"
        className="focus-ring absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-text-inverse/10 text-text-inverse hover:bg-text-inverse/20"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>

      <div
        className={cx(
          "relative max-w-full select-none [perspective:2400px]",
          single ? "[--pw:min(88vw,calc((100dvh-150px)*0.707))]" : "[--pw:min(42vw,calc((100dvh-150px)*0.707))]",
        )}
        style={{ width: single ? "var(--pw)" : "calc(var(--pw) * 2)", height: "calc(var(--pw) * 1287 / 910)" }}
      >
        {/* Base layer: the spread currently shown (during a flip, the target spread) */}
        {!single && p.l && (
          <div className="absolute left-0 top-0 h-full w-[var(--pw)] overflow-hidden rounded-[4px] bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(to_left,rgba(0,0,0,0.18),transparent_18%)]">
            <Page n={p.l} />
          </div>
        )}
        {p.r && (
          <div
            className={cx(
              "absolute top-0 h-full w-[var(--pw)] overflow-hidden rounded-[4px] bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] after:pointer-events-none after:absolute after:inset-0",
              single ? "left-0" : "left-[var(--pw)] after:bg-[linear-gradient(to_right,rgba(0,0,0,0.18),transparent_18%)]",
            )}
          >
            <Page n={p.r} priority />
          </div>
        )}

        {/* The turning page: front face and back face around the spine */}
        {flip && (
          <div
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute top-0 z-10 h-full w-[var(--pw)] [transform-style:preserve-3d] transition-transform duration-[900ms] ease-[cubic-bezier(0.4,0.05,0.2,1)]",
              flip.dir === "next"
                ? cx(single ? "left-0" : "left-[var(--pw)]", "origin-left", going && "[transform:rotateY(-180deg)]")
                : cx("left-0 origin-right", going && "[transform:rotateY(180deg)]"),
            )}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] [backface-visibility:hidden]">
              <Page n={flip.front} />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-[4px] bg-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <Page n={flip.back} />
            </div>
          </div>
        )}

        <button type="button" onClick={back} aria-label="Predchádzajúca strana" className="focus-ring absolute left-0 top-0 z-20 h-full w-1/2 cursor-pointer rounded-l-[4px]" />
        <button type="button" onClick={next} aria-label="Ďalšia strana" className="focus-ring absolute right-0 top-0 z-20 h-full w-1/2 cursor-pointer rounded-r-[4px]" />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-body-s text-text-inverse-muted tabular-nums">
        <button type="button" onClick={back} disabled={s <= 0} className="focus-ring rounded-8 bg-text-inverse/10 px-3 py-1.5 text-label-s text-text-inverse hover:bg-text-inverse/20 disabled:opacity-40">
          ← Späť
        </button>
        <span>{info}</span>
        <button type="button" onClick={next} disabled={s >= maxS} className="focus-ring rounded-8 bg-text-inverse/10 px-3 py-1.5 text-label-s text-text-inverse hover:bg-text-inverse/20 disabled:opacity-40">
          Ďalej →
        </button>
        <a href={BROCHURE.href} download className="focus-ring rounded-[4px] text-label-s text-accent-on-dark underline-offset-2 hover:underline">
          Stiahnuť PDF ({BROCHURE.meta.replace("PDF · ", "")})
        </a>
      </div>
    </div>,
    document.body,
  );
}

/* Home page button: opens the book instead of downloading; the PDF link lives inside the book */
export function BrochureBookButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group focus-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-12 border border-accent/40 bg-accent-soft px-[18px] py-2.5 text-[14px] font-medium leading-[1.3] text-accent-text shadow-[0_8px_24px_-12px_rgba(13,127,129,0.6)] transition-[background-color,color,border-color,transform] duration-150 hover:border-accent active:scale-[0.98]"
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-text-inverse motion-safe:animate-bob">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 0 4 23z" />
            <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 1 2.5 2z" />
          </svg>
        </span>
        <span className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span>Prelistovať brožúru</span>
          <span className="text-caption text-accent-text/70">22 strán</span>
        </span>
      </button>
      <BrochureBook open={open} onClose={() => setOpen(false)} />
    </>
  );
}

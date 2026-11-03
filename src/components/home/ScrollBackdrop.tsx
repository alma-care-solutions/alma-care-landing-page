"use client";

import { useEffect } from "react";

/*
  The page background flows from section to section instead of switching at a hard edge: every home section
  carries data-bg="page" | "surface" | "dark" and the body colour is mixed between the current section's colour
  and the next one's over the last part of the viewport before the next section starts. Sections themselves are
  transparent (the dark contact section too, HomeContact blend, so there is never a hard edge).
*/
const TOKEN: Record<string, string> = {
  page: "--color-bg-page",
  surface: "--color-bg-surface",
  dark: "--color-bg-dark",
};

function rgb(css: string): [number, number, number] | null {
  const m = css.trim().match(/^#([0-9a-f]{6})$/i);
  if (!m) return null;
  const h = m[1];
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function ScrollBackdrop() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[data-bg]"));
    if (!sections.length) return;
    const style = getComputedStyle(document.documentElement);
    const colours = new Map<string, [number, number, number]>();
    for (const key of Object.keys(TOKEN)) {
      const c = rgb(style.getPropertyValue(TOKEN[key]));
      if (c) colours.set(key, c);
    }
    const body = document.body;
    const prev = body.style.backgroundColor;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const mid = window.scrollY + vh * 0.5;
      let cur = sections[0];
      let nxt: HTMLElement | null = null;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= mid) {
          cur = sections[i];
          nxt = sections[i + 1] ?? null;
        }
      }
      const a = colours.get(cur.dataset.bg ?? "page");
      if (!a) return;
      let col = a;
      if (nxt) {
        const b = colours.get(nxt.dataset.bg ?? "page");
        // the blend runs over the last 60 % of the viewport before the next section reaches the middle
        const span = vh * 0.6;
        const t = Math.max(0, Math.min(1, (mid - (nxt.offsetTop - span)) / span));
        if (b && t > 0) col = [0, 1, 2].map((i) => Math.round(a[i] + (b[i] - a[i]) * t)) as [number, number, number];
      }
      body.style.backgroundColor = `rgb(${col[0]}, ${col[1]}, ${col[2]})`;
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
      body.style.backgroundColor = prev;
    };
  }, []);
  return null;
}

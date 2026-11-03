"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { prefersReducedMotion } from "@/lib/gsap";

/*
  A paragraph that is "read" by scrolling: the words start light and darken one after another as the
  paragraph travels up the viewport (from 85 % to about 35 % of its height). Scrolling back lightens them again.
  With reduced motion the text is simply dark.
*/
export function TextFill({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-w]"));
    if (prefersReducedMotion()) {
      spans.forEach((s) => s.setAttribute("data-on", ""));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.45)));
      const n = Math.round(p * spans.length);
      spans.forEach((s, i) => {
        if (i < n) s.setAttribute("data-on", "");
        else s.removeAttribute("data-on");
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
  }, [text]);

  return (
    <span ref={ref} className={cx("text-text-primary", className)}>
      {words.map((w, i) => (
        <span key={i} data-w className="text-text-tertiary/45 transition-colors duration-200 data-on:text-current">
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { cx } from "@/lib/cx";

/*
  Soft light that follows the cursor on a dark section (idea 10). Pure CSS variables, no re-renders;
  invisible on touch devices and with reduced motion (the gradient simply stays put).
*/
export function Spotlight({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={onMove} className={cx("relative", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(520px_circle_at_var(--mx,30%)_var(--my,20%),rgba(63,169,171,0.18),transparent_60%)] motion-safe:[@media(pointer:fine)]:opacity-100"
      />
      {children}
    </div>
  );
}

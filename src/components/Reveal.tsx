"use client";

import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";

/*
  Page-wide scroll animations:
  .gsap-reveal        - subtle fade-up on entering the viewport (elements already in view are not hidden);
                        h2 headings instead rise line by line from behind a mask (SplitText)
  [data-fx="line"]    - line "draws" in from the left (scaleX)
  [data-fx="pop"]     - element pops in (scale + fade)
  [data-fx="float"]   - decor floats gently up and down
  [data-fx="breathe"] - decor slowly "breathes" (scale)
*/
export function Reveal() {
  useGSAP(() => {
    // Web fonts can re-wrap text after the first measurement; re-measure pinned sections once they are in
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (prefersReducedMotion()) return;
    const vh = window.innerHeight;

    const below = gsap.utils.toArray<HTMLElement>(".gsap-reveal").filter((el) => el.getBoundingClientRect().top > vh * 0.9);
    const headings = below.filter((el) => el.tagName === "H2");
    const els = below.filter((el) => el.tagName !== "H2");

    // Headings: each line rises from behind its own mask, 90 ms apart; re-split when fonts load or lines re-wrap
    headings.forEach((h) => {
      SplitText.create(h, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: h, start: "top 88%", once: true },
          }),
      });
    });
    if (els.length) {
      gsap.set(els, { opacity: 0, y: 20 });
      ScrollTrigger.batch(els, {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.07, overwrite: true });
          const bars = batch.flatMap((el) => Array.from(el.querySelectorAll<HTMLElement>(".eyebrow-bar")));
          if (bars.length) {
            gsap.from(bars, { scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power2.out", delay: 0.15 });
          }
        },
      });
    }

    const lines = gsap.utils.toArray<HTMLElement>("[data-fx='line']");
    if (lines.length) {
      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.batch(lines, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { scaleX: 1, duration: 1.1, ease: "power2.out", stagger: 0.1, overwrite: true }),
      });
    }

    const pops = gsap.utils.toArray<HTMLElement>("[data-fx='pop']");
    if (pops.length) {
      gsap.set(pops, { scale: 0.92, autoAlpha: 0, transformOrigin: "center" });
      ScrollTrigger.batch(pops, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "power2.out", stagger: 0.1, delay: 0.25, overwrite: true }),
      });
    }

    gsap.utils.toArray<HTMLElement>("[data-fx='float']").forEach((el, i) => {
      gsap.to(el, { y: -12, duration: 5 + (i % 3), ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

    gsap.utils.toArray<HTMLElement>("[data-fx='breathe']").forEach((el, i) => {
      gsap.to(el, { scale: 1.05, transformOrigin: "center", duration: 7 + i, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });
  });
  return null;
}

"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { PRELOADER_DONE_EVENT } from "@/components/Preloader";

/*
  Hero intro sequence (starts after the preloader), phone parallax and subtle decor motion.
  Also: the pen stroke under "Nie papierom." (home page) and the dots travelling along the routes.
  Respects prefers-reduced-motion.
*/
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(ref);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Page opened in a hidden tab (rAF is paused): skip the intro, content stays visible
        if (document.visibilityState !== "visible") return;

        const tl = gsap.timeline({ defaults: { ease: "power2.out" }, paused: true });
        // h1 and the browser visual are LCP candidates: animate them by translation only (no opacity) so LCP stays early
        tl.from(q("[data-hero='decor'], [data-hero='route']"), { autoAlpha: 0, duration: 1.4, ease: "power2.out" }, 0)
          .from(q("[data-hero='copy'] > :not(h1)"), { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.09 }, 0.1)
          .from(q("[data-hero='copy'] > h1"), { y: 26, duration: 0.8 }, 0.15)
          .from(q("[data-hero='browser']"), { y: 56, duration: 1.1 }, 0.5)
          .from(q("[data-hero='phone']"), { y: 90, rotate: 2.5, autoAlpha: 0, duration: 1.1 }, 0.7)
          .from(q("[data-hero='label'], [data-hero='caption']"), { y: 10, autoAlpha: 0, duration: 0.6, stagger: 0.12 }, 1.2);

        // Pen stroke under "Nie papierom." draws itself once the headline has landed
        const pen = q<SVGPathElement>("[data-hero='pen'] path")[0];
        if (pen) {
          const len = pen.getTotalLength();
          gsap.set(pen, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(pen, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.95);
        }

        // Intro starts only after the preloader (if it was not shown, the flag is set immediately)
        const start = () => tl.play();
        if (window.__adosPreloaderDone) start();
        else window.addEventListener(PRELOADER_DONE_EVENT, start, { once: true });

        // Blobs float gently
        gsap.to(q("[data-hero-blob]"), {
          y: -18,
          x: 10,
          duration: 7,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          stagger: { each: 1.2, from: "random" },
        });

        // Routes: dashes slowly "march" along the path
        q<SVGPathElement>("[data-hero='route'] path").forEach((path) => {
          gsap.to(path, { strokeDashoffset: -22, duration: 2.4, ease: "none", repeat: -1 });
        });

        // Route dots: a nurse travels from stop to stop, pausing at each house
        q<SVGSVGElement>("[data-hero='route']").forEach((svg, i) => {
          const path = svg.querySelector("path");
          const dot = svg.querySelector("[data-hero='route-dot']");
          if (!path || !dot) return;
          const mp = (start: number, end: number) => ({ path, align: path, alignOrigin: [0.5, 0.5] as [number, number], start, end });
          gsap
            .timeline({ repeat: -1, repeatDelay: 1.6, delay: 1.8 + i * 0.9, defaults: { ease: "power1.inOut" } })
            .set(dot, { motionPath: mp(0, 0) })
            .to(dot, { motionPath: mp(0, 0.5), duration: 3.4 })
            .to(dot, { motionPath: mp(0.5, 1), duration: 3.4 }, "+=1.4");
        });

        // Parallax: the phone moves slower than the browser on scroll
        gsap.to(q("[data-hero='phone-wrap']"), {
          y: -56,
          ease: "none",
          scrollTrigger: {
            trigger: q("[data-hero='visual']")[0],
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });

        return () => window.removeEventListener(PRELOADER_DONE_EVENT, start);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}

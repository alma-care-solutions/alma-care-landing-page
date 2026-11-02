import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* Sticky header height (with the product bar on product pages) + gap: anchor targets and pinned panels stop below it */
export function headerOffset(gap = 12) {
  const header = typeof document !== "undefined" ? document.querySelector<HTMLElement>("body > header") : null;
  return (header?.offsetHeight ?? 64) + gap;
}

/*
  Anchor hrefs on the site:
  "#x"        section on the current page
  "/#x"       section on the home page
  "/ados#x"   section on a subpage
*/
export function isHashHref(href: string) {
  return href.includes("#");
}

export function hashId(href: string) {
  return href.slice(href.indexOf("#") + 1);
}

export function hashPath(href: string) {
  const i = href.indexOf("#");
  return i > 0 ? href.slice(0, i) : "";
}

function normalizePath(p: string) {
  return p.length > 1 ? p.replace(/\/$/, "") : p;
}

/* Does the anchor belong to this page? ("#x" always, "/x#y" only when /x is the current page) */
export function isLocalHash(href: string) {
  if (!isHashHref(href)) return false;
  const path = hashPath(href);
  if (!path) return true;
  return normalizePath(path) === normalizePath(window.location.pathname);
}

function focusElement(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.style.outline = "none";
  }
  el.focus({ preventScroll: true });
}

/*
  Smooth scroll to a section (GSAP ScrollToPlugin) + focus move.
  focusSelector: element that should receive focus (e.g. the first form field);
  only used with a fine pointer (mouse), on touch it would open the keyboard.
*/
export function scrollToTarget(href: string, focusSelector?: string) {
  const el = document.getElementById(hashId(href));
  if (!el) return false;
  const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - headerOffset());

  const finish = () => {
    history.replaceState(null, "", `#${el.id}`);
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const focusEl = focusSelector && finePointer ? document.querySelector<HTMLElement>(focusSelector) : null;
    focusElement(focusEl ?? el);
  };

  if (prefersReducedMotion()) {
    window.scrollTo({ top: y });
    finish();
    return true;
  }
  gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: 0.9,
    ease: "power2.inOut",
    overwrite: "auto",
    onComplete: finish,
  });
  return true;
}

/* Anchor to another page: remember the target, navigate without a hash (no native jump)
   and scroll smoothly after load (HashScroll). */
const PENDING_KEY = "alma-scroll-target";

export function rememberTarget(href: string, focusSelector?: string) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify({ id: hashId(href), focus: focusSelector ?? null }));
  } catch {
    /* private mode */
  }
}

/* Read only (no removal): in dev StrictMode the effect runs twice, so we clear only on use */
export function peekPendingTarget(): { id: string; focus: string | null } | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as { id: string; focus: string | null }) : null;
  } catch {
    return null;
  }
}

export function clearPendingTarget() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* private mode */
  }
}

type Router = { push: (href: string) => void };

/* Shared handler for all anchors (NavLink, Button, AnchorLink) */
export function handleAnchorClick(
  e: { defaultPrevented: boolean; button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean; preventDefault: () => void },
  href: string,
  router: Router,
  focusSelector?: string,
) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (!isHashHref(href)) return;
  if (isLocalHash(href)) {
    if (scrollToTarget(href, focusSelector)) e.preventDefault();
    return;
  }
  // "/x#y" from another page
  e.preventDefault();
  rememberTarget(href, focusSelector);
  router.push(hashPath(href) || "/");
}

export function scrollToTop() {
  const finish = () => {
    history.replaceState(null, "", window.location.pathname);
    document.getElementById("top")?.focus({ preventScroll: true });
  };
  if (prefersReducedMotion()) {
    window.scrollTo({ top: 0 });
    finish();
    return;
  }
  gsap.to(window, { scrollTo: { y: 0, autoKill: false }, duration: 0.8, ease: "power2.inOut", overwrite: "auto", onComplete: finish });
}

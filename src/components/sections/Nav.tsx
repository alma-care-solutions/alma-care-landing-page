"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cx } from "@/lib/cx";
import { Logo } from "@/components/ui/Logo";
import { NavLink } from "@/components/ui/NavLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrochureButton } from "@/components/ui/BrochureButton";
import { Icon } from "@/components/ui/Icon";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { ProductScreen } from "@/components/ui/ScreenCrop";
import { NAV_LINKS, PRODUCTS, CONTACT, type Product } from "@/lib/nav";
import { BROCHURE } from "@/lib/brochure";
import { handleAnchorClick } from "@/lib/scroll";

/*
  Site header, the same on every page:
  Produkty (dropdown with a preview of the hovered product), O Alme (home page anchor), Kontakt (form on this page),
  CTA "Dohodnúť si ukážku". On scroll the header gets compact, a shadow and a reading-progress line; the item of the
  section in view is underlined. Product pages add a product bar: breadcrumb, in-page links and the status badge.
*/
export function Nav({
  sectionIds = [],
  product,
  sectionLinks = [],
  brochure = false,
}: {
  /** Section ids on this page; the menu item that covers them gets the active state */
  sectionIds?: readonly string[];
  /** Product page: shows the product bar under the header */
  product?: Product;
  /** In-page links shown in the product bar (desktop) */
  sectionLinks?: readonly { href: string; label: string }[];
  /** Brochure download in the header (Alma ADOS page) */
  brochure?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useGSAP(
    () => {
      // Compact variant after scrolling > 80 px
      ScrollTrigger.create({
        start: 80,
        end: "max",
        onToggle: (self) => setCompact(self.isActive),
      });

      // Progress bar (whole-page scroll)
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          gsap.set(progressRef.current, { scaleX: self.progress });
        },
      });

      // Active section by the one in the viewport
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          // Recalculate only after the section pins (the pin-spacer shifts everything below it)
          refreshPriority: -1,
          onToggle: (self) => {
            if (self.isActive) setActive(id);
          },
        });
      });
    },
    { scope: headerRef },
  );

  // Scroll lock + Escape for the mobile menu
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const isHome = pathname === "/";
  const onProductPage = PRODUCTS.some((p) => p.href === pathname);
  const productsActive = onProductPage || (isHome && active === "produkty");
  // A link is active when its page is this page and its section is the one in view
  const isActive = (href: string) => {
    const [path, hash] = href.split("#");
    const samePage = (path || "/") === pathname;
    return samePage && hash === active;
  };

  return (
    <header
      ref={headerRef}
      className={cx(
        "sticky top-0 z-50 w-full bg-bg-page transition-[box-shadow,border-color] duration-200",
        compact ? "border-b border-border-default shadow-nav" : "border-b border-border-subtle",
      )}
    >
      {/* Narrow phones: 16 px gutter like container-page, so the logo, CTA and menu toggle fit at 360 px */}
      <div
        className={cx(
          "relative mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 transition-[padding] duration-200 min-[401px]:px-6 xl:px-10",
          compact ? "py-2.5 lg:py-3" : "py-4 lg:py-5",
        )}
      >
        <div className="xl:hidden">
          <Logo size="S" />
        </div>
        <div className="hidden xl:block">
          <Logo size="L" />
        </div>

        <nav aria-label="Hlavná navigácia" className="hidden items-center gap-1 lg:flex">
          <ProductsMenu active={productsActive} />
          {NAV_LINKS.map((l) => (
            <NavLink key={l.href} href={l.href} active={isActive(l.href)}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex xl:gap-4">
          {brochure && <BrochureButton size="M" compact />}
          <Button href="#kontakt" focusTarget="#alma-form [name='name'], #pilot-form [name='name']" size="M" arrow={compact}>
            Dohodnúť si ukážku
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {brochure && <BrochureButton iconOnly />}
          <Button href="#kontakt" size="M">
            Ukážka
          </Button>
          <button
            type="button"
            aria-label="Otvoriť menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="focus-ring flex size-10 flex-col items-end justify-center gap-[6px] rounded-[10px] pr-2 transition-colors hover:bg-bg-muted"
          >
            <span aria-hidden="true" className="h-[1.5px] w-[18px] rounded-full bg-text-primary" />
            <span aria-hidden="true" className="h-[1.5px] w-[11px] rounded-full bg-text-primary" />
          </button>
        </div>
      </div>

      {product && <ProductBar product={product} links={sectionLinks} active={active} />}

      <div
        ref={progressRef}
        aria-hidden="true"
        className={cx(
          "absolute -bottom-px left-0 h-0.5 w-full bg-accent transition-opacity duration-200",
          compact ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Mobile menu: overlay per Figma "🧪 Stavy · navigácia" */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-[60] flex flex-col bg-bg-page lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <Logo size="S" />
          <button
            type="button"
            aria-label="Zavrieť menu"
            onClick={() => setMenuOpen(false)}
            className="focus-ring flex size-10 items-center justify-center rounded-[10px] transition-colors hover:bg-bg-muted"
          >
            <svg
              viewBox="0 0 20 20"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pb-8 pt-6">
          <nav aria-label="Mobilná navigácia" className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-eyebrow text-text-tertiary">Produkty</p>
              <ul className="flex flex-col gap-2">
                {PRODUCTS.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={p.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={pathname === p.href ? "page" : undefined}
                      className={cx(
                        "focus-ring flex items-center justify-between gap-4 rounded-12 border px-4 py-3 transition-colors",
                        pathname === p.href ? "border-accent bg-accent-soft" : "border-border-default bg-bg-surface hover:bg-bg-muted",
                      )}
                    >
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-label-m text-text-primary">{p.name}</span>
                        <span className="text-caption text-text-tertiary">{p.audience}</span>
                      </span>
                      <Badge variant={p.status === "pilot" ? "success" : "neutral"} className="shrink-0">
                        {p.status === "pilot" ? "V pilote" : "predaj 2027"}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href} className="border-b border-border-default">
                  <a
                    href={l.href}
                    onClick={(e) => {
                      setMenuOpen(false);
                      handleAnchorClick(e, l.href, router);
                    }}
                    aria-current={isActive(l.href) ? "true" : undefined}
                    className={cx(
                      "focus-ring flex items-center justify-between rounded-8 py-[18px] text-h4",
                      isActive(l.href) ? "text-accent-text" : "text-text-primary",
                    )}
                  >
                    {l.label}
                    <Icon
                      name="arrow-right"
                      className={cx("size-[18px]", isActive(l.href) ? "text-accent" : "text-text-tertiary")}
                    />
                  </a>
                </li>
              ))}
              {brochure && (
                <li className="border-b border-border-default">
                  <a
                    href={BROCHURE.href}
                    download
                    onClick={() => setMenuOpen(false)}
                    aria-label={`${BROCHURE.label} (${BROCHURE.meta})`}
                    className="focus-ring flex items-center justify-between rounded-8 py-[18px] text-h4 text-text-primary"
                  >
                    <span className="flex flex-col gap-0.5">
                      {BROCHURE.menuLabel}
                      <span className="text-caption text-text-tertiary">{BROCHURE.meta}</span>
                    </span>
                    <Icon name="download" className="size-[18px] text-text-tertiary" />
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <div className="flex-1" />
          <div className="flex flex-col items-start gap-4">
            <Button href="#kontakt" arrow className="w-full" onClick={() => setMenuOpen(false)}>
              Dohodnúť si ukážku
            </Button>
            <a href={`mailto:${CONTACT.email}`} className="focus-ring rounded-[4px] text-body-s text-text-secondary">
              {CONTACT.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

/* Produkty: dropdown with the five products and a preview of the hovered one (idea 7) */
function ProductsMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<Product>(PRODUCTS[0]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number>(0);
  const panelId = useId();

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(closeTimer.current);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={show}
        className={cx(
          "focus-ring relative inline-flex items-center gap-1.5 rounded-8 px-3 py-2 text-label-m whitespace-nowrap transition-colors",
          active || open ? "bg-bg-muted text-text-primary" : "text-text-secondary hover:text-text-primary",
        )}
      >
        Produkty
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className={cx("size-4 transition-transform duration-200", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      <div
        id={panelId}
        role="region"
        aria-label="Produkty Alma"
        hidden={!open}
        className="absolute left-0 top-full z-50 pt-3"
      >
        <div className="grid w-[760px] grid-cols-[1fr_280px] overflow-hidden rounded-16 border border-border-default bg-bg-surface shadow-[0_24px_56px_-16px_rgba(20,23,31,0.28)]">
          <ul className="flex flex-col gap-0.5 p-2" onMouseLeave={() => setHovered(PRODUCTS[0])}>
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <Link
                  href={p.href}
                  onMouseEnter={() => setHovered(p)}
                  onFocus={() => setHovered(p)}
                  onClick={() => setOpen(false)}
                  className={cx(
                    "focus-ring flex items-center justify-between gap-4 rounded-12 px-3.5 py-3 transition-colors",
                    hovered.slug === p.slug ? "bg-bg-muted" : "hover:bg-bg-muted",
                  )}
                >
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-label-m text-text-primary">{p.name}</span>
                    <span className="text-caption text-text-tertiary">{p.audience}</span>
                  </span>
                  <Badge variant={p.status === "pilot" ? "success" : "neutral"} className="shrink-0">
                    {p.status === "pilot" ? "V pilote" : "Vo vývoji · predaj 2027"}
                  </Badge>
                </Link>
              </li>
            ))}
            <li className="mt-1 border-t border-border-subtle px-3.5 pb-1 pt-3">
              <AnchorLink
                href="/#produkty"
                onClick={() => setOpen(false)}
                className="focus-ring inline-flex items-center gap-1.5 rounded-[4px] text-label-s text-accent-text hover:text-accent-strong"
              >
                Všetky produkty a stav vývoja <span aria-hidden="true">→</span>
              </AnchorLink>
            </li>
          </ul>
          <div className="flex flex-col justify-between gap-4 border-l border-border-subtle bg-bg-muted p-4">
            <ProductThumb product={hovered} />
            <div className="flex flex-col gap-1">
              <p className="text-label-m text-text-primary">{hovered.name}</p>
              <p className="text-caption text-text-secondary">{hovered.statusLabel}</p>
              <p className="text-caption text-text-tertiary">{hovered.audience}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Preview tile in the dropdown: the real Alma ADOS screen, for products in development a whole screen of a shared module */
export function ProductThumb({ product, className }: { product: Product; className?: string }) {
  return <ProductScreen slug={product.slug} sizes="260px" className={className} />;
}

/* Product bar under the header: breadcrumb, in-page links (desktop) and the status badge */
function ProductBar({
  product,
  links,
  active,
}: {
  product: Product;
  links: readonly { href: string; label: string }[];
  active: string | null;
}) {
  const router = useRouter();
  return (
    <div className="border-t border-border-subtle bg-bg-surface/70">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-4 py-2 min-[401px]:px-6 xl:px-10">
        <nav aria-label="Drobčeková navigácia" className="flex items-center gap-2 text-caption text-text-tertiary">
          <Link href="/" className="focus-ring rounded-[3px] hover:text-text-primary">
            Alma
          </Link>
          <span aria-hidden="true">/</span>
          <AnchorLink href="/#produkty" className="focus-ring rounded-[3px] hover:text-text-primary">
            Produkty
          </AnchorLink>
          <span aria-hidden="true">/</span>
          <span className="text-text-primary" aria-current="page">
            {product.name}
          </span>
        </nav>
        {links.length > 0 && (
          <nav aria-label="Sekcie stránky" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const isActive = active != null && l.href === `#${active}`;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleAnchorClick(e, l.href, router)}
                  aria-current={isActive ? "true" : undefined}
                  className={cx(
                    "focus-ring relative rounded-8 px-2.5 py-1.5 text-label-s whitespace-nowrap transition-colors after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-0.5 after:origin-left after:rounded-full after:bg-accent after:transition-transform after:duration-200",
                    isActive
                      ? "text-text-primary after:scale-x-100"
                      : "text-text-secondary after:scale-x-0 hover:text-text-primary hover:after:scale-x-100",
                  )}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>
        )}
        <Badge variant={product.status === "pilot" ? "success" : "neutral"} className="shrink-0 max-[480px]:hidden">
          {product.statusLabel}
        </Badge>
      </div>
    </div>
  );
}

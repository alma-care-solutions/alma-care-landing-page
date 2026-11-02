import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CONTACT, PRODUCTS } from "@/lib/nav";
import { cx } from "@/lib/cx";

const linkCls =
  "focus-ring inline-block rounded-[4px] text-body-s text-text-inverse-muted transition-colors hover:text-text-inverse";

/* Site footer, the same on every page (Figma Alma · Footer) */
export function Footer() {
  return (
    <footer className="border-t border-border-dark bg-bg-dark" aria-label="Päta stránky">
      <div className="container-page flex flex-col gap-8 pb-10 pt-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-[360px] flex-col gap-3">
            <Logo size="S" onDark />
            <p className="text-body-s text-text-inverse-muted">
              Softvérové produkty pre poskytovateľov zdravotnej a sociálnej starostlivosti. Alma ADOS je v pilote,
              ďalšie produkty sú vo vývoji.
            </p>
            {/* TODO: add the company registration number (IČO) and registered office */}
            <p className="text-caption text-text-tertiary-on-dark">{CONTACT.company}</p>
          </div>
          <div className="flex flex-col gap-8 sm:grid sm:grid-cols-3 lg:flex lg:flex-row lg:gap-20">
            <div className="flex flex-col gap-3">
              <p className="text-label-s text-text-inverse">Produkty</p>
              {PRODUCTS.map((p) => (
                <Link key={p.slug} href={p.href} className={linkCls}>
                  {p.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-label-s text-text-inverse">Kontakt</p>
              <a href={`mailto:${CONTACT.email}`} className={cx(linkCls, "break-all")}>
                {CONTACT.email}
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-label-s text-text-inverse">Právne</p>
              <Link href="/ochrana-osobnych-udajov" className={linkCls}>
                Ochrana osobných údajov
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-border-dark pt-6 text-caption text-text-tertiary-on-dark lg:flex-row lg:items-center lg:justify-between">
          <p>© 2026 {CONTACT.company} Všetky práva vyhradené.</p>
          <p>Alma ADOS je prvý produkt značky Alma. Ďalšie produkty sú vo vývoji, termíny sú orientačné.</p>
        </div>
      </div>
    </footer>
  );
}

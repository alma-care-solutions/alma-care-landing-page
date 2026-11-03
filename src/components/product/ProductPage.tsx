import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/Reveal";
import { HashScroll } from "@/components/HashScroll";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckItem } from "@/components/ui/CheckItem";
import { HomeContact } from "@/components/home/HomeContact";
import { PRODUCTS, type Product } from "@/lib/nav";
import type { ProductContent } from "@/lib/products";
import { cx } from "@/lib/cx";
import { ProductScreen } from "@/components/ui/ScreenCrop";
import { screenNote } from "@/lib/screens";

/*
  "Pripravujeme" product page (Figma Šablóna · Pripravujeme): hero with an illustration placeholder, what the product
  will solve, who it is for and how it relates to the other products, what changes in the law, contact.
*/
export function ProductPage({ product, content }: { product: Product; content: ProductContent }) {
  const siblings = PRODUCTS.filter((p) => p.slug !== product.slug);
  return (
    <>
      <Nav sectionIds={["kontakt"]} product={product} />
      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section aria-label="Úvod" className="relative overflow-hidden">
          <div className="container-page grid gap-10 pb-12 pt-10 lg:grid-cols-[1fr_480px] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
            <div className="flex flex-col items-start gap-5 lg:gap-6">
              <Badge variant="neutral">{product.statusLabel}</Badge>
              <h1 className="text-mobile-h1 text-text-primary lg:text-display lg:text-[56px]">{content.hero.title}</h1>
              <p className="max-w-[640px] text-body-l text-text-secondary lg:text-lead">{content.hero.lead}</p>
              <div className="flex w-full flex-col items-stretch gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
                <Button href="#kontakt" focusTarget="#alma-form [name='name']" arrow>
                  Chcem byť medzi prvými
                </Button>
                <Button href="/ados" variant="secondary">
                  Pozrieť Alma ADOS v pilote
                </Button>
              </div>
              <p className="max-w-[560px] text-body-s text-text-tertiary">{content.hero.note}</p>
            </div>
            <figure className="flex w-full flex-col gap-3">
              <ProductScreen slug={product.slug} variant="hero" sizes="(min-width: 1024px) 480px, 100vw" priority />
              <figcaption className="text-caption text-text-tertiary">{screenNote(product.slug)}</figcaption>
            </figure>
          </div>
        </section>

        {/* What it will solve */}
        <section aria-label={content.solves.title} className="bg-bg-surface py-12 lg:py-28">
          <div className="container-page flex flex-col gap-10 lg:gap-12">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <div className="flex flex-col gap-3 lg:w-[560px] lg:shrink-0">
                <h2 className="gsap-reveal text-mobile-h2 text-text-primary lg:text-h2">{content.solves.title}</h2>
                <p className="gsap-reveal text-body-m text-text-secondary lg:text-body-l">{content.solves.lead}</p>
              </div>
              <p className="gsap-reveal max-w-[480px] text-body-s text-text-tertiary">{content.solves.note}</p>
            </div>
            <ol className="grid gap-x-16 gap-y-8 border-t border-border-default pt-8 sm:grid-cols-2">
              {content.solves.items.map((it, i) => (
                <li key={it.title} className="gsap-reveal flex flex-col gap-2">
                  <span className="text-caption tabular-nums text-text-tertiary">0{i + 1}</span>
                  <h3 className="text-h4 text-text-primary">{it.title}</h3>
                  <p className="text-body-m text-text-secondary">{it.text}</p>
                </li>
              ))}
            </ol>
            <p className="gsap-reveal max-w-[640px] border-t border-border-default pt-6 text-body-m text-text-secondary">
              {content.solves.outro}
            </p>
          </div>
        </section>

        {/* Who it is for + relation to other products */}
        <section aria-label="Pre koho" className="py-12 lg:py-28">
          <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-5">
              <h2 className="gsap-reveal text-h3 text-text-primary">{content.audience.title}</h2>
              <p className="gsap-reveal text-body-m text-text-secondary lg:text-body-l">{content.audience.intro}</p>
              <ul className="gsap-reveal flex flex-col gap-3">
                {content.audience.roles.map((r) => (
                  <CheckItem key={r}>{r}</CheckItem>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="gsap-reveal text-h3 text-text-primary">Ako súvisí s ostatnými produktmi</h2>
              <p className="gsap-reveal text-body-m text-text-secondary lg:text-body-l">
                Každý produkt Alma je samostatná aplikácia pre jeden typ služby. Staviame ich rovnakým spôsobom a s
                rovnakým tímom: najprv pilot s reálnym zariadením, potom predaj.
              </p>
              <ul className="gsap-reveal flex flex-wrap gap-2">
                {siblings.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={s.href}
                      className={cx(
                        "focus-ring inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-label-s transition-colors",
                        s.status === "pilot"
                          ? "border-status-success/30 bg-status-success-soft text-status-success hover:border-status-success"
                          : "border-border-default bg-bg-surface text-text-secondary hover:border-text-tertiary hover:text-text-primary",
                      )}
                    >
                      {s.name}
                      <span className="text-caption opacity-80">{s.status === "pilot" ? "v pilote" : "2027"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What changes */}
        {content.changes && (
          <section aria-label={content.changes.title} className="bg-bg-surface py-12 lg:py-28">
            <div className="container-page grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-24">
              <div className="flex flex-col gap-4">
                <p className="gsap-reveal text-eyebrow text-accent-text">{content.changes.title}</p>
                <h2 className="gsap-reveal max-w-[640px] text-mobile-h2 text-text-primary lg:text-h2">{content.changes.headline}</h2>
                <p className="gsap-reveal max-w-[640px] text-body-m text-text-secondary lg:text-body-l">{content.changes.text}</p>
              </div>
              <dl className="gsap-reveal flex flex-col divide-y divide-border-default border-y border-border-default">
                {content.changes.items.map((it) => (
                  <div key={it.label} className="grid grid-cols-[120px_1fr] gap-4 py-4">
                    <dt className="text-label-m tabular-nums text-text-primary">{it.date}</dt>
                    <dd className="text-body-m text-text-secondary">{it.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        <HomeContact
          eyebrow="Chcem byť medzi prvými"
          title={content.contact.title}
          lead={content.contact.lead}
          checks={content.contact.checks}
          product={product.slug}
          submitLabel="Chcem byť medzi prvými"
          footnote="Odoslaním nevzniká žiadny záväzok. Zapíšeme vás medzi prvých a dáme vedieť pred pilotom."
        />
      </main>
      <Footer />
      <Reveal />
      <HashScroll />
    </>
  );
}

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrochureBookButton } from "@/components/ui/BrochureBook";
import { ADOS, PRODUCTS } from "@/lib/nav";
import { PaperCompare } from "@/components/home/PaperCompare";
import { ProductRows } from "@/components/home/ProductRows";

/*
  Produkty Alma (Figma Alma · Home › Produkty): Alma ADOS first with the paper / Alma comparison and the brochure
  as a book, then the four products in development as plain rows. No cards, no icons.
*/
export function Products() {
  const inDevelopment = PRODUCTS.filter((p) => p.status === "dev");
  return (
    <section id="produkty" aria-label="Produkty Alma" className="bg-bg-surface py-12 lg:py-28">
      <div className="container-page flex flex-col gap-10 lg:gap-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <h2 className="gsap-reveal text-mobile-h2 text-text-primary lg:w-[480px] lg:shrink-0 lg:text-h2">
            Produkty Alma
          </h2>
          <p className="gsap-reveal max-w-[560px] text-body-m text-text-secondary lg:text-body-l">
            Každý produkt je samostatná aplikácia pre jeden typ služby. Všetky staviame rovnako: najprv pilot s
            reálnym zariadením, potom predaj.
          </p>
        </div>

        <hr className="border-border-default" />

        <div className="grid items-center gap-10 lg:grid-cols-[480px_1fr] lg:gap-16">
          <div className="gsap-reveal flex flex-col items-start gap-5">
            <Badge variant="success" pulse>
              {ADOS.statusLabel}
            </Badge>
            <h3 className="text-h3 text-text-primary">{ADOS.name}</h3>
            <p className="text-body-m text-text-secondary lg:text-body-l">
              {ADOS.summary} Od októbra 2026 v pilote s Arcidiecéznou charitou Košice.
            </p>
            <div className="flex flex-col items-stretch gap-3 pt-1 sm:flex-row sm:items-center">
              <Button href={ADOS.href} variant="secondary" size="M" arrow>
                Pozrieť Alma ADOS
              </Button>
              <BrochureBookButton />
            </div>
          </div>
          <PaperCompare />
        </div>

        <ProductRows products={inDevelopment} />

        <p className="text-caption text-text-tertiary">
          Termíny sú orientačné. Aktuálny stav vývoja všetkých produktov nájdete v menu Produkty.
        </p>
      </div>
    </section>
  );
}

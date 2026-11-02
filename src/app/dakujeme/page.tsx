import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/Button";
import { CheckItem } from "@/components/ui/CheckItem";
import { Icon } from "@/components/ui/Icon";
import { productBySlug } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Ďakujeme | Alma",
  description: "Vašu správu sme prijali. Ozveme sa vám do dvoch pracovných dní.",
  robots: { index: false },
};

const NEXT_ADOS = [
  "Krátky úvodný hovor, približne 20 minút",
  "Ukážeme vám Alma ADOS a spýtame sa, ako fungujete dnes",
  "Spoločne dohodneme rozsah spolupráce",
];

const NEXT_DEV = (name: string) => [
  `Zapísali sme vás medzi prvých záujemcov o ${name}`,
  "Ozveme sa pred pilotom v roku 2027 a dáme vedieť, ako sa dá zapojiť",
  "Medzitým sa môžete pozrieť, ako beží Alma ADOS",
];

export default async function DakujemePage({ searchParams }: PageProps<"/dakujeme">) {
  const { produkt } = await searchParams;
  const product = typeof produkt === "string" ? productBySlug(produkt) : undefined;
  const inDevelopment = product && product.status === "dev";
  const next = inDevelopment ? NEXT_DEV(product.name) : NEXT_ADOS;

  return (
    <>
      <Nav />
      <main className="flex flex-1 flex-col">
        <section aria-label="Formulár odoslaný" className="flex flex-1 items-center bg-bg-dark py-12 lg:py-24">
          <div className="container-page flex justify-center">
            <div className="flex w-full max-w-[544px] flex-col items-start gap-5 rounded-[20px] bg-bg-surface p-6 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] sm:p-8">
              <span className="flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent-text">
                <Icon name="check-circle" className="size-[26px]" />
              </span>
              <div className="flex flex-col gap-2">
                <h1 className="text-h3 text-text-primary">
                  {inDevelopment ? `Zapísané k ${product.name}` : "Ďakujeme, máme to."}
                </h1>
                <p className="text-body-m text-text-secondary">
                  {inDevelopment
                    ? "Ďakujeme. Potvrdenie sme poslali na váš e-mail."
                    : "Ozveme sa vám do dvoch pracovných dní na e-mail alebo telefón, ktorý ste uviedli."}
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 rounded-[14px] border border-border-default bg-bg-page p-5">
                <p className="text-label-s text-text-primary">Čo bude nasledovať</p>
                <ul className="flex flex-col gap-3">
                  {next.map((t) => (
                    <CheckItem key={t}>{t}</CheckItem>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                {inDevelopment ? (
                  <Button href="/ados" size="M" arrow className="w-full sm:w-auto">
                    Pozrieť Alma ADOS
                  </Button>
                ) : null}
                <Button href="/" variant="secondary" size="M" className="w-full sm:w-auto">
                  Späť na úvodnú stránku
                </Button>
              </div>
              {!inDevelopment && <p className="text-caption text-text-tertiary">Potvrdenie sme poslali aj na váš e-mail.</p>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

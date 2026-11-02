import { Button } from "@/components/ui/Button";
import { HeroDecor } from "@/components/ui/HeroDecor";
import { HeroMotion } from "@/components/sections/HeroMotion";
import { HomeHeroVisual } from "@/components/home/HomeHeroVisual";

/*
  Alma home hero (Figma Alma · Home › Hero): the brand slogan on the left, who Alma is for on the right,
  below them the real Alma ADOS screens. Interactions live in HomeHeroVisual.
*/
export function HomeHero() {
  return (
    <section aria-label="Úvod" className="relative overflow-hidden">
      <HeroMotion>
        <HeroDecor dots />

        <div className="container-page relative flex flex-col gap-12 pb-12 pt-10 lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            <div data-hero="copy" className="flex flex-col lg:max-w-[720px]">
              <h1 className="text-mobile-h1 text-text-primary lg:text-display">
                Čas patrí pacientom.
                <br />
                <span className="relative inline-block">
                  Nie papierom.
                  {/* Pen stroke, drawn after the headline lands (HeroMotion) */}
                  <svg
                    data-hero="pen"
                    aria-hidden="true"
                    viewBox="0 0 320 16"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute -bottom-[0.1em] left-0 h-[0.22em] w-full overflow-visible"
                  >
                    <path
                      d="M3 11 C 70 3, 130 15, 190 8 S 300 4, 317 10"
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            <div data-hero="copy" className="flex flex-col items-start gap-6 lg:w-[416px] lg:shrink-0 lg:pt-3">
              <p className="text-body-l text-text-secondary lg:text-lead">
                Alma je softvér pre agentúry a zariadenia, ktoré poskytujú starostlivosť: domácu ošetrovateľskú,
                opatrovateľskú, v stacionároch aj v pobytových zariadeniach. Súčasťou je aj pacient: vidí prehľad o
                svojej starostlivosti a môže si požičať alebo dokúpiť pomôcky a služby navyše. Prvý produkt, Alma
                ADOS, beží od októbra 2026 v pilote.
              </p>
              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Button href="/ados" arrow>
                  Pozrieť Alma ADOS
                </Button>
                <Button href="#kontakt" variant="secondary" focusTarget="#alma-form [name='name']">
                  Napísať nám
                </Button>
              </div>
            </div>
          </div>

          <HomeHeroVisual />
        </div>
      </HeroMotion>
    </section>
  );
}

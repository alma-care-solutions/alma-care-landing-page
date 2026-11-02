import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PreviewLabel } from "@/components/ui/PreviewLabel";
import { BrowserFrame } from "@/components/ui/Browser";
import { PhoneFrame } from "@/components/ui/Phone";
import { HeroDecor } from "@/components/ui/HeroDecor";
import { HeroMotion } from "@/components/sections/HeroMotion";

/*
  Hero visual = real app screenshots (demo agency) in CSS frames: web Plánovanie in BrowserFrame (1040 wide),
  nurse app in PhoneFrame (296 wide). Shadows and rounding are in CSS so the decor stays visible underneath.
  Percentages are relative to the 1200 × 718 frame (desktop) or the 1000 × 900 mobile composition (browser 124 % wide, slightly overflowing the edges).
*/
export function Hero() {
  return (
    <section aria-label="Úvod" className="relative overflow-hidden">
      <HeroMotion>
        <HeroDecor />

        <div className="container-page relative flex flex-col items-center gap-12 pb-12 pt-12 lg:gap-16 lg:pb-24 lg:pt-24">
          <div
            data-hero="copy"
            className="flex w-full max-w-[880px] flex-col items-start gap-5 text-left lg:items-center lg:gap-6 lg:text-center"
          >
            <Badge variant="success" pulse>
              V pilote · predaj 2027
            </Badge>
            <h1 className="text-mobile-h1 text-text-primary lg:text-display">
              Čas patrí pacientom.{" "}
              <br className="hidden lg:block" />
              Nie papierom.
            </h1>
            <p className="max-w-[760px] text-body-l text-text-secondary lg:text-lead">
              Vyvíjame moderný systém pre agentúry domácej ošetrovateľskej starostlivosti, ktorý
              prepája prácu sestier v teréne s plánovaním, dokumentáciou a administratívou v kancelárii.
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 pt-2 lg:w-auto lg:flex-row lg:items-center">
              <Button href="#kontakt" focusTarget="#pilot-form [name='name']" arrow>
                Zapojiť sa do pilotu
              </Button>
              <Button href="#produkt" variant="secondary">
                Pozrieť, ako to funguje
              </Button>
            </div>
            {/* TODO: "3 – 5" is a proposal, adjust to the real capacity */}
            <p className="max-w-[640px] text-body-s text-text-tertiary">
              Hľadáme 3 až 5 ADOS, ktoré s nami produkt navrhnú a overia v praxi ešte pred spustením.
            </p>
          </div>

          <figure data-hero="visual" className="flex w-full max-w-[1200px] flex-col items-center">
            <div className="relative w-full aspect-[1000/900] sm:aspect-[1200/718]">
              <div
                data-hero="browser"
                className="absolute left-[-12%] top-0 w-[124%] max-w-none rounded-12 shadow-[0_2px_6px_rgba(20,23,31,0.06),0_24px_48px_-12px_rgba(20,23,31,0.1)] sm:left-0 sm:w-[86.667%]"
              >
                <BrowserFrame>
                  {/* The week continues below the fold; the crop keeps the frame at the original composition height */}
                  <div className="relative aspect-[1200/780] w-full">
                    <Image
                      src="/images/web-planning-2610.png"
                      alt="Webová aplikácia Alma ADOS, Plánovanie: týždeň návštev rozdelený podľa sestier s časmi, kódmi výkonov a menami pacientov"
                      fill
                      priority
                      sizes="(min-width: 1280px) 1040px, 124vw"
                      className="object-cover object-top"
                    />
                  </div>
                </BrowserFrame>
              </div>
              <div
                data-hero="phone-wrap"
                className="absolute left-[60%] top-[1.5%] w-[40%] sm:left-[75.333%] sm:top-[13.37%] sm:w-[24.667%]"
              >
                <div data-hero="phone">
                  <PhoneFrame>
                    <Image
                      src="/images/phone-visit-detail-2610.png"
                      alt="Aplikácia pre sestry: detail návštevy pred začatím s pacientom, plánovanými výkonmi a tlačidlom Začať návštevu"
                      fill
                      sizes="(min-width: 1280px) 280px, 40vw"
                      priority
                      className="object-cover object-top"
                    />
                  </PhoneFrame>
                </div>
              </div>
              {/* Right of the app sidebar, so the label never covers its dark background */}
              <div data-hero="label" className="absolute bottom-[1%] left-[10%] sm:bottom-[4.4%] sm:left-[16.5%]">
                <PreviewLabel />
              </div>
            </div>
          </figure>
        </div>
      </HeroMotion>
    </section>
  );
}

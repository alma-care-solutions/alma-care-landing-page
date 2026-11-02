import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PreviewLabel } from "@/components/ui/PreviewLabel";
import { BrowserFrame } from "@/components/ui/Browser";
import { PhoneFrame } from "@/components/ui/Phone";
import { HeroDecor } from "@/components/ui/HeroDecor";
import { HeroMotion } from "@/components/sections/HeroMotion";

/*
  Alma ADOS product hero (Figma Alma ADOS › Hero): copy on the left, the real app screens on the right.
  Hero visual = real app screenshots (demo agency) in CSS frames: web Plánovanie in BrowserFrame, nurse app in PhoneFrame.
  Percentages are relative to the 1200 × 718 composition (desktop) or 1000 × 900 (mobile, browser 124 % wide).
*/
export function Hero() {
  return (
    <section aria-label="Úvod" className="relative overflow-hidden">
      <HeroMotion>
        <HeroDecor variant="product" />

        <div className="container-page relative grid gap-10 pb-12 pt-10 lg:grid-cols-[minmax(0,500px)_1fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-16">
          <div data-hero="copy" className="flex flex-col items-start gap-5 lg:gap-6">
            <Badge variant="success" pulse>
              <span className="sm:hidden">V pilote · predaj 2027</span>
              <span className="hidden sm:inline">V pilote s Arcidiecéznou charitou Košice · predaj 2027</span>
            </Badge>
            <h1 className="text-mobile-h1 text-text-primary lg:text-[56px] lg:font-semibold lg:leading-[1.05] lg:tracking-[-0.02em]">
              Menej administratívy. Viac času na pacienta.
            </h1>
            <p className="max-w-[560px] text-body-l text-text-secondary">
              Alma ADOS prepája prácu sestry v teréne s plánovaním, dokumentáciou a administratívou agentúry. Od
              októbra 2026 beží v pilote.
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
              <Button href="#kontakt" focusTarget="#pilot-form [name='name']" arrow>
                Dohodnúť si ukážku
              </Button>
              <Button href="#produkt" variant="secondary">
                Pozrieť, ako to funguje
              </Button>
            </div>
            <p className="max-w-[520px] text-body-s text-text-tertiary">
              Pilot beží od októbra 2026. Ďalšie agentúry zapíšeme medzi prvých pre predaj v roku 2027.
            </p>
          </div>

          <figure data-hero="visual" className="flex w-full flex-col items-center lg:justify-self-end">
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
                      quality={90}
                      sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 124vw"
                      className="object-cover object-top"
                    />
                  </div>
                </BrowserFrame>
              </div>
              <div
                data-hero="phone-wrap"
                className="absolute left-[60%] top-[1.5%] w-[40%] sm:left-[72%] sm:top-[10%] sm:w-[28%]"
              >
                <div data-hero="phone">
                  <PhoneFrame>
                    <Image
                      src="/images/phone-visit-detail-2610.png"
                      alt="Aplikácia pre sestry: detail návštevy pred začatím s pacientom, plánovanými výkonmi a tlačidlom Začať návštevu"
                      fill
                      sizes="(min-width: 1280px) 200px, 40vw"
                      priority
                      quality={90}
                      className="object-cover object-top"
                    />
                  </PhoneFrame>
                </div>
              </div>
              {/* Right of the app sidebar, so the label never covers its dark background */}
              <div data-hero="label" className="absolute bottom-[1%] left-[10%] sm:bottom-[3%] sm:left-[14%]">
                <PreviewLabel />
              </div>
            </div>
          </figure>
        </div>
      </HeroMotion>
    </section>
  );
}

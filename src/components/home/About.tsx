import Image from "next/image";
import { CONTACT, PARTNER } from "@/lib/nav";

/*
  Kto robí Almu (Figma Alma · Home › Kto robí Almu): the team behind Alma without names, from the conference deck,
  and the pilot partner with its logo. The only mention of the partner on the home page apart from the ADOS row.
*/
export function About() {
  return (
    <section id="o-alme" aria-label="Kto robí Almu" className="bg-bg-surface py-12 lg:py-28">
      <div className="container-page flex flex-col gap-10 lg:gap-12">
        <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-24">
          <h2 className="gsap-reveal text-mobile-h2 text-text-primary lg:text-h2">Kto robí Almu</h2>
          <div className="flex max-w-[704px] flex-col gap-5">
            <p className="gsap-reveal text-body-m text-text-primary lg:text-body-l">
              Almu vyvíja {CONTACT.company} Tím, ktorý za ňou stojí, robil telemedicínu s TUKE, aplikáciu MAIA MD pre
              Dôveru a pracoval pre Care.com. Z náročných systémov má za sebou testovanie sietí pre Nokiu, letecké
              informácie pre viac ako 50 krajín a športovú analytiku XPS Network v 87 krajinách. Spolu viac ako 20
              rokov tvorby softvéru.
            </p>
            <p className="gsap-reveal text-body-s text-text-secondary lg:text-body-m">
              Pracovali sme aj pre IBM, PDI, Shell, American Airlines, Mercedes, NNG, fuboTV, Conrad a ČEZ.
            </p>
          </div>
        </div>

        <hr className="border-border-default" />

        <div className="gsap-reveal flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Image
            src={PARTNER.logo}
            alt={PARTNER.name}
            width={PARTNER.logoWidth}
            height={PARTNER.logoHeight}
            className="h-12 w-auto sm:h-14"
          />
          <p className="text-body-s text-text-secondary lg:text-body-m">
            Pilotný partner Alma ADOS {PARTNER.since}.
          </p>
        </div>
      </div>
    </section>
  );
}

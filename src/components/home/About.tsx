import Image from "next/image";
import { CONTACT, PARTNER } from "@/lib/nav";

/*
  Kto robí Almu (Figma Alma · Home › Kto robí Almu): the team behind Alma without names, from the conference deck,
  and the pilot partner with its logo. The only mention of the partner on the home page apart from the ADOS row.
*/
export function About() {
  return (
    <section id="o-alme" aria-label="Kto robí Almu" className="bg-bg-surface py-12 lg:py-24">
      <div className="container-page flex flex-col gap-10 lg:gap-14">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr] lg:gap-16">
          <h2 className="gsap-reveal text-mobile-h2 text-text-primary lg:text-h2">Kto robí Almu</h2>
          <div className="flex flex-col gap-5">
            <p className="gsap-reveal text-body-m text-text-primary lg:text-lead">
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

        {/* Pilot partner */}
        <div className="gsap-reveal grid gap-6 rounded-16 border border-border-default bg-bg-page p-6 lg:grid-cols-[360px_1fr] lg:items-center lg:gap-16 lg:p-8">
          <div className="flex flex-col gap-4">
            <p className="text-eyebrow text-accent-text">Pilotný partner</p>
            <Image
              src={PARTNER.logo}
              alt={PARTNER.name}
              width={PARTNER.logoWidth}
              height={PARTNER.logoHeight}
              className="h-14 w-auto sm:h-16"
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-h4 text-text-primary">
              Alma ADOS beží {PARTNER.since} v každodennej prevádzke sestier {PARTNER.name}.
            </p>
            <p className="text-body-m text-text-secondary">
              Charita poskytuje zdravotnú aj sociálnu starostlivosť v domácnostiach a vo svojich zariadeniach. Jej
              sestry a vedenie agentúry vidia nové funkcie ako prvé a ich pripomienky sa menia na úpravy v ďalšej
              verzii. Rovnako budeme postupovať s ďalšími agentúrami pred predajom v roku 2027.
            </p>
            <a
              href="https://www.charita-ke.sk"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex w-fit items-center gap-1.5 rounded-[4px] text-label-s text-accent-text hover:text-accent-strong"
            >
              charita-ke.sk <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

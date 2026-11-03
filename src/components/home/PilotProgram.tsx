import { SectionHeader } from "@/components/ui/SectionHeader";
import { StepCard } from "@/components/ui/StepCard";
import { CheckItem } from "@/components/ui/CheckItem";
import { Button } from "@/components/ui/Button";
import { PARTNER } from "@/lib/nav";

/*
  Pilotný program on the home page (moved here from the /ados subpage, review round 4): the same three steps
  for every Alma product, what we need from a pilot partner and what it gains, worded for any facility,
  not only for an ADOS agency.
*/
const STEPS = [
  {
    number: "01",
    title: "Spoznáme fungovanie zariadenia",
    description:
      "Prejdeme s partnerom, ako plánuje službu, pracuje v teréne alebo na zmene, vedie dokumentáciu a pripravuje podklady pre vykazovanie.",
  },
  {
    number: "02",
    title: "Dolaďujeme podľa praxe",
    description:
      "Pracovníci a vedenie zariadenia vidia nové funkcie ako prví. Ich pripomienky sa menia na úpravy v ďalšej verzii.",
  },
  {
    number: "03",
    title: "Overujeme v prevádzke",
    description:
      "Produkt beží v každodennej prevádzke partnera. Až potom ide do predaja pre ďalšie zariadenia rovnakého typu.",
  },
];

const NEED = [
  "Praktickú spätnú väzbu k návrhom obrazoviek a pracovných postupov",
  "Vysvetlenie, ako dnes reálne prebieha plánovanie, dokumentácia a vykazovanie",
  "Otestovanie vybraných verzií produktu, keď budú pripravené",
];

const GAIN = [
  "Priamy vplyv na to, ako bude produkt pre vašu službu fungovať",
  "Skorý prístup k prototypom a pilotným verziám",
  "Priamu komunikáciu s tímom, ktorý produkt vyvíja",
];

export function PilotProgram() {
  return (
    <section id="pilotny-program" aria-label="Pilotný program" className="bg-bg-surface py-12 lg:py-28">
      <div className="container-page flex flex-col gap-10 lg:gap-14">
        <SectionHeader
          eyebrow="Pilotný program"
          title="Každý produkt najprv overíme v praxi"
          lead={`Pred predajom beží každý produkt Alma v pilote s reálnym zariadením. Alma ADOS takto beží ${PARTNER.since} v ${PARTNER.name}. Pre Alma DOS, Stacionár a Pobytové hľadáme pilotných partnerov na rok 2027.`}
        />
        <ol className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {STEPS.map((s) => (
            <li key={s.number} className="contents">
              <StepCard {...s} className="gsap-reveal" />
            </li>
          ))}
        </ol>
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="gsap-reveal flex flex-col gap-5 rounded-16 border border-border-default bg-bg-page p-6 lg:p-8">
            <h3 className="text-h4 text-text-primary">Čo od pilotného zariadenia potrebujeme</h3>
            <ul className="flex flex-col gap-3">
              {NEED.map((t) => (
                <CheckItem key={t}>{t}</CheckItem>
              ))}
            </ul>
          </div>
          <div className="gsap-reveal flex flex-col gap-5 rounded-16 border border-border-dark bg-bg-dark p-6 lg:p-8">
            <h3 className="text-h4 text-text-inverse">Čo pilotné zariadenie získa</h3>
            <ul className="flex flex-col gap-3">
              {GAIN.map((t) => (
                <CheckItem key={t} variant="dark">
                  {t}
                </CheckItem>
              ))}
            </ul>
            <p className="text-caption text-text-inverse-muted">
              Podmienky spolupráce pri predaji dohodneme individuálne. Nesľubujeme nič, čo dnes nevieme garantovať.
            </p>
          </div>
        </div>
        <div className="gsap-reveal flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
          <Button href="#kontakt" variant="primary" size="M" arrow focusTarget="#alma-form [name='name']">
            Chcem byť pilotné zariadenie
          </Button>
          <p className="text-body-s text-text-tertiary">Bez záväzku. Ozveme sa pred začiatkom pilotu pre váš typ služby.</p>
        </div>
      </div>
    </section>
  );
}

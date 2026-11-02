import { SectionHeader } from "@/components/ui/SectionHeader";
import { StepCard } from "@/components/ui/StepCard";
import { PlusField } from "@/components/ui/PlusField";

const STEPS = [
  {
    number: "01",
    title: "Spoznali sme fungovanie agentúry",
    description:
      "Prešli sme s partnerom, ako plánuje návštevy, pracuje v teréne, vedie dokumentáciu a pripravuje podklady pre vykazovanie.",
  },
  {
    number: "02",
    title: "Dolaďujeme podľa terénu",
    description:
      "Sestry a vedenie agentúry vidia nové funkcie ako prvé. Ich pripomienky sa menia na úpravy v ďalšej verzii.",
  },
  {
    number: "03",
    title: "Overujeme v praxi",
    description:
      "Od októbra 2026 beží Alma ADOS v každodennej prevádzke. Ďalšie agentúry zapíšeme medzi prvých pre predaj v roku 2027.",
  },
];

export function PilotSteps() {
  return (
    <section
      id="pilotny-program"
      aria-label="Pilotný program: ako to funguje"
      className="relative overflow-hidden"
    >
      <PlusField className="bottom-[-20px] right-[-30px] h-[230px] lg:bottom-auto lg:right-[-40px] lg:top-4 lg:h-[280px] xl:right-[-60px] xl:top-[60px] xl:h-[380px]" />
      <div className="container-page relative flex flex-col gap-10 pb-8 pt-12 lg:gap-16 lg:pb-24 lg:pt-32">
        <SectionHeader
          eyebrow="Pilotný program"
          title="Ako prebieha pilot"
          lead="Tri kroky, ktorými s pilotným partnerom prechádzame. Rovnako budeme postupovať s ďalšími agentúrami pred predajom."
        />
        <ol className="grid gap-4 md:grid-cols-3 lg:gap-6">
          {STEPS.map((s) => (
            <li key={s.number} className="contents">
              <StepCard {...s} className="gsap-reveal" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

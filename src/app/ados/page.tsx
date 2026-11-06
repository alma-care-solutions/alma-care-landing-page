import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FieldDay } from "@/components/sections/FieldDay";
import { AiDocumentation } from "@/components/sections/AiDocumentation";
import { OfficeDay } from "@/components/sections/OfficeDay";
import { OfficeTools } from "@/components/sections/OfficeTools";
import { Calculator } from "@/components/sections/Calculator";
import { Roadmap } from "@/components/sections/Roadmap";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/Reveal";
import { HashScroll } from "@/components/HashScroll";
import { ADOS, ADOS_SECTION_IDS, ADOS_SECTION_LINKS } from "@/lib/nav";
import { BRAND } from "@/lib/brand";

const DESCRIPTION =
  "Alma ADOS prepája prácu sestry v teréne s plánovaním, dokumentáciou a administratívou agentúry. Od októbra 2026 beží v pilote, predaj plánujeme v roku 2027.";

export const metadata: Metadata = {
  title: `${BRAND.name} | Systém pre agentúry domácej starostlivosti`,
  description: DESCRIPTION,
  alternates: { canonical: "/ados" },
  openGraph: { title: `${BRAND.name}: dokumentácia vzniká pri pacientovi`, description: DESCRIPTION },
};

/* Alma ADOS product page: the former adosalma.sk landing page under the Alma header with the product bar;
   the pilot program sections moved to the home page (review round 4) */
export default function AdosPage() {
  return (
    <>
      <Nav sectionIds={ADOS_SECTION_IDS} product={ADOS} sectionLinks={ADOS_SECTION_LINKS} brochure />
      <main className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <FieldDay />
        <AiDocumentation />
        <OfficeDay />
        <OfficeTools />
        <Calculator />
        <Roadmap />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Reveal />
      <HashScroll />
    </>
  );
}

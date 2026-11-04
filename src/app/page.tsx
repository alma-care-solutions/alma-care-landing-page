import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Reveal } from "@/components/Reveal";
import { HashScroll } from "@/components/HashScroll";
import { ScrollBackdrop } from "@/components/home/ScrollBackdrop";
import { HomeHero } from "@/components/home/HomeHero";
import { Products } from "@/components/home/Products";
import { Year2027 } from "@/components/home/Year2027";
import { PilotProgram } from "@/components/home/PilotProgram";
import { About } from "@/components/home/About";
import { HomeContact } from "@/components/home/HomeContact";
import { HOME_SECTION_IDS } from "@/lib/nav";

/* Alma home page (Figma Alma · Home): hero, Produkty, Pilotný program, Rok 2027, Kto robí Almu, Kontakt */
export default function Home() {
  return (
    <>
      <Nav sectionIds={HOME_SECTION_IDS} />
      <main className="flex flex-1 flex-col">
        <HomeHero />
        <Products />
        <PilotProgram />
        <Year2027 />
        <About />
        <HomeContact
          title={
            <>
              Dohodnime si rozhovor
              <br />o vašej prevádzke.
            </>
          }
          lead="Napíšte, akú starostlivosť vediete. Ukážeme vám Alma ADOS a povieme, kedy príde produkt pre vašu službu."
          checks={[
            "Ukážka Alma ADOS online alebo u vás",
            "Správa, keď pôjde do pilotu produkt pre vašu službu",
            "Bez záväzku a bez zmluvy",
          ]}
        />
      </main>
      <Footer />
      <Reveal />
      <HashScroll />
      <ScrollBackdrop />
    </>
  );
}

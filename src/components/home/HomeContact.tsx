import { Eyebrow } from "@/components/ui/Eyebrow";
import { CheckItem } from "@/components/ui/CheckItem";
import { DecorRings } from "@/components/ui/DecorRings";
import { CONTACT } from "@/lib/nav";
import { Spotlight } from "@/components/home/Spotlight";
import { AlmaForm } from "@/components/home/AlmaForm";

/*
  Contact section of the Alma pages (Figma Alma · Home › Kontakt and the Pripravujeme template):
  copy on the left, the Alma form with the product choice on the right. Dark, with the cursor light.
*/
export function HomeContact({
  eyebrow = "Kontakt",
  title,
  lead,
  checks,
  product = "ados",
  submitLabel = "Odoslať správu",
  footnote = "Odoslaním nevzniká žiadny záväzok. Ozveme sa do dvoch pracovných dní.",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead: string;
  checks: readonly string[];
  /** Preselected product in the form */
  product?: string;
  submitLabel?: string;
  footnote?: string;
}) {
  return (
    <section id="kontakt" aria-label="Kontakt" data-bg="dark" className="relative overflow-hidden bg-bg-dark">
      <Spotlight className="py-12 lg:py-32">
        <DecorRings
          spin
          rings={[
            { size: 900, left: "-300px", top: "-200px", opacity: 0.25, dashed: true },
            { size: 560, left: "-200px", bottom: "-180px", opacity: 0.6, dashed: true },
            { size: 400, left: "-120px", bottom: "-100px", opacity: 0.45, dashed: true },
          ]}
          mobile={[
            { size: 340, left: "-170px", top: "-120px", opacity: 0.3, dashed: true },
            { size: 260, left: "-120px", bottom: "-90px", opacity: 0.55, dashed: true },
            { size: 160, left: "-60px", bottom: "-40px", opacity: 0.45, dashed: true },
          ]}
        />

        <div className="container-page relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-24">
          <div className="flex flex-col items-start gap-6 lg:w-[560px] lg:shrink-0 lg:gap-7">
            <Eyebrow variant="dark" className="gsap-reveal">
              {eyebrow}
            </Eyebrow>
            <h2 className="gsap-reveal text-mobile-h2 text-text-inverse lg:text-h2">{title}</h2>
            <p className="gsap-reveal max-w-[520px] text-body-m text-text-inverse-muted lg:text-body-l">{lead}</p>
            <ul className="gsap-reveal flex flex-col gap-3 pt-2">
              {checks.map((c) => (
                <CheckItem key={c} variant="dark">
                  {c}
                </CheckItem>
              ))}
            </ul>
            <div className="gsap-reveal flex flex-col gap-1 pt-2">
              <a
                href={`mailto:${CONTACT.email}`}
                className="focus-ring rounded-[4px] text-label-m text-text-inverse hover:text-accent-on-dark"
              >
                {CONTACT.email}
              </a>
              <p className="text-body-s text-text-inverse-muted">Odpovedáme do dvoch pracovných dní.</p>
            </div>
          </div>

          <AlmaForm product={product} submitLabel={submitLabel} footnote={footnote} />
        </div>
      </Spotlight>
    </section>
  );
}

import { LiveNumbers } from "@/components/home/LiveNumbers";

/*
  Pripravené na rok 2027 (Figma Alma · Home › Rok 2027): one quiet block with the verified legal dates
  and numbers that count from today (idea 5).
*/
export function Year2027() {
  return (
    <section id="rok-2027" aria-label="Pripravené na rok 2027" className="py-12 lg:py-28">
      <div className="container-page grid gap-8 lg:grid-cols-[480px_1fr] lg:gap-24">
        <h2 className="gsap-reveal text-mobile-h2 text-text-primary lg:text-h2">Pripravené na rok 2027</h2>
        <div className="flex flex-col gap-8">
          <p className="gsap-reveal max-w-[640px] text-body-m text-text-secondary lg:text-body-l">
            Príspevok na pomoc pri odkázanosti platí od 1. 1. 2027. Identifikátor eZdravie pre ADOS má podľa
            harmonogramu NCZI platiť od 1. 7. 2027. Produkty Alma na to staviame od začiatku.
          </p>
          <LiveNumbers />
        </div>
      </div>
    </section>
  );
}

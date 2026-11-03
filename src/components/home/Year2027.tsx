import { LiveNumbers } from "@/components/home/LiveNumbers";

/*
  Pripravené na rok 2027 (Figma Alma · Home › Rok 2027): one quiet block with the verified legal dates
  and numbers that count from today (idea 5).
*/
export function Year2027() {
  return (
    <section id="rok-2027" aria-label="Pripravené na rok 2027" className="py-12 lg:py-28">
      <div className="container-page flex flex-col gap-8 lg:gap-10">
        <div className="grid gap-4 lg:grid-cols-[480px_1fr] lg:items-end lg:gap-24">
          <h2 className="gsap-reveal text-mobile-h2 text-text-primary lg:text-h2">Pripravené na rok 2027</h2>
          <p className="gsap-reveal max-w-[640px] text-body-m text-text-secondary lg:text-body-l">
            Príspevok na pomoc pri odkázanosti patrí odkázanej osobe najskôr za január 2027. Od 1. 7. 2027 musí
            dávka ADOS pre poisťovňu obsahovať identifikátor záznamu v eZdravie. Produkty Alma na to staviame od
            začiatku.
          </p>
        </div>
        <LiveNumbers />
      </div>
    </section>
  );
}

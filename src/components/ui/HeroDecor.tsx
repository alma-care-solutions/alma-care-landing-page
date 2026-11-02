/*
  Hero decor per Figma (Hero › Decor), purely decorative: two radial blobs and two dashed nurse routes with stops.
  With `dots`, each route gets a dot that travels from stop to stop (HeroMotion animates it, idea 14).
*/
function Route({
  d,
  viewBox,
  stops,
  dot,
  className,
}: {
  d: string;
  viewBox: string;
  stops: [number, number][];
  dot: boolean;
  className: string;
}) {
  return (
    <svg
      data-hero="route"
      data-hero-decor
      viewBox={viewBox}
      className={className}
      fill="none"
      overflow="visible"
      aria-hidden="true"
    >
      <path d={d} stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 10" />
      {stops.map(([x, y]) => (
        <circle
          key={`${x}-${y}`}
          className="route-stop"
          cx={x}
          cy={y}
          r="4"
          fill="var(--color-bg-page)"
          stroke="var(--color-accent)"
          strokeWidth="2"
        />
      ))}
      {dot && <circle data-hero="route-dot" r="5" fill="var(--color-accent)" />}
    </svg>
  );
}

export function HeroDecor({ dots = false, variant = "centered" }: { dots?: boolean; variant?: "centered" | "product" }) {
  const home = variant === "product";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Blobs as CSS radial gradients (no network requests), values from the Figma SVG */}
      <span
        data-hero="decor"
        data-hero-blob
        className="absolute left-[calc(50%-20px)] top-[-300px] size-[1000px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,139,141,0.16)_0%,rgba(15,139,141,0.06)_45%,rgba(15,139,141,0)_70%)]"
      />
      <span
        data-hero="decor"
        data-hero-blob
        className="absolute left-[calc(50%-1080px)] top-[380px] size-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,139,141,0.12)_0%,rgba(15,139,141,0.04)_45%,rgba(15,139,141,0)_70%)]"
      />
      <Route
        viewBox="0 0 462 252"
        d="M1 1C121 1 141 121 241 121C341 121 361 251 461 251"
        stops={[
          [1, 1],
          [241, 121],
        ]}
        dot={dots}
        className={
          home
            ? "absolute right-[-30px] top-[8px] h-[120px] w-[220px] lg:left-[calc(50%+600px)] lg:right-auto lg:top-[40px] lg:h-[250px] lg:w-[460px]"
            : "absolute right-[-30px] top-[8px] h-[120px] w-[220px] lg:left-[calc(50%+340px)] lg:right-auto lg:top-[130px] lg:h-[250px] lg:w-[460px]"
        }
      />
      <Route
        viewBox="0 0 372 162"
        d="M1 161C101 161 121 71 211 71C291 71 301 1 371 1"
        stops={[
          [211, 71],
          [371, 1],
        ]}
        dot={dots}
        className={
          home
            ? "absolute left-[-50px] top-[46%] h-[90px] w-[210px] lg:left-[calc(50%-900px)] lg:top-[620px] lg:h-[160px] lg:w-[370px]"
            : "absolute left-[-50px] top-[58%] h-[90px] w-[210px] lg:left-[calc(50%-760px)] lg:top-[400px] lg:h-[160px] lg:w-[370px]"
        }
      />
    </div>
  );
}

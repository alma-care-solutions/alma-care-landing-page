/*
  Real screenshots of Alma ADOS used, whole and uncropped, as illustrations for the products in development:
  always a screen whose module the product will share with ADOS (plan of visits, overview of the day,
  statistics, intake from documents). Phone screens are shown in the phone frame, web screens in the browser frame.
*/
export type ScreenSpec = {
  kind: "web" | "phone";
  src: string;
  alt: string;
};

export const PRODUCT_SCREENS: Record<string, ScreenSpec> = {
  ados: {
    kind: "web",
    src: "/images/web-planning-2610.png",
    alt: "Webová aplikácia Alma ADOS, Plánovanie: týždeň návštev podľa sestier",
  },
  dos: {
    kind: "phone",
    src: "/images/phone-plan-2610.png",
    alt: "Plán návštev na deň v telefóne: obrazovka z aplikácie Alma, ktorú bude používať aj opatrovateľská služba",
  },
  stacionar: {
    kind: "web",
    src: "/images/web-stats-overview-2610.png",
    alt: "Mesačný prehľad a plnenie plánu: obrazovka z aplikácie Alma, ktorú bude používať aj stacionár",
  },
  pobytove: {
    kind: "web",
    src: "/images/web-intake-2610.png",
    alt: "Nový klient z dokumentov: obrazovka z aplikácie Alma, ktorú bude používať aj pobytové zariadenie",
  },
  "sluzby-a-pomocky": {
    kind: "phone",
    src: "/images/phone-today-2610.png",
    alt: "Prehľad dňa v telefóne: obrazovka z aplikácie Alma",
  },
};

export const ILLUSTRATION_NOTE = "Obrazovka z aplikácie Alma ADOS; tento modul bude súčasťou aj tohto produktu.";

/*
  Real screenshots of Alma ADOS used as illustrations for the other products: the crop is chosen so that the
  agency name and the ADOS navigation stay out of the frame. Focus = point of the image (in %) to zoom into.
*/
export type ScreenSpec = {
  src: string;
  alt: string;
  /** Point of interest in % of the image (x, y) */
  focus: [number, number];
  /** Zoom around the focus point (1 = whole image, object-fit cover) */
  zoom: number;
};

export const PRODUCT_SCREENS: Record<string, ScreenSpec> = {
  ados: {
    src: "/images/web-planning-2610.png",
    alt: "Webová aplikácia Alma ADOS, Plánovanie: týždeň návštev podľa sestier",
    focus: [50, 0],
    zoom: 1,
  },
  dos: {
    src: "/images/phone-plan-2610.png",
    alt: "Ilustračná obrazovka z aplikácie Alma: plán návštev na deň v telefóne",
    focus: [50, 46],
    zoom: 1.15,
  },
  stacionar: {
    src: "/images/web-stats-overview-2610.png",
    alt: "Ilustračná obrazovka z aplikácie Alma: mesačný prehľad návštev a plnenia plánu",
    focus: [62, 36],
    zoom: 1.7,
  },
  pobytove: {
    src: "/images/web-intake-2610.png",
    alt: "Ilustračná obrazovka z aplikácie Alma: nový klient z dokumentov",
    focus: [62, 30],
    zoom: 1.7,
  },
  "sluzby-a-pomocky": {
    src: "/images/phone-today-2610.png",
    alt: "Ilustračná obrazovka z aplikácie Alma: prehľad dňa v telefóne",
    focus: [50, 34],
    zoom: 1.2,
  },
};

export const ILLUSTRATION_NOTE = "Ilustračná obrazovka z aplikácie Alma. Obrazovky produktu doplníme v pilote.";

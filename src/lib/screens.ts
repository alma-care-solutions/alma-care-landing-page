/*
  Real screenshots used, whole and uncropped, as illustrations for the products in development:
  for DOS, Stacionár and Pobytové a screen of Alma ADOS whose module the product will share (plan of visits,
  statistics, wound record); for Služby a pomôcky the real patient app (apps/family in alma-ados, screenshot from
  the ALMA-412 docs). Phone screens are shown in the phone frame, web screens in the browser frame.
*/
export type ScreenSpec = {
  kind: "web" | "phone";
  src: string;
  alt: string;
  /** Caption under the illustration; ILLUSTRATION_NOTE when missing */
  note?: string;
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
    kind: "phone",
    src: "/images/phone-wound-2610.png",
    alt: "Záznam o rane pri výkone s porovnaním s minulým preväzom: obrazovka z aplikácie Alma ADOS, ošetrovateľské záznamy bude mať aj pobytové zariadenie",
  },
  "sluzby-a-pomocky": {
    kind: "phone",
    src: "/images/phone-family-today-2610.png",
    alt: "Aplikácia pre pacienta a rodinu, Dnes: najbližšia návšteva, sestra a tlačidlo Zavolať",
    note: "Obrazovka z aplikácie pre pacienta a rodinu, ktorá vzniká v pilote s Alma ADOS.",
  },
};

export function screenNote(slug: string) {
  return PRODUCT_SCREENS[slug]?.note ?? ILLUSTRATION_NOTE;
}

export const ILLUSTRATION_NOTE = "Obrazovka z aplikácie Alma ADOS; tento modul bude súčasťou aj tohto produktu.";

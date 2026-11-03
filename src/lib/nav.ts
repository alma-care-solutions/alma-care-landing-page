/*
  Site structure (v2): the Alma brand home page, the Alma ADOS product subpage and the "Pripravujeme" product pages.
  One menu on the whole site: Produkty (dropdown), Pilotný program, Rok 2027 and Tím (anchors on the home page);
  the contact form is reached through the header CTA.
*/
export type ProductStatus = "pilot" | "dev";

export type Product = {
  slug: string;
  name: string;
  /** Who it is for, one line (dropdown, footer, product rows) */
  audience: string;
  /** One sentence for the product list on the home page */
  summary: string;
  status: ProductStatus;
  statusLabel: string;
  href: string;
};

export const PRODUCTS: readonly Product[] = [
  {
    slug: "ados",
    name: "Alma ADOS",
    audience: "Agentúry domácej ošetrovateľskej starostlivosti",
    summary:
      "Mobilná aplikácia pre sestry v teréne a webová aplikácia pre vedenie agentúry. Plán návštev, dokumentácia hlasom, podklady pre poisťovne a eZdravie na jednom mieste.",
    status: "pilot",
    statusLabel: "V pilote · predaj 2027",
    href: "/ados",
  },
  {
    slug: "dos",
    name: "Alma DOS",
    audience: "Opatrovateľská služba",
    summary:
      "Opatrovateľská služba: rozpis návštev, potvrdenie príchodu, úkony podľa prílohy č. 4 a vyúčtovanie hodín pre klienta, obec aj príspevok na pomoc pri odkázanosti.",
    status: "dev",
    statusLabel: "Vo vývoji · predaj 2027",
    href: "/dos",
  },
  {
    slug: "stacionar",
    name: "Alma Stacionár",
    audience: "Denné stacionáre",
    summary: "Denné stacionáre: dochádzka s podpisom klienta, denný program, individuálne plány a zápisy do IS SoS.",
    status: "dev",
    statusLabel: "Vo vývoji · predaj 2027",
    href: "/stacionar",
  },
  {
    slug: "pobytove",
    name: "Alma Pobytové",
    audience: "Zariadenia pre seniorov, DSS",
    summary: "Zariadenia pre seniorov a DSS: karta klienta, lieky, strava, úhrady a odovzdávanie služby.",
    status: "dev",
    statusLabel: "Vo vývoji · predaj 2027",
    href: "/pobytove",
  },
  {
    slug: "sluzby-a-pomocky",
    name: "Alma Služby a pomôcky",
    audience: "Pacient a rodina: prehľad, pomôcky a služby navyše",
    summary:
      "Pre pacienta a rodinu: prehľad o vlastnej starostlivosti, požičanie alebo dokúpenie pomôcok a služieb navyše.",
    status: "dev",
    statusLabel: "Vo vývoji · predaj 2027",
    href: "/sluzby-a-pomocky",
  },
] as const;

export const ADOS = PRODUCTS[0];

export function productBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/* Menu links next to the Produkty dropdown; the contact form is reached through the header CTA "Dohodnúť si ukážku" */
export const NAV_LINKS = [
  { href: "/#pilotny-program", label: "Pilotný program" },
  { href: "/#rok-2027", label: "Rok 2027" },
  { href: "/#o-alme", label: "Tím" },
] as const;

/* Home page sections watched for the active menu item */
export const HOME_SECTION_IDS = ["produkty", "pilotny-program", "rok-2027", "o-alme", "kontakt"] as const;

/* Alma ADOS subpage: in-page links shown in the product bar, sections watched for the active item */
export const ADOS_SECTION_LINKS = [
  { href: "#produkt", label: "Ako to funguje" },
  { href: "#pre-sestry", label: "V teréne" },
  { href: "#pre-ados", label: "V kancelárii" },
  { href: "#kalkulacka", label: "Kalkulačka" },
] as const;

export const ADOS_SECTION_IDS = ["produkt", "pre-sestry", "pre-ados", "kalkulacka", "faq", "kontakt"] as const;

export const CONTACT = {
  company: "Alma Care Solutions s. r. o.",
  email: "info@alma-care.eu",
} as const;

/* Pilot partner of Alma ADOS (named once per page, with its logo) */
export const PARTNER = {
  name: "Arcidiecézna charita Košice",
  since: "od októbra 2026",
  logo: "/images/partners/adchke.png",
  logoWidth: 1134,
  logoHeight: 524,
} as const;

/* People behind Alma (Kto robí Almu): the two founders with their roles, and the rest of the team in one line.
   Photos in public/images/team/ (same crop and tonal grade for both); a face without a photo renders as a silhouette. */
export const TEAM = {
  faces: [
    { photo: "/images/team/maros-2611.jpg" as string | null, name: "Maroš Šmrek", role: "Návrh a vývoj produktu" },
    { photo: "/images/team/gabriel-2611.jpg" as string | null, name: "Gabriel Tutoky", role: "Architektúra a vývoj" },
    { photo: null as string | null, name: "Meno doplníme", role: "Rola doplníme" },
    { photo: null as string | null, name: "Meno doplníme", role: "Rola doplníme" },
  ],
  /* The rest of the team, shown as the last tile */
  othersCount: "5+",
  others: "ďalších ľudí: vývojári, testeri a IT špecialisti",
} as const;

/* Verified dates used by the live numbers on the home page */
export const DATES = {
  pilotStart: "2026-10-28", // start of the day count on the home page; set to the signed date once the pilot contract is signed
  allowance: "2027-01-01", // príspevok na pomoc pri odkázanosti, zákon 406/2025 Z. z.
  ezdravie: "2027-07-01", // identifikátor záznamu v eZdravie v zúčtovacej dávke ADOS, zákon 136/2026 Z. z.
} as const;

/*
  Site structure (v2): the Alma brand home page, the Alma ADOS product subpage and the "Pripravujeme" product pages.
  One menu on the whole site: Produkty (dropdown), O Alme (anchor on the home page), Kontakt (form on the current page).
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
    audience: "Opatrovateľská služba, hospice",
    summary:
      "Opatrovateľská služba a hospice: rozpis návštev, potvrdenie príchodu, úkony podľa zákona a podklady pre obec aj príspevok na odkázanosť.",
    status: "dev",
    statusLabel: "Vo vývoji · 2027",
    href: "/dos",
  },
  {
    slug: "stacionar",
    name: "Alma Stacionár",
    audience: "Denné stacionáre",
    summary: "Denné stacionáre: dochádzka, denný program, individuálne plány a hlásenia do IS SoS.",
    status: "dev",
    statusLabel: "Vo vývoji · 2027",
    href: "/stacionar",
  },
  {
    slug: "pobytove",
    name: "Alma Pobytové",
    audience: "Zariadenia pre seniorov, DSS",
    summary: "Zariadenia pre seniorov a DSS: karta klienta, lieky, strava, úhrady a odovzdávanie služby.",
    status: "dev",
    statusLabel: "Vo vývoji · 2027",
    href: "/pobytove",
  },
  {
    slug: "sluzby-a-pomocky",
    name: "Alma Služby a pomôcky",
    audience: "Pacient a rodina: prehľad, pomôcky a služby navyše",
    summary:
      "Pre pacienta a rodinu: prehľad o vlastnej starostlivosti, požičanie alebo dokúpenie pomôcok a služieb navyše.",
    status: "dev",
    statusLabel: "Vo vývoji · 2027",
    href: "/sluzby-a-pomocky",
  },
] as const;

export const ADOS = PRODUCTS[0];

export function productBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

/* Menu links next to the Produkty dropdown. "O Alme" lives on the home page, "Kontakt" is on every page. */
export const NAV_LINKS = [
  { href: "/#o-alme", label: "O Alme" },
  { href: "#kontakt", label: "Kontakt" },
] as const;

/* Home page sections watched for the active menu item */
export const HOME_SECTION_IDS = ["produkty", "rok-2027", "o-alme", "kontakt"] as const;

/* Alma ADOS subpage: in-page links shown in the product bar, sections watched for the active item */
export const ADOS_SECTION_LINKS = [
  { href: "#produkt", label: "Ako to funguje" },
  { href: "#pre-sestry", label: "V teréne" },
  { href: "#pre-ados", label: "V kancelárii" },
  { href: "#kalkulacka", label: "Kalkulačka" },
  { href: "#pilotny-program", label: "Pilotný program" },
] as const;

export const ADOS_SECTION_IDS = ["produkt", "pre-sestry", "pre-ados", "kalkulacka", "pilotny-program", "faq", "kontakt"] as const;

export const CONTACT = {
  company: "Alma Care Solutions s. r. o.",
  email: "info@mail.alma-care.eu",
} as const;

/* Pilot partner of Alma ADOS (named once per page, with its logo) */
export const PARTNER = {
  name: "Arcidiecézna charita Košice",
  since: "od októbra 2026",
  logo: "/images/partners/adchke.png",
  logoWidth: 1134,
  logoHeight: 524,
} as const;

/* Verified dates used by the live numbers on the home page */
export const DATES = {
  pilotStart: "2026-10-01",
  allowance: "2027-01-01", // príspevok na pomoc pri odkázanosti, zákon 406/2025 Z. z.
  ezdravie: "2027-07-01", // identifikátor eZdravie pre ADOS, harmonogram NCZI (nie je právne záväzný)
} as const;

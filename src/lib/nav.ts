/*
  Anchors are absolute ("/#…") so they also work from subpages (/dakujeme, /ochrana-osobnych-udajov).
  Labels: named after where the system is used, the field (nurses) and the office (ADOS management).
*/
export const NAV_LINKS = [
  { href: "/#produkt", label: "Ako to funguje" },
  { href: "/#pre-sestry", label: "V teréne" },
  { href: "/#pre-ados", label: "V kancelárii" },
  { href: "/#kalkulacka", label: "Kalkulačka" },
  { href: "/#pilotny-program", label: "Pilotný program" },
] as const;

/* Mobile menu has the same items as desktop; contact is always via the „Zapojiť sa" CTA */
export const MOBILE_NAV_LINKS = NAV_LINKS;

export const SECTION_IDS = ["produkt", "pre-sestry", "pre-ados", "kalkulacka", "pilotny-program", "faq", "kontakt"] as const;

export const CONTACT = {
  company: "Alma Care Solutions s. r. o.",
  email: "info@alma-care.eu",
} as const;

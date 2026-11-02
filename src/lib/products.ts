/*
  Content of the "Pripravujeme" product pages (Figma Šablóna · Pripravujeme). One record per product in development.
  Dates: products only as years, exact dates only for legislation. No claims about shared data between products:
  every Alma product is a separate application.
*/
export type ProductContent = {
  slug: string;
  hero: { title: string; lead: string; note: string };
  solves: { title: string; lead: string; note: string; items: { title: string; text: string }[] };
  audience: { title: string; intro: string; roles: string[] };
  changes?: {
    title: string;
    headline: string;
    text: string;
    items: { date: string; label: string }[];
  };
  contact: { title: string; lead: string; checks: string[] };
};

const SAME_TEAM = "Vyvíjame ho súbežne s Alma ADOS, ktorý už beží v pilote. Rovnaké ovládanie a ten istý tím.";

const SOCIAL_CHANGES = (service: string, unit: string) => ({
  title: "Čo sa mení",
  headline: "Od januára 2027 platí klient službu z vlastného príspevku.",
  text: `Príspevok na pomoc pri odkázanosti (zákon 406/2025 Z. z.) dostane priamo odkázaná osoba. ${service} musí vedieť vyúčtovať ${unit} na konkrétneho klienta a hlásiť prijímateľov do IS SoS do 15 dní. Počítame s tým od prvého dňa.`,
  items: [
    { date: "1. 1. 2027", label: "Príspevok na pomoc pri odkázanosti" },
    { date: "Priebežne", label: "Hlásenia do IS SoS do 15 dní od zmluvy" },
    { date: "2027", label: "Pilot a predaj" },
  ],
});

const contact = (name: string, who: string): ProductContent["contact"] => ({
  title: `Chcete byť pri ${name} medzi prvými?`,
  lead: `Zapíšeme vás medzi prvé ${who}, ozveme sa pred pilotom a ukážeme, ako ${name} vyzerá. Vaše poznámky z praxe ovplyvnia, čo postavíme ako prvé.`,
  checks: [
    `${name} je vo vývoji, príde v roku 2027`,
    "Rovnaké ovládanie ako Alma ADOS, ktorý už beží",
    "Bez záväzkov, odhlásiť sa dá kedykoľvek",
  ],
});

export const PRODUCT_CONTENT: readonly ProductContent[] = [
  {
    slug: "dos",
    hero: {
      title: "Opatrovateľská služba bez papierových výkazov.",
      lead: "Alma DOS je aplikácia pre opatrovateľky a opatrovateľov v teréne a web pre vedenie služby. Rozpis návštev, potvrdenie príchodu, záznam úkonov a podklady pre obec aj pre nový príspevok na odkázanosť.",
      note: SAME_TEAM,
    },
    solves: {
      title: "Čo bude Alma DOS riešiť",
      lead: "Štyri veci, ktoré dnes berú opatrovateľskej službe najviac času.",
      note: "Zoznam vychádza z rozhovorov s poskytovateľmi a z toho, čo už funguje v Alma ADOS. Poradie a detaily upresníme v pilote.",
      items: [
        { title: "Rozpis návštev a hodín", text: "Plán dňa pre každú opatrovateľku, zmeny v reálnom čase a hodiny, ktoré sa počítajú samy." },
        { title: "Potvrdenie príchodu u klienta", text: "Príchod a odchod jedným klepnutím, aj bez signálu. Žiadne papierové výkazy na podpis." },
        { title: "Záznam úkonov podľa zákona", text: "Úkony podľa prílohy zákona o sociálnych službách, pripravené pre hlásenia a vyúčtovanie." },
        { title: "Podklady pre obec a príspevok", text: "Mesačné výkazy pre obec, zriaďovateľa a od roku 2027 aj pre príspevok na pomoc pri odkázanosti." },
      ],
    },
    audience: {
      title: "Pre koho",
      intro: "Obce, charity a neziskovky s opatrovateľskou službou. Hospice s domácou starostlivosťou.",
      roles: [
        "Vedúca opatrovateľskej služby: rozpis, výkazy, kontrola hodín",
        "Opatrovateľka v teréne: plán dňa a úkony v telefóne",
        "Ekonómka a obec: podklady k vyúčtovaniu bez prepisovania",
      ],
    },
    changes: SOCIAL_CHANGES("Služba", "hodiny"),
    contact: contact("Alma DOS", "služby"),
  },
  {
    slug: "stacionar",
    hero: {
      title: "Denný stacionár s dochádzkou, ktorá sa počíta sama.",
      lead: "Alma Stacionár je aplikácia pre denné stacionáre: príchody a odchody klientov, denný program, individuálne plány a hlásenia do IS SoS bez prepisovania.",
      note: SAME_TEAM,
    },
    solves: {
      title: "Čo bude Alma Stacionár riešiť",
      lead: "Štyri veci, ktoré dnes berú stacionáru najviac času.",
      note: "Zoznam vychádza z rozhovorov s poskytovateľmi a z toho, čo už funguje v Alma ADOS. Poradie a detaily upresníme v pilote.",
      items: [
        { title: "Dochádzka klientov", text: "Príchod a odchod jedným klepnutím, hodiny pre vyúčtovanie sa počítajú samy." },
        { title: "Denný program", text: "Plán aktivít na deň aj týždeň, kto sa zúčastnil a čo sa menilo." },
        { title: "Individuálne plány", text: "Ciele a záznamy ku každému klientovi, pripravené na kontrolu." },
        { title: "Hlásenia a podklady", text: "Prijímatelia a zmeny nahlásené v lehotách, podklady pre zriaďovateľa a od roku 2027 aj pre príspevok na odkázanosť." },
      ],
    },
    audience: {
      title: "Pre koho",
      intro: "Obce, charity, neziskovky a súkromní poskytovatelia s denným stacionárom.",
      roles: [
        "Vedúca stacionára: dochádzka, program, hlásenia",
        "Pracovník v stacionári: denný záznam v telefóne alebo tablete",
        "Ekonómka a zriaďovateľ: podklady k vyúčtovaniu bez prepisovania",
      ],
    },
    changes: SOCIAL_CHANGES("Stacionár", "dni a hodiny"),
    contact: contact("Alma Stacionár", "stacionáre"),
  },
  {
    slug: "pobytove",
    hero: {
      title: "Pobytové zariadenie bez zošitov a prepisovania.",
      lead: "Alma Pobytové je aplikácia pre zariadenia pre seniorov a domovy sociálnych služieb: karta klienta, lieky, strava, úhrady a odovzdávanie služby medzi zmenami.",
      note: SAME_TEAM,
    },
    solves: {
      title: "Čo bude Alma Pobytové riešiť",
      lead: "Štyri veci, ktoré dnes berú pobytovému zariadeniu najviac času.",
      note: "Zoznam vychádza z rozhovorov s poskytovateľmi a z toho, čo už funguje v Alma ADOS. Poradie a detaily upresníme v pilote.",
      items: [
        { title: "Karta klienta", text: "Zmluva, stupeň odkázanosti, kontakty na rodinu a história na jednom mieste." },
        { title: "Lieky a strava", text: "Podávanie liekov a diéty podľa dňa, s potvrdením, kto a kedy." },
        { title: "Úhrady", text: "Mesačné úhrady, vratky za neprítomnosť a podklady pre ekonómku." },
        { title: "Odovzdávanie služby", text: "Čo sa stalo na zmene a čo treba sledovať, bez papierovej knihy hlásení." },
      ],
    },
    audience: {
      title: "Pre koho",
      intro: "Zariadenia pre seniorov, domovy sociálnych služieb a špecializované zariadenia.",
      roles: [
        "Riaditeľ a sociálny pracovník: zmluvy, úhrady, hlásenia",
        "Opatrovateľ a sestra v zariadení: záznamy na zmene",
        "Ekonómka: úhrady a vratky bez prepisovania",
      ],
    },
    changes: SOCIAL_CHANGES("Zariadenie", "pobyt"),
    contact: contact("Alma Pobytové", "zariadenia"),
  },
  {
    slug: "sluzby-a-pomocky",
    hero: {
      title: "Pacient vidí svoju starostlivosť a vie si k nej niečo pridať.",
      lead: "Alma Služby a pomôcky je aplikácia pre pacientov a ich rodiny: prehľad o vlastnej starostlivosti, kto a kedy príde, a možnosť požičať si alebo dokúpiť pomôcky a služby navyše.",
      note: SAME_TEAM,
    },
    solves: {
      title: "Čo bude Alma Služby a pomôcky riešiť",
      lead: "Štyri veci, ktoré dnes pacient a rodina vybavujú telefonátmi.",
      note: "Zoznam vychádza z rozhovorov s poskytovateľmi a rodinami. Poradie a detaily upresníme v pilote.",
      items: [
        { title: "Prehľad o sebe", text: "Kedy príde sestra alebo opatrovateľka a čo sa pri poslednej návšteve robilo." },
        { title: "Pomôcky", text: "Požičanie alebo kúpa pomôcok, ktoré starostlivosť potrebuje, bez telefonátov." },
        { title: "Služby navyše", text: "Doprava na kontrolu, donáška alebo sprievod, objednané z aplikácie." },
        { title: "Rodina", text: "Prístup pre blízkych, ktorí sa o pacienta starajú spolu so službou." },
      ],
    },
    audience: {
      title: "Pre koho",
      intro: "Pacienti a klienti poskytovateľov, ktorí používajú produkty Alma, a ich rodiny.",
      roles: [
        "Pacient alebo klient: prehľad a objednávky v telefóne",
        "Rodina: rovnaký prehľad so súhlasom pacienta",
        "Poskytovateľ: ponuka pomôcok a služieb pre svojich klientov",
      ],
    },
    contact: contact("Alma Služby a pomôcky", "poskytovateľov a rodiny"),
  },
];

export function productContent(slug: string) {
  return PRODUCT_CONTENT.find((p) => p.slug === slug);
}

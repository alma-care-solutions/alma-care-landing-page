/*
  Content of the "Pripravujeme" product pages (Figma Šablóna · Pripravujeme). One record per product in development.
  Dates: products only as years, exact dates only for legislation. No claims about shared data between products:
  every Alma product is a separate application.
*/
export type ProductContent = {
  slug: string;
  hero: { title: string; lead: string; note: string };
  solves: { title: string; lead: string; note: string; items: { title: string; text: string }[]; outro: string };
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

/*
  Verified against zákon 406/2025 Z. z. (Čl. I účinný 31. 12. 2026, nárok najskôr za január 2027, § 3, § 4 ods. 9, § 18)
  and zákon 448/2008 Z. z. v znení od 31. 12. 2026 (§ 61a, § 72 ods. 8, § 78a, § 105b). The príspevok covers terénna
  and ambulantná forma, not celoročný pobyt.
*/
const AMBULANT_CHANGES = (service: string, extra: string) => ({
  title: "Čo sa mení",
  headline: "Od januára 2027 platí klient službu aj z príspevku na pomoc pri odkázanosti.",
  text: `Príspevok (zákon 406/2025 Z. z.) dostáva odkázaná osoba priamo z úradu práce, najskôr za január 2027. Nárok na výplatu vzniká až po preukázaní zaplatenej úhrady, preto klient potrebuje od ${service} mesačné vyúčtovanie hodín a úhrady. ${service} musí mať v IS SoS zapísaný záväzok poskytovať službu vo všeobecnom hospodárskom záujme (§ 61a zákona 448/2008 Z. z.), inak klient príspevok na ňu nedostane.${extra}`,
  items: [
    { date: "31. 12. 2026", label: "Účinnosť príspevku; záväzok služby vo všeobecnom hospodárskom záujme sa zapisuje do IS SoS (do 31. 1. 2027 platí od 1. 1. 2027)" },
    { date: "Január 2027", label: "Prvý mesiac s nárokom na príspevok, výplata po preukázaní úhrady" },
    { date: "Priebežne", label: "Prijímatelia, zamestnanci a cenník v IS SoS do 15 dní (§ 105b)" },
    { date: "2027", label: "Pilot a predaj" },
  ],
});

const RESIDENTIAL_CHANGES = {
  title: "Čo sa mení",
  headline: "Príspevok na pomoc pri odkázanosti sa celoročného pobytu netýka, zmeny prídu cez IS SoS.",
  text: "Zákon 406/2025 Z. z. dáva príspevok odkázanej osobe pri terénnej a ambulantnej službe, pri pobytovej len pri odľahčovacej službe do 30 dní. Pobytové zariadenie ostáva pri úhrade klienta (§ 72 zákona 448/2008 Z. z.), príspevku MPSVR pre pobytovú formu (§ 78a, od roku 2027 len ako služba vo všeobecnom hospodárskom záujme podľa § 61a) a príspevkoch obce alebo VÚC. Príspevok klienta sa pritom započítava do jeho príjmu pri úhrade (§ 73).",
  items: [
    { date: "31. 12. 2026", label: "Záväzok služby vo všeobecnom hospodárskom záujme, ročný rozpočet a zúčtovanie v IS SoS (§ 61a)" },
    { date: "Priebežne", label: "Prijímatelia, zamestnanci a cenník v IS SoS do 15 dní (§ 105b)" },
    { date: "2027", label: "Pilot a predaj" },
  ],
};

const SOLVES_OUTRO =
  "A všetko ďalšie, čo zariadenie potrebuje na bezproblémový chod administratívy a správy. Čo pôjde ako prvé, ukáže pilot.";

const SOURCE_NOTE =
  "Zoznam vychádza zo zákona o sociálnych službách (448/2008 Z. z. v znení od 31. 12. 2026), zo zákona 406/2025 Z. z. o príspevku na pomoc pri odkázanosti, z usmernení MPSVR k IS SoS a k zúčtovaniu príspevkov a z toho, čo už funguje v Alma ADOS. Poradie a detaily upresníme v pilote.";

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
      lead: "Alma DOS je aplikácia pre opatrovateľky a opatrovateľov v teréne a web pre vedenie služby. Rozpis návštev, potvrdenie príchodu, záznam úkonov a vyúčtovanie hodín pre klienta, obec aj príspevok na pomoc pri odkázanosti.",
      note: SAME_TEAM,
    },
    solves: {
      title: "Čo bude Alma DOS riešiť",
      lead: "Štyri veci, ktoré dnes berú opatrovateľskej službe najviac času.",
      note: SOURCE_NOTE,
      outro: SOLVES_OUTRO,
      items: [
        { title: "Rozpis návštev a hodín", text: "Plán dňa pre každú opatrovateľku a hodiny u každého klienta podľa zmluvy a stupňa odkázanosti. Evidencia služby musí obsahovať počet hodín a úhradu za hodinu alebo za úkon (§ 95 ods. 4 zákona 448/2008 Z. z.)." },
        { title: "Potvrdenie príchodu u klienta", text: "Príchod a odchod jedným klepnutím, aj bez signálu. Mesačné vyúčtovanie hodín a úhrady pre klienta vzniká z návštev, nie z papiera. Od roku 2027 ním klient preukazuje úhradu pre príspevok na pomoc pri odkázanosti." },
        { title: "Úkony podľa prílohy č. 4", text: "Sebaobslužné úkony, úkony starostlivosti o domácnosť, základné sociálne aktivity a dohľad presne tak, ako ich člení príloha č. 4 zákona (§ 41 ods. 2), aby sa dali plánovať aj vyúčtovať." },
        { title: "Podklady pre obec a IS SoS", text: "Podklad pre finančný príspevok obce na prevádzku, ktorý sa určuje na počet hodín opatrovateľskej služby (§ 75 a § 77). Zápis prijímateľov a zamestnancov do IS SoS do 15 dní a prevádzkové a finančné údaje raz ročne do konca apríla (§ 105b)." },
      ],
    },
    audience: {
      title: "Pre koho",
      intro: "Obce, charity a neziskové organizácie s opatrovateľskou službou.",
      roles: [
        "Vedúca opatrovateľskej služby: rozpis, výkazy, kontrola hodín",
        "Opatrovateľka v teréne: plán dňa a úkony v telefóne",
        "Ekonómka a obec: podklady k vyúčtovaniu bez prepisovania",
      ],
    },
    changes: AMBULANT_CHANGES("služby", ""),
    contact: contact("Alma DOS", "služby"),
  },
  {
    slug: "stacionar",
    hero: {
      title: "Denný stacionár s dochádzkou, ktorá sa počíta sama.",
      lead: "Alma Stacionár je aplikácia pre denné stacionáre: dochádzka klientov s podpisom, denný program, individuálne plány a zápisy do IS SoS bez prepisovania.",
      note: SAME_TEAM,
    },
    solves: {
      title: "Čo bude Alma Stacionár riešiť",
      lead: "Štyri veci, ktoré dnes berú stacionáru najviac času.",
      note: SOURCE_NOTE,
      outro: SOLVES_OUTRO,
      items: [
        { title: "Dochádzka klientov s podpisom", text: "Príchod a odchod jedným klepnutím a denná evidencia prítomnosti s hodinami a podpisom klienta, ktorú zákon vyžaduje (§ 78a zákona 448/2008 Z. z.). Z nej vzniká podklad pre úhrady aj pre štvrťročné zúčtovanie príspevku MPSVR za rok 2026." },
        { title: "Individuálny plán a záznamy", text: "Individuálny plán pre každého klienta, záznamy o priebehu služby a jeho hodnotenie s účasťou klienta (§ 9 ods. 1 zákona 448/2008 Z. z.), pripravené na dozor inšpekcie v sociálnych veciach (zákon 345/2022 Z. z.)." },
        { title: "Denný program", text: "Plán aktivít na deň aj týždeň, kto sa zúčastnil a čo sa menilo, bez prepisovania do zošita." },
        { title: "IS SoS a vyúčtovanie pre klienta", text: "Zápis klientov, zamestnancov a žiadateľov do IS SoS do 15 dní a prevádzkové a finančné údaje raz ročne (§ 105b). Od roku 2027 mesačné vyúčtovanie hodín a úhrady, ktorým klient preukazuje nárok na príspevok na pomoc pri odkázanosti." },
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
    changes: AMBULANT_CHANGES("stacionára", " Štátny príspevok MPSVR na ambulantnú formu (§ 78a) končí rokom 2026; od roku 2027 stacionár financuje úhrada klienta s príspevkom a príspevok obce na prevádzku."),
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
      note: SOURCE_NOTE,
      outro: SOLVES_OUTRO,
      items: [
        { title: "Karta klienta a individuálny plán", text: "Zmluva, stupeň odkázanosti, kontakty na rodinu a individuálny plán so záznamami a hodnotením, ktorý zákon pre zariadenia pre seniorov a DSS vyžaduje (§ 9 ods. 1 zákona 448/2008 Z. z.)." },
        { title: "Lieky a ošetrovateľské záznamy", text: "Podávanie liekov ako úkon podľa prílohy č. 4 a ošetrovateľská starostlivosť hradená zo zdravotného poistenia (§ 22), s potvrdením, kto a kedy, rovnako ako pri návšteve v Alma ADOS." },
        { title: "Úhrady a neprítomnosť", text: "Mesačné úhrady podľa zmluvy a dni neprítomnosti, za ktoré klient neplatí odborné, obslužné a ďalšie činnosti, len ubytovanie (§ 72 ods. 8). Podmienky zúčtovania a vrátenia úhrady podľa zmluvy (§ 74)." },
        { title: "Odovzdávanie služby a IS SoS", text: "Čo sa stalo na zmene a čo treba sledovať, bez papierovej knihy hlásení. Zápis prijímateľov a zamestnancov do IS SoS do 15 dní, cenník v IS SoS a prevádzkové a finančné údaje raz ročne (§ 105b)." },
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
    changes: RESIDENTIAL_CHANGES,
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
      lead: "Päť vecí, ktoré dnes pacient a rodina vybavujú telefonátmi.",
      note: "Zoznam vychádza z toho, čo pacienti a rodiny dnes riešia telefonátmi s agentúrou, a z toho, čo už funguje v Alma ADOS. Poradie a detaily upresníme v pilote.",
      outro: "A všetko ďalšie, čo pacient a rodina potrebujú pri starostlivosti vybaviť bez telefonátov.",
      items: [
        { title: "Prehľad o sebe", text: "Kedy príde sestra alebo opatrovateľka a čo sa pri poslednej návšteve robilo." },
        { title: "Správy so zariadením", text: "Správa pre kanceláriu alebo sestru priamo v aplikácii namiesto telefonátu. Odpoveď príde na to isté miesto a nič sa nestratí." },
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

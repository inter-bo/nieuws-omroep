# Product Requirements Document — Nieuws Omroep

> Versie 0.9.9 | Laatst bijgewerkt: 2026-03-06

## 1. Productoverzicht

**Nieuws Omroep** is een mobiele nieuwsaggregator voor Nederlandse regionale publieke omroepen, georganiseerd per provincie. De app bundelt RSS-feeds van 18 regionale bronnen uit alle 12 provincies in één overzichtelijke interface.

### Doelgroep

- Nederlanders die regionaal nieuws willen volgen
- Gebruikers die meerdere regionale omroepen in één app willen lezen
- Mensen die controle willen over welke bronnen en provincies ze zien

### Kernwaardepropositie

Eén app voor al het regionale nieuws uit Nederland — gefilterd op provincie, met favorieten en persoonlijke voorkeuren.

---

## 2. Tech Stack

| Laag | Technologie |
|------|-------------|
| Framework | React Native 0.81 + Expo SDK 54 |
| Taal | TypeScript (strict) |
| Routing | expo-router 6 (file-based) |
| State | Redux Toolkit 2.3 + redux-persist |
| Opslag | AsyncStorage |
| RSS parsing | fast-xml-parser 4.5 |
| Artikelweergave | react-native-webview |
| Afbeeldingen | expo-image |
| Animaties | react-native-reanimated 4 |
| Gestures | react-native-gesture-handler 2.28 |
| SVG | react-native-svg + react-native-svg-transformer |

---

## 3. Informatiearchitectuur

### 3.1 Navigatiestructuur

```
Root (_layout.tsx)
├── Header (globaal, verborgen op artikelpagina)
├── Drawer (zijmenu)
│   ├── Nieuws Bronnen        → /menu/nieuws-bronnen
│   ├── Favorieten Beheer     → /menu/favorieten-beheer
│   ├── Feedback              → /menu/feedback
│   ├── Beoordeel de App      → App Store / Play Store
│   ├── Privacybeleid         → /menu/privacy-policy
│   └── Gebruikersovereenkomst → /menu/gebruikersovereenkomst
├── (tabs) — Stack navigator
│   ├── index         → Nieuwsfeed (hoofd scherm)
│   ├── favorites     → Favoriete bronnen artikelen
│   ├── settings      → Instellingen
│   └── about         → Over de app
└── article/[url]     → Artikelweergave (WebView)
```

### 3.2 Datamodel

```
NewsCategory (provincie)
 ├── id: string           (bijv. "drenthe")
 ├── name: string         (bijv. "Drenthe")
 └── feeds: RssFeed[]
      ├── id: string
      ├── url: string     (RSS feed URL)
      ├── name: string    (bijv. "RTV Drenthe")
      └── enabled: boolean

NewsArticle
 ├── id: string           (nanoid)
 ├── title: string
 ├── description: string  (HTML gestript)
 ├── imageUrl?: string
 ├── category: string     (feed naam)
 ├── source: string
 ├── url: string          (origineel artikel)
 └── publishedAt: string  (ISO datum)
```

### 3.3 Redux State

| Slice | Verantwoordelijkheid | Persistent |
|-------|---------------------|------------|
| `newsSlice` | Categorieën + opgehaalde artikelen per `categoryId` | Nee |
| `settingsSlice` | Feed/categorie toggles, dark mode, onboarding flag | Ja |
| `favoriteSourcesSlice` | Favoriete feed-ID's | Ja |

---

## 4. Huidige features (v0.9.9)

### 4.1 Nieuwsfeed

- **Horizontale tab-navigatie** per provincie met "Alle Nieuws" als eerste tab
- **Lazy loading** — categorie wordt pas opgehaald bij eerste bezoek aan tab
- **Batched fetching** — max 3 feeds tegelijk om JS-thread niet te blokkeren
- **Pull-to-refresh** per categorie
- **Artikelkaarten** met afbeelding, provincielabel (accent kleur), bron, titel
- **Sortering** op publicatiedatum (nieuwste eerst)

### 4.2 Artikelweergave

- WebView-gebaseerde weergave van origineel artikel
- Deelfunctionaliteit via native Share API
- Toolbar met terug-knop en deel-knop

### 4.3 Favorieten

- Bronnen markeren als favoriet
- Gefilterde weergave van alleen favoriete bronnen
- Lege states bij geen favorieten of geen geladen artikelen

### 4.4 Instellingen

- **Dark mode toggle** (vlag aanwezig, volledige kleurwissel nog niet geïmplementeerd)
- **Categorie toggles** — schakel hele provincie in/uit (cascadeert naar feeds)
- **Individuele feed toggles** — per bron aan/uit

### 4.5 Zijmenu (Drawer)

- Geanimeerd slide-out menu (280px breed)
- Navigatie naar: Nieuws Bronnen, Favorieten Beheer, Feedback, App Beoordeling, Privacy, Voorwaarden

### 4.6 Technische features

- **Retry logic** — 503/429/502/504 met 1s delay, max 3 retries, 5s abort timeout
- **Feed-specifieke image extractors** (Haarlem Updates, Omroep Flevoland)
- **Redux persistence** via AsyncStorage (instellingen + favorieten)
- **Error handling** met fout- en laadstates per categorie

---

## 5. Databronnen (RSS Feeds)

| Provincie | Bronnen |
|-----------|---------|
| Drenthe | RTV Drenthe |
| Flevoland | Omroep Flevoland |
| Friesland | Omrop Fryslan, Friesch Dagblad, Leeuwarder Courant |
| Groningen | RTV Noord, DVHN |
| Gelderland | Omroep GLD |
| Limburg | L1 |
| Noord-Brabant | Omroep Brabant, Eindhovens Dagblad |
| Noord-Holland | AT5, Haarlem Updates |
| Overijssel | OOST.nl |
| Utrecht | RTV Utrecht |
| Zeeland | Omroep Zeeland |
| Zuid-Holland | Omroep West, LOK |

**Totaal: 18 feeds, 12 provincies**

---

## 6. Theming & Design

### Kleurenschema

- **Primair:** `#003366` (donkerblauw)
- **Secundair:** `#005580`
- **Achtergrond (dark):** `#002244`
- **Tekst:** `#FFFFFF` (dark) / `#1A1A2E` (light)

### Provinciekleur-accenten

| Provincie | Kleur |
|-----------|-------|
| Drenthe | `#8E44AD` (paars) |
| Flevoland | `#2980B9` (blauw) |
| Friesland | `#16A085` (teal) |
| Groningen | `#27AE60` (groen) |
| Gelderland | `#F39C12` (oranje) |
| Limburg | `#C0392B` (rood) |
| Noord-Brabant | `#E74C3C` (lichtrood) |
| Noord-Holland | `#8E44AD` (paars) |
| Overijssel | `#D35400` (donkeroranje) |
| Utrecht | `#1ABC9C` (cyaan) |
| Zuid-Holland | `#E67E22` (oranje) |
| Zeeland | `#3498DB` (lichtblauw) |

---

## 7. Roadmap — Openstaande items

### 7.1 Hoge prioriteit

| Item | Beschrijving | Status |
|------|-------------|--------|
| Dark/light mode wissel | Kleurenschema daadwerkelijk toepassen op UI (vlag bestaat al) | Niet gestart |
| Onboarding flow | Eerste-keer-gebruik flow (vlag `hasSeenOnboarding` bestaat) | Niet gestart |
| Zoekfunctionaliteit | Artikelen doorzoeken op titel/beschrijving | Niet gestart |
| Push notificaties | Meldingen bij nieuw regionaal nieuws | Niet gestart |

### 7.2 Gemiddelde prioriteit

| Item | Beschrijving | Status |
|------|-------------|--------|
| Offline modus | Artikelen cachen voor offline lezen | Niet gestart |
| Leeslijst | Artikelen opslaan om later te lezen | Niet gestart |
| Meer bronnen | Uitbreiden met meer regionale en lokale omroepen | Doorlopend |
| Feedback backend | Server-side verwerking van feedback formulier | Niet gestart |

### 7.3 Lage prioriteit

| Item | Beschrijving | Status |
|------|-------------|--------|
| Widget support | Home screen widget met laatste nieuws | Niet gestart |
| Analytics | Gebruiksstatistieken (privacy-vriendelijk) | Niet gestart |
| App rating prompt | In-app review prompt na X dagen gebruik | Niet gestart |
| Tablet layout | Geoptimaliseerde layout voor tablets | Niet gestart |

---

## 8. Beperkingen & bekende issues

### Technische beperkingen

- **Expo Go compatibiliteit** — ScrollView met `pagingEnabled` i.p.v. `react-native-pager-view` (native build vereist)
- **react-native-worklets** — mag NIET als expliciete dependency toegevoegd worden (intern beheerd door reanimated 4.x)
- **GestureHandlerRootView** — moet root layout wrappen (iOS crash zonder)
- **Serialization checks uitgeschakeld** voor `news/setArticles` en `news.articles` paden

### Bekende issues

- Light theme kleuren zijn gedefinieerd maar worden nog niet toegepast
- Onboarding vlag bestaat maar er is geen UI voor
- App Store/Play Store links zijn placeholders

---

## 9. Testdekking

| Testbestand | Scope |
|-------------|-------|
| `newsSlice.test.ts` | Redux news slice acties/reducers |
| `settingsSlice.test.ts` | Settings slice functionaliteit |
| `favoriteSourcesSlice.test.ts` | Favorieten slice |
| `rssService.test.ts` | RSS ophalen en parsen |
| `DrawerContext.test.tsx` | Drawer context gedrag |

**Commando's:**
```bash
npm test                          # Alle tests (watch mode)
npx jest path/to/test.file.ts    # Enkele test
```

---

## 10. Ontwikkelrichtlijnen

### Code conventies

- Strict TypeScript; interfaces boven types; geen enums — gebruik const maps
- Alleen functionele componenten; named exports
- Bestandsvolgorde: geëxporteerde component → subcomponenten → helpers → statische content → types
- Geen `else` na een `return`; early returns gewenst
- `useCallback`/`useMemo` voor memoization; `memo()` op list item componenten

### Path alias

`@/*` mapt naar de project root (bijv. `@/store`, `@/types/news`, `@/components/...`)

### Commando's

```bash
npm install              # Installeer dependencies
npx expo start           # Start dev server
npx expo start --clear   # Start met lege cache (na package wijzigingen)
npm run android          # Android emulator/device
npm run ios              # iOS simulator
npm run web              # Browser
npm run lint             # Expo linter
npm test                 # Tests (watch mode)
```

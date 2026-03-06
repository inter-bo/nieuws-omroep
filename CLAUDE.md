# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

TypeScript · React Native · Expo SDK 54 · Redux Toolkit · expo-router · react-native-pager-view

## Commands

```bash
npm install              # Install dependencies
npx expo start           # Start dev server (Expo Go)
npx expo start --clear   # Start with cleared cache (use after package changes)
npm run android          # Run on Android emulator/device
npm run ios              # Run on iOS simulator
npm run web              # Run in browser
npm run lint             # Run Expo linter
npm test                 # Run tests (watch mode)
npx jest path/to/test.file.ts  # Run a single test file
```

## Architecture

A React Native / Expo news aggregator for Dutch regional public broadcasters ("omroepen"), organized by province.

### Path Alias

`@/*` maps to the project root (e.g., `@/store`, `@/types/news`, `@/components/...`).

### Routing — expo-router (file-based)

| Path | Purpose |
|------|---------|
| `app/_layout.tsx` | Root layout — wraps app in `GestureHandlerRootView`, Redux `<Provider>`, and `<SafeAreaProvider>`. Renders global `<Header>`. |
| `app/(tabs)/` | Main screens: `index` (news feed), `favorites`, `settings`, `about` |
| `app/article/[url].tsx` | Article viewer — renders a URL-encoded article in a WebView |

### State Management — Redux Toolkit (`store/slices/`)

| Slice | Responsibility |
|-------|---------------|
| `newsSlice` | `categories` (from `defaultFeeds.ts`) + fetched articles keyed by `categoryId` |
| `settingsSlice` | `enabledFeeds`, `enabledCategories` (toggling a category cascades to its feeds), `darkMode`, `hasSeenOnboarding` |
| `favoritesSlice` | Favorited articles by `id` |

The store disables serializable checks for `news/setArticles` and `news.articles` paths because article objects contain date strings parsed at runtime.

### Data Flow

1. `constants/defaultFeeds.ts` — defines all RSS feeds grouped by Dutch province (`NewsCategory[]`)
2. `services/rssService.ts` — fetches and parses RSS/Atom feeds using `fast-xml-parser`; includes feed-specific image extractors for `haarlemupdates.nl` and `omroepflevoland.nl`; retries on 503/429/502/504 with 1s delay (max 3 retries); 5s abort timeout per request
3. `NewsFeed` component — fetches lazily per category tab; only fetches a category when its tab is first visited; uses `fetchedRef` to avoid duplicate fetches
4. Articles are dispatched via `setArticles({ categoryId, articles })` and stored in Redux

### Key Types (`types/news.ts`)

```ts
NewsArticle  { id, title, description, imageUrl?, category, source, url, publishedAt }
NewsCategory { id, name, feeds: RssFeed[] }
RssFeed      { id, url, name, enabled }
```

### Theming

`constants/Colors.ts` — monochromatic dark-blue scheme with per-province accent colors. Dark mode flag exists in `settingsSlice` but color switching is **not yet implemented**.

SVGs are supported via `react-native-svg-transformer` (configured in `metro.config.js`).

## Code Conventions

- Strict TypeScript; interfaces over types; no enums — use const maps
- Functional components only; named exports
- File order: exported component → subcomponents → helpers → static content → types
- No `else` after a `return`; early returns preferred
- `useCallback`/`useMemo` for memoization; `memo()` on list item components

## Known Gotchas

- **`GestureHandlerRootView`** must wrap the root in `app/_layout.tsx` — required by `react-native-gesture-handler ~2.28` on iOS; without it, Expo Go on iOS crashes silently after a few seconds.
- **`react-native-worklets`** must NOT be added as an explicit dependency — it is managed internally by `react-native-reanimated 4.x`. Adding it separately causes a silent native crash in Expo Go.
- **Expo Go compatibility** — always run `npx expo start --clear` after any package changes. Keep Expo Go updated on device; an outdated Expo Go app will crash silently when the SDK version doesn't match.
- The `(tabs)/_layout.tsx` uses a `Stack` navigator, not the standard `Tabs` navigator — navigation between main screens is handled differently than a typical tab bar.

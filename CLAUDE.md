Guidance for Claude Code when working in this repository.
Stack: TypeScript · React Native · Expo · Redux Toolkit · expo-router

Commands
bashnpm install           # Install dependencies
npx expo start        # Start dev server
npm run android       # Run on Android emulator/device
npm run ios           # Run on iOS simulator
npm run web           # Run in browser
npm test              # Run tests (watch mode)
npm run lint          # Run Expo linter
npx jest path/to/test.file.ts  # Run a single test file

Architecture
A React Native / Expo news aggregator for Dutch regional public broadcasters ("omroepen"), organized by province.
Path Alias
@/* maps to the project root (e.g., @/store, @/types/news, @/components/...).
Routing — expo-router (file-based)
PathPurposeapp/_layout.tsxRoot layout — wraps app in Redux <Provider> and <SafeAreaProvider>. Hides global <Header> on article pages.app/(tabs)/Main tabs: index (news feed), favorites, settings, aboutapp/article/[url].tsxArticle viewer — renders a URL-encoded article in a WebView via ArticleViewer
State Management — Redux Toolkit (store/slices/)
SliceResponsibilitynewsSlicecategories (from defaultFeeds.ts) + fetched articles keyed by categoryIdsettingsSliceenabledFeeds, enabledCategories (toggling a category cascades to its feeds), darkMode, hasSeenOnboardingfavoritesSliceFavorited articles by id
Data Flow

constants/defaultFeeds.ts — defines all RSS feeds grouped by Dutch province (NewsCategory[])
services/rssService.ts — fetches and parses RSS/Atom feeds using fast-xml-parser; includes feed-specific image extractors (e.g., haarlemupdates.nl, omroepflevoland.nl); retries on 503/429/502/504 with 1s delay (max 3 retries)
Screen components (NewsFeed, FavoritesList, SettingsList, etc.) live in @/components/

Key Types (types/news.ts)
tsNewsArticle  { id, title, description, imageUrl?, category, source, url, publishedAt }
NewsCategory { id, name, feeds: RssFeed[] }
RssFeed      { id, url, name, enabled }
Theming

constants/Colors.ts — monochromatic dark-blue scheme with per-province accent colors (dark mode flag exists in settings but color switching is not yet implemented)
SVGs supported via react-native-svg-transformer (configured in metro.config.js)


Code Conventions
TypeScript

Strict mode enabled; interfaces over types; no enums — use maps
Functional components only; named exports

Style & Structure

Directories: lowercase-with-dashes (e.g., components/news-feed/)
File order: exported component → subcomponents → helpers → static content → types
Use the function keyword for pure functions
Avoid unnecessary curly braces in conditionals; prefer concise syntax and early returns
No else after a return

State

Prefer useReducer / Context over excessive useState
Minimize useEffect; use react-query for data fetching and caching
For complex global state: Zustand or Redux Toolkit

Performance

Memoize components; use useMemo / useCallback where appropriate
Images: WebP where supported, lazy-load via expo-image
Code-split non-critical components with React.Suspense + dynamic imports

Safe Areas

Wrap top-level screens in SafeAreaView (from react-native-safe-area-context)
Use SafeAreaScrollView for scrollable content
Never hardcode padding/margins for safe areas

Error Handling

Validate with Zod; log errors with Sentry (or expo-error-reporter in production)
Handle errors at the top of functions; use early returns to avoid deep nesting

Testing

Unit tests: Jest + React Native Testing Library
Integration tests: Detox for critical user flows
Snapshot tests for UI consistency

Security

Sanitize all user inputs (XSS prevention)
Secure storage: react-native-encrypted-storage
All API communication over HTTPS with proper authentication

i18n

expo-localization for internationalization
Support multiple languages, RTL layouts, and accessible text scaling


Tooling
ToolPurposeESLint + eslint-plugin-react / react-hooksLinting with strict unused-variable and hook-dependency ruleseslint-plugin-importConsistent import order; detect unused depsPrettier + eslint-config-prettierFormatting without ESLint conflictsexpo-constantsEnvironment variables and configurationexpo-updatesOver-the-air (OTA) updates

Reference

Expo docs: https://docs.expo.dev/
Expo security: https://docs.expo.dev/guides/security/
Expo distribution: https://docs.expo.dev/distribution/introduction/
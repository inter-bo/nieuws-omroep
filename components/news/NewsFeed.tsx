import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useWindowDimensions,
  InteractionManager,
} from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// react-native-pager-view requires a native dev build and crashes Expo Go on iOS.
// Use ScrollView with pagingEnabled instead — fully supported in Expo Go.
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '@/store';
import { setArticles, removeSourceArticles } from '@/store/slices/newsSlice';
import { fetchRssFeed } from '@/services/rssService';
import { NewsArticle, NewsCategory } from '@/types/news';
import { ArticleCard } from './ArticleCard';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import { defaultCategories } from '@/constants/defaultFeeds';

function parseDateMs(dateStr: string): number {
  if (!dateStr) return -1;
  const ms = Date.parse(dateStr);
  return isNaN(ms) ? -1 : ms;
}

const feedIdToName: Record<string, string> = {};
for (const cat of defaultCategories) {
  for (const feed of cat.feeds) {
    feedIdToName[feed.id] = feed.name;
  }
}

export function NewsFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const categories = useSelector((state: RootState) => state.news.categories);
  const articles = useSelector((state: RootState) => state.news.articles);
  const enabledCategories = useSelector((state: RootState) => state.settings.enabledCategories);
  const enabledFeeds = useSelector((state: RootState) => state.settings.enabledFeeds);
  const favoriteSourceIds = useSelector((state: RootState) => state.favoriteSources.favoriteSourceIds);

  const visibleCategories = categories.filter(
    (cat) => enabledCategories[cat.id] !== false
  );

  const latestTab = { id: 'latest', name: 'Alle Nieuws' };
  const favoritesTab = { id: 'favorites', name: 'Favorieten' };
  const allTabs = [latestTab, favoritesTab, ...visibleCategories];

  const { width } = useWindowDimensions();

  const [activePage, setActivePage] = useState(0);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [refreshingLatest, setRefreshingLatest] = useState(false);
  const fetchedRef = useRef<Set<string>>(new Set());
  const pagerRef = useRef<ScrollView>(null);
  const tabScrollRef = useRef<ScrollView>(null);
  const tabLayoutsRef = useRef<Array<{ x: number; width: number }>>([]);
  const isCancelledRef = useRef(false);
  const prevEnabledFeedsRef = useRef<Record<string, boolean>>(enabledFeeds);

  const fetchCategory = useCallback(
    async (category: NewsCategory, forceRefresh = false) => {
      if (!forceRefresh && fetchedRef.current.has(category.id)) return;
      fetchedRef.current.add(category.id);

      // FIX: guard against setState on unmounted component (iOS Hermes/concurrent mode)
      if (isCancelledRef.current) return;
      setLoadingIds((prev) => new Set(prev).add(category.id));
      setErrorIds((prev) => {
        const next = new Set(prev);
        next.delete(category.id);
        return next;
      });
      try {
        const feedsToFetch = category.feeds.filter(
          (feed) => enabledFeeds[feed.id] !== false
        );
        // Sequential fetch to avoid blocking iOS JS thread with concurrent XML parsing
        const results: NewsArticle[][] = [];
        for (const feed of feedsToFetch) {
          const articles = await fetchRssFeed(feed);
          results.push(articles);
          await new Promise((r) => setTimeout(r, 0)); // Yield to event loop (iOS watchdog)
        }
        const merged = results
          .flat()
          .sort((a, b) => parseDateMs(b.publishedAt) - parseDateMs(a.publishedAt));
        dispatch(setArticles({ categoryId: category.id, articles: merged }));
      } catch {
        setErrorIds((prev) => new Set(prev).add(category.id));
        fetchedRef.current.delete(category.id);
      } finally {
        setLoadingIds((prev) => {
          const next = new Set(prev);
          next.delete(category.id);
          return next;
        });
      }
    },
    [dispatch, enabledFeeds]
  );

  useEffect(() => {
    const prev = prevEnabledFeedsRef.current;
    prevEnabledFeedsRef.current = enabledFeeds;
    for (const category of categories) {
      for (const feed of category.feeds) {
        const wasEnabled = prev[feed.id] !== false;
        const isNowEnabled = enabledFeeds[feed.id] !== false;
        if (!wasEnabled && isNowEnabled) {
          fetchedRef.current.delete(category.id);
          fetchCategory(category, true);
        } else if (wasEnabled && !isNowEnabled) {
          dispatch(removeSourceArticles({ categoryId: category.id, sourceName: feed.name }));
        }
      }
    }
  }, [enabledFeeds, fetchCategory, dispatch, categories]);

  useEffect(() => {
    isCancelledRef.current = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let restTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const task = InteractionManager.runAfterInteractions(() => {
      // Staggered load for iOS: fetch first category only, show content quickly, then load rest
      timeoutId = setTimeout(() => {
        if (visibleCategories.length === 0) return;
        // Fetch first category immediately (typically 1 feed, minimal blocking)
        fetchCategory(visibleCategories[0]).catch(() => {});
        // After 1.5s, fetch remaining categories one-by-one with 150ms between each
        restTimeoutId = setTimeout(async () => {
          for (let i = 1; i < visibleCategories.length; i++) {
            // FIX: stop iterating if component unmounted — clearTimeout can't cancel a running async loop
            if (isCancelledRef.current) break;
            await fetchCategory(visibleCategories[i]);
            if (i < visibleCategories.length - 1) {
              await new Promise((r) => setTimeout(r, 150));
            }
          }
        }, 1500);
      }, 400);
    });
    return () => {
      // FIX: signal all in-flight fetchCategory calls to bail out before touching state
      isCancelledRef.current = true;
      task.cancel();
      if (timeoutId !== null) clearTimeout(timeoutId);
      if (restTimeoutId !== null) clearTimeout(restTimeoutId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = useCallback(
    async (category: NewsCategory) => {
      setRefreshingId(category.id);
      fetchedRef.current.delete(category.id);
      await fetchCategory(category, true);
      setRefreshingId(null);
    },
    [fetchCategory]
  );

  const handleRefreshLatest = useCallback(async () => {
    setRefreshingLatest(true);
    for (const cat of visibleCategories) {
      fetchedRef.current.delete(cat.id);
      await fetchCategory(cat, true);
    }
    setRefreshingLatest(false);
  }, [visibleCategories, fetchCategory]);

  function handleTabPress(index: number) {
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
    setActivePage(index);
    if (index >= 2) fetchCategory(visibleCategories[index - 2]);
  }

  function handleMomentumScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setActivePage(page);
    if (page >= 2) fetchCategory(visibleCategories[page - 2]);
  }

  useEffect(() => {
    const layout = tabLayoutsRef.current[activePage];
    if (!layout || !tabScrollRef.current) return;
    tabScrollRef.current.scrollTo({
      x: layout.x - width / 2 + layout.width / 2,
      animated: true,
    });
  }, [activePage, width]);

  const allArticlesSorted = useMemo(
    () =>
      Object.values(articles)
        .flat()
        .sort((a, b) => parseDateMs(b.publishedAt) - parseDateMs(a.publishedAt))
        .slice(0, 50),
    [articles]
  );

  const favoriteArticlesSorted = useMemo(() => {
    if (favoriteSourceIds.length === 0) return [];
    const favoriteNames = new Set(favoriteSourceIds.map((id) => feedIdToName[id]).filter(Boolean));
    return Object.values(articles)
      .flat()
      .filter((a) => favoriteNames.has(a.source))
      .sort((a, b) => parseDateMs(b.publishedAt) - parseDateMs(a.publishedAt));
  }, [favoriteSourceIds, articles]);

  const handleArticlePress = useCallback((article: NewsArticle) => {
    router.push(`/article/${encodeURIComponent(article.url)}`);
  }, [router]);

  const renderItem = useCallback(({ item }: { item: NewsArticle }) => (
    <ArticleCard article={item} onPress={handleArticlePress} />
  ), [handleArticlePress]);

  if (visibleCategories.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          Alle provincies zijn uitgeschakeld. Pas de instellingen aan.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={tabScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsBar}
        contentContainerStyle={styles.tabsContent}
      >
        {allTabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => handleTabPress(index)}
            style={[styles.tab, activePage === index && styles.activeTab]}
            onLayout={(e) => {
              tabLayoutsRef.current[index] = {
                x: e.nativeEvent.layout.x,
                width: e.nativeEvent.layout.width,
              };
            }}
          >
            {index === 0 ? (
              <Ionicons
                name="home"
                size={18}
                color={activePage === 0 ? '#38a3a5' : theme.textMuted}
              />
            ) : index === 1 ? (
              <Ionicons
                name="star"
                size={18}
                color={activePage === 1 ? '#38a3a5' : theme.textMuted}
              />
            ) : (
              <Text style={[styles.tabText, activePage === index && styles.activeTabText]}>
                {tab.name}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ScrollView with pagingEnabled replaces react-native-pager-view for Expo Go compatibility */}
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.pager}
      >
        {allTabs.map((tab, index) => {
          const category = index >= 2 ? visibleCategories[index - 2] : null;
          const pageArticles =
            index === 0
              ? allArticlesSorted
              : index === 1
                ? favoriteArticlesSorted
                : (articles[visibleCategories[index - 2].id] ?? []);
          const isLoading = index >= 2 && loadingIds.has(visibleCategories[index - 2].id);
          const hasError = index >= 2 && errorIds.has(visibleCategories[index - 2].id);
          const isRefreshing =
            index <= 1
              ? refreshingLatest
              : category !== null && refreshingId === category.id;

          const refreshControl =
            index <= 1 ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefreshLatest}
                tintColor={theme.textPrimary}
                colors={[theme.secondary]}
              />
            ) : category ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => handleRefresh(category)}
                tintColor={theme.textPrimary}
                colors={[theme.secondary]}
              />
            ) : undefined;

          return (
            <View key={tab.id} style={[styles.page, { width }]}>
              {index === 1 && favoriteSourceIds.length === 0 ? (
                <View style={styles.empty}>
                  <Ionicons name="star-outline" size={48} color={theme.textMuted} />
                  <Text style={styles.emptyText}>Geen bronnen geselecteerd</Text>
                  <Text style={styles.emptySubtext}>
                    Selecteer bronnen via het menu → Favorieten
                  </Text>
                </View>
              ) : isLoading && pageArticles.length === 0 ? (
                <ActivityIndicator
                  style={styles.loader}
                  size="large"
                  color={theme.textPrimary}
                />
              ) : hasError && pageArticles.length === 0 ? (
                <View style={styles.empty}>
                  <Ionicons name="cloud-offline-outline" size={48} color={theme.textMuted} />
                  <Text style={styles.emptyText}>Kon artikelen niet laden</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => category && fetchCategory(category, true)}
                  >
                    <Text style={styles.retryText}>Opnieuw proberen</Text>
                  </TouchableOpacity>
                </View>
              ) : pageArticles.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Geen artikelen gevonden</Text>
                </View>
              ) : (
                <FlatList
                  data={pageArticles}
                  keyExtractor={(item) => item.id}
                  renderItem={renderItem}
                  getItemLayout={(_data, idx) => ({
                    length: 118,
                    offset: 118 * idx,
                    index: idx,
                  })}
                  contentContainerStyle={styles.list}
                  windowSize={5}
                  maxToRenderPerBatch={8}
                  initialNumToRender={8}
                  // FIX: removeClippedSubviews removed — causes iOS native crash when FlatList
                  // is inside a paging ScrollView (off-screen pages are "clipped" by the
                  // horizontal bounds, causing iOS to detach views React still considers mounted)
                  refreshControl={refreshControl}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    tabsBar: {
      flexGrow: 0,
      backgroundColor: c.primary,
    },
    tabsContent: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      gap: 4,
    },
    tab: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: '#38a3a5',
    },
    tabText: {
      color: c.textMuted,
      fontSize: 15,
      fontWeight: '700',
    },
    activeTabText: {
      color: c.textLight,
    },
    pager: {
      flex: 1,
    },
    page: {
      flex: 1,
    },
    list: {
      paddingTop: 10,
      paddingBottom: 20,
    },
    loader: {
      flex: 1,
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      gap: 12,
    },
    emptyText: {
      color: c.textMuted,
      fontSize: 15,
      textAlign: 'center',
    },
    emptySubtext: {
      color: c.textMuted,
      fontSize: 13,
      textAlign: 'center',
      marginTop: 4,
    },
    retryButton: {
      marginTop: 4,
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: c.secondary,
      borderRadius: 8,
    },
    retryText: {
      color: c.textLight,
      fontSize: 14,
      fontWeight: '600',
    },
  });
}

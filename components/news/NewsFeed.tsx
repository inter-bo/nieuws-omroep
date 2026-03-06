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
} from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// react-native-pager-view requires a native dev build and crashes Expo Go on iOS.
// Use ScrollView with pagingEnabled instead — fully supported in Expo Go.
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '@/store';
import { setArticles } from '@/store/slices/newsSlice';
import { fetchRssFeed } from '@/services/rssService';
import { NewsArticle, NewsCategory } from '@/types/news';
import { ArticleCard } from './ArticleCard';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export function NewsFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const categories = useSelector((state: RootState) => state.news.categories);
  const articles = useSelector((state: RootState) => state.news.articles);
  const enabledCategories = useSelector((state: RootState) => state.settings.enabledCategories);
  const enabledFeeds = useSelector((state: RootState) => state.settings.enabledFeeds);

  const visibleCategories = categories.filter(
    (cat) => enabledCategories[cat.id] !== false
  );

  const latestTab = { id: 'latest', name: 'Alle Nieuws' };
  const allTabs = [latestTab, ...visibleCategories];

  const { width } = useWindowDimensions();

  const [activePage, setActivePage] = useState(0);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const fetchedRef = useRef<Set<string>>(new Set());
  const pagerRef = useRef<ScrollView>(null);
  const tabScrollRef = useRef<ScrollView>(null);

  const fetchCategory = useCallback(
    async (category: NewsCategory, forceRefresh = false) => {
      if (!forceRefresh && fetchedRef.current.has(category.id)) return;
      fetchedRef.current.add(category.id);

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
        const settled = await Promise.allSettled(feedsToFetch.map((feed) => fetchRssFeed(feed)));
        const results = settled
          .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
          .map((r) => r.value);
        const merged = results
          .flat()
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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
    // Fetch categories in batches of 3 to avoid overwhelming the JS thread on iOS
    async function fetchInBatches() {
      const BATCH_SIZE = 3;
      for (let i = 0; i < visibleCategories.length; i += BATCH_SIZE) {
        const batch = visibleCategories.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map((cat) => fetchCategory(cat)));
      }
    }
    fetchInBatches().catch((err) => console.error('[NewsFeed] fetchInBatches error:', err));
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

  function handleTabPress(index: number) {
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
    setActivePage(index);
    if (index > 0) fetchCategory(visibleCategories[index - 1]);
  }

  function handleMomentumScrollEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setActivePage(page);
    if (page > 0) fetchCategory(visibleCategories[page - 1]);
  }

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
          >
            {index === 0 ? (
              <Ionicons
                name="home"
                size={18}
                color={activePage === 0 ? '#38a3a5' : theme.textMuted}
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
          const category = index > 0 ? visibleCategories[index - 1] : null;
          const pageArticles =
            index === 0
              ? Object.values(articles)
                  .flat()
                  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
              : (articles[visibleCategories[index - 1].id] ?? []);
          const isLoading = index > 0 && loadingIds.has(visibleCategories[index - 1].id);
          const hasError = index > 0 && errorIds.has(visibleCategories[index - 1].id);
          const isRefreshing = category !== null && refreshingId === category.id;

          return (
            <View key={tab.id} style={[styles.page, { width }]}>
              {isLoading && pageArticles.length === 0 ? (
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
                  contentContainerStyle={styles.list}
                  refreshControl={
                    category ? (
                      <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => handleRefresh(category)}
                        tintColor={theme.textPrimary}
                        colors={[theme.secondary]}
                      />
                    ) : undefined
                  }
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
      fontSize: 13,
      fontWeight: '600',
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

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setArticles } from '@/store/slices/newsSlice';
import { fetchRssFeed } from '@/services/rssService';
import { NewsArticle, NewsCategory } from '@/types/news';
import { ArticleCard } from './ArticleCard';
import Colors from '@/constants/Colors';

export function NewsFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const categories = useSelector((state: RootState) => state.news.categories);
  const articles = useSelector((state: RootState) => state.news.articles);
  const enabledCategories = useSelector((state: RootState) => state.settings.enabledCategories);
  const enabledFeeds = useSelector((state: RootState) => state.settings.enabledFeeds);

  const visibleCategories = categories.filter(
    (cat) => enabledCategories[cat.id] !== false
  );

  const [activePage, setActivePage] = useState(0);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const fetchedRef = useRef<Set<string>>(new Set());
  const pagerRef = useRef<PagerView>(null);
  const tabScrollRef = useRef<ScrollView>(null);

  const fetchCategory = useCallback(
    async (category: NewsCategory) => {
      if (fetchedRef.current.has(category.id)) return;
      fetchedRef.current.add(category.id);

      setLoadingIds((prev) => new Set(prev).add(category.id));
      try {
        const feedsToFetch = category.feeds.filter(
          (feed) => enabledFeeds[feed.id] !== false
        );
        const results = await Promise.all(feedsToFetch.map((feed) => fetchRssFeed(feed)));
        const merged = results
          .flat()
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        dispatch(setArticles({ categoryId: category.id, articles: merged }));
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
    if (visibleCategories[0]) fetchCategory(visibleCategories[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleTabPress(index: number) {
    pagerRef.current?.setPage(index);
    setActivePage(index);
    if (visibleCategories[index]) fetchCategory(visibleCategories[index]);
  }

  function handlePageSelected(e: { nativeEvent: { position: number } }) {
    const page = e.nativeEvent.position;
    setActivePage(page);
    if (visibleCategories[page]) fetchCategory(visibleCategories[page]);
  }

  function handleArticlePress(article: NewsArticle) {
    router.push(`/article/${encodeURIComponent(article.url)}`);
  }

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
        {visibleCategories.map((cat, index) => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => handleTabPress(index)}
            style={[styles.tab, activePage === index && styles.activeTab]}
          >
            <Text style={[styles.tabText, activePage === index && styles.activeTabText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {visibleCategories.map((cat) => {
          const catArticles = articles[cat.id] ?? [];
          const isLoading = loadingIds.has(cat.id);

          return (
            <View key={cat.id} style={styles.page}>
              {isLoading && catArticles.length === 0 ? (
                <ActivityIndicator
                  style={styles.loader}
                  size="large"
                  color={Colors.textPrimary}
                />
              ) : catArticles.length === 0 ? (
                <View style={styles.empty}>
                  <Text style={styles.emptyText}>Geen artikelen gevonden</Text>
                </View>
              ) : (
                <FlatList
                  data={catArticles}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <ArticleCard article={item} onPress={() => handleArticlePress(item)} />
                  )}
                  contentContainerStyle={styles.list}
                />
              )}
            </View>
          );
        })}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsBar: {
    flexGrow: 0,
    backgroundColor: Colors.primary,
  },
  tabsContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
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
  },
  emptyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    textAlign: 'center',
  },
});

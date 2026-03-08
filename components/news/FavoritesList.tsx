import { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState } from '@/store';
import { ArticleCard } from './ArticleCard';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import { defaultCategories } from '@/constants/defaultFeeds';
import { NewsArticle } from '@/types/news';

// Build feedId → feedName lookup from defaultCategories
const feedIdToName: Record<string, string> = {};
for (const category of defaultCategories) {
  for (const feed of category.feeds) {
    feedIdToName[feed.id] = feed.name;
  }
}

export function FavoritesList() {
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const favoriteSourceIds = useSelector((state: RootState) => state.favoriteSources.favoriteSourceIds);
  const allArticles = useSelector((state: RootState) => state.news.articles);

  const filteredArticles = useMemo<NewsArticle[]>(() => {
    if (favoriteSourceIds.length === 0) return [];
    const favoriteNames = new Set(favoriteSourceIds.map((id) => feedIdToName[id]).filter(Boolean));
    return Object.values(allArticles)
      .flat()
      .filter((article) => favoriteNames.has(article.source))
      .sort((a, b) => {
        const aMs = a.publishedAt ? (Date.parse(a.publishedAt) || -1) : -1;
        const bMs = b.publishedAt ? (Date.parse(b.publishedAt) || -1) : -1;
        return bMs - aMs;
      });
  }, [favoriteSourceIds, allArticles]);

  if (favoriteSourceIds.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Geen bronnen geselecteerd</Text>
        <Text style={styles.emptyText}>
          Selecteer bronnen via het menu → Favorieten
        </Text>
      </View>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Nog geen artikelen</Text>
        <Text style={styles.emptyText}>
          De geselecteerde bronnen hebben nog geen artikelen geladen.
          Ga naar de nieuwsfeed om ze te laden.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={filteredArticles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ArticleCard
          article={item}
          onPress={() => router.push(`/article/${encodeURIComponent(item.url)}`)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    list: {
      paddingBottom: 20,
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: c.background,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: c.textPrimary,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
  });
}

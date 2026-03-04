import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { NewsArticle } from '@/types/news';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { RootState } from '@/store';
import Colors from '@/constants/Colors';

const placeholder = require('@/assets/images/news-placeholder.jpg');

interface Props {
  article: NewsArticle;
  onPress: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ArticleCard({ article, onPress }: Props) {
  const dispatch = useDispatch();
  const isFavorite = useSelector(
    (state: RootState) => !!state.favorites.articles[article.id]
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.75}>
      <Image
        source={article.imageUrl || placeholder}
        placeholder={placeholder}
        contentFit="cover"
        style={styles.image}
        transition={200}
      />
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.source}>{article.source}</Text>
          <Text style={styles.date}>{formatDate(article.publishedAt)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {article.description}
        </Text>
      </View>
      <Pressable
        onPress={() => dispatch(toggleFavorite(article))}
        style={styles.favoriteButton}
        hitSlop={8}
        accessibilityLabel={isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? '#e74c3c' : 'rgba(255,255,255,0.5)'}
        />
      </Pressable>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    marginHorizontal: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 90,
  },
  body: {
    flex: 1,
    padding: 10,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  source: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  date: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 19,
  },
  description: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 17,
  },
  favoriteButton: {
    padding: 10,
    justifyContent: 'center',
  },
});

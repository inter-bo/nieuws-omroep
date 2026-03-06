import { memo, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { NewsArticle } from '@/types/news';
import { Colors } from '@/constants/Colors';

const placeholder = require('@/assets/images/news-placeholder.jpg');

interface Props {
  article: NewsArticle;
  onPress: (article: NewsArticle) => void;
}

function getProvinceColor(category: string): string {
  const key = category.toUpperCase().replace(/ /g, '-') as keyof typeof Colors.provinces;
  return Colors.provinces[key] ?? Colors.secondary;
}

export const ArticleCard = memo(function ArticleCard({ article, onPress }: Props) {
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const handlePress = useCallback(() => onPress(article), [onPress, article]);

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container} activeOpacity={0.75}>
      <Image
        source={article.imageUrl || placeholder}
        placeholder={placeholder}
        contentFit="cover"
        style={styles.image}
        transition={200}
      />
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: getProvinceColor(article.category) }]}>
            <Text style={styles.badgeText}>{article.category}</Text>
          </View>
          <Text style={styles.source} numberOfLines={1}>{article.source}</Text>
        </View>
        <Text style={styles.title} numberOfLines={3}>
          {article.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      marginHorizontal: 0,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    image: {
      width: 120,
      height: 110,
    },
    body: {
      flex: 1,
      padding: 10,
      gap: 6,
      justifyContent: 'flex-start',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    badge: {
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 999,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    source: {
      fontSize: 11,
      color: c.textMuted,
      flexShrink: 1,
    },
    title: {
      fontSize: 15,
      fontWeight: '700',
      color: c.textPrimary,
      lineHeight: 20,
    },
  });
}

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
          <View style={styles.sourcePill}>
            <Text style={styles.sourceText} numberOfLines={1}>{article.source}</Text>
          </View>
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
      marginBottom: 8,
    },
    image: {
      width: 120,
      height: 110,
      borderRadius: 16,
      overflow: 'hidden',
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
    sourcePill: {
      backgroundColor: c.backgroundSecondary,
      borderRadius: 7,
      paddingHorizontal: 8,
      paddingVertical: 3,
      flexShrink: 1,
    },
    sourceText: {
      fontSize: 11,
      color: c.textMuted,
      fontWeight: '600',
    },
    title: {
      fontSize: 15,
      fontWeight: '800',
      color: c.textPrimary,
      lineHeight: 20,
    },
  });
}

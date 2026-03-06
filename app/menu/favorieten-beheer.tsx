import { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/store';
import { toggleFavoriteSource } from '@/store/slices/favoriteSourcesSlice';
import { defaultCategories } from '@/constants/defaultFeeds';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import { RssFeed } from '@/types/news';

interface FeedWithProvince extends RssFeed {
  provinceName: string;
}

const allFeeds: FeedWithProvince[] = defaultCategories.flatMap((cat) =>
  cat.feeds.map((feed) => ({ ...feed, provinceName: cat.name }))
);

export default function FavorietenBeheer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const favoriteSourceIds = useSelector((state: RootState) => state.favoriteSources.favoriteSourceIds);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.textLight} />
        </TouchableOpacity>
        <Text style={styles.title}>Favorieten Beheer</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={allFeeds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isFav = favoriteSourceIds.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.row, isFav && styles.rowActive]}
              onPress={() => dispatch(toggleFavoriteSource(item.id))}
              activeOpacity={0.75}
            >
              <View style={styles.rowInfo}>
                <Text style={[styles.feedName, isFav && styles.feedNameActive]}>{item.name}</Text>
                <Text style={styles.provinceName}>{item.provinceName}</Text>
              </View>
              <Ionicons
                name={isFav ? 'star' : 'star-outline'}
                size={22}
                color={isFav ? '#F39C12' : theme.textMuted}
              />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: c.primary,
      gap: 12,
    },
    title: {
      flex: 1,
      color: c.textLight,
      fontSize: 18,
      fontWeight: '700',
    },
    list: {
      paddingBottom: 40,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
    rowActive: {
      backgroundColor: c.backgroundSecondary,
    },
    rowInfo: {
      flex: 1,
      gap: 2,
    },
    feedName: {
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '500',
    },
    feedNameActive: {
      fontWeight: '700',
    },
    provinceName: {
      color: c.textMuted,
      fontSize: 12,
    },
  });
}

import { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '@/store';
import { toggleFeed } from '@/store/slices/settingsSlice';
import { defaultCategories } from '@/constants/defaultFeeds';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export default function NieuwsBronnen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const enabledFeeds = useSelector((state: RootState) => state.settings.enabledFeeds);
  const allArticles = useSelector((state: RootState) => state.news.articles);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggleCollapse(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function isFeedEnabled(feedId: string) {
    return enabledFeeds[feedId] !== false;
  }

  function getArticleCount(categoryId: string, feedName: string): number {
    return (allArticles[categoryId] ?? []).filter((a) => a.source === feedName).length;
  }

  function getEnabledCount(categoryId: string) {
    const cat = defaultCategories.find((c) => c.id === categoryId);
    if (!cat) return { enabled: 0, total: 0 };
    const enabled = cat.feeds.filter((f) => isFeedEnabled(f.id)).length;
    return { enabled, total: cat.feeds.length };
  }

  return (
    <SafeAreaView style={[styles.safeArea]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Nieuws Bronnen</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {defaultCategories.map((category) => {
          const isCollapsed = collapsed[category.id] ?? false;
          const { enabled, total } = getEnabledCount(category.id);
          return (
            <View key={category.id} style={styles.section}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleCollapse(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.sectionTitle}>{category.name}</Text>
                <Text style={styles.sectionCount}>{enabled}/{total} actief</Text>
                <Ionicons
                  name={isCollapsed ? 'chevron-down' : 'chevron-up'}
                  size={16}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
              {!isCollapsed && category.feeds.map((feed) => {
                const count = getArticleCount(category.id, feed.name);
                return (
                  <View key={feed.id} style={styles.feedRow}>
                    <View style={styles.feedInfo}>
                      <Text style={styles.feedName}>{feed.name}</Text>
                      {count > 0 && (
                        <Text style={styles.feedCount}>{count} artikelen</Text>
                      )}
                    </View>
                    <Switch
                      value={isFeedEnabled(feed.id)}
                      onValueChange={() => { dispatch(toggleFeed(feed.id)); }}
                      trackColor={{ false: theme.border, true: '#38a3a5' }}
                      thumbColor="#fff"
                    />
                  </View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
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
    content: {
      paddingBottom: 40,
    },
    section: {
      marginBottom: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 14,
      backgroundColor: c.backgroundSecondary,
      gap: 8,
    },
    sectionTitle: {
      flex: 1,
      color: c.textPrimary,
      fontSize: 15,
      fontWeight: '700',
    },
    sectionCount: {
      color: c.textMuted,
      fontSize: 12,
    },
    feedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
      backgroundColor: c.background,
    },
    feedInfo: {
      flex: 1,
      gap: 2,
    },
    feedName: {
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
    feedCount: {
      color: c.textMuted,
      fontSize: 12,
    },
  });
}

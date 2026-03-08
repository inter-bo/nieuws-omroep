import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '@/store';
import { toggleFeed, toggleCategory, toggleDarkMode, resetOnboarding } from '@/store/slices/settingsSlice';
import { defaultCategories } from '@/constants/defaultFeeds';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export function SettingsList() {
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);
  const { enabledFeeds, enabledCategories, darkMode } = useSelector(
    (state: RootState) => state.settings
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function isCategoryEnabled(id: string) {
    return enabledCategories[id] !== false;
  }

  function isFeedEnabled(id: string) {
    return enabledFeeds[id] !== false;
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weergave</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Donkere modus</Text>
          <Switch
            value={darkMode}
            onValueChange={() => { dispatch(toggleDarkMode()); }}
            trackColor={{ false: theme.border, true: theme.secondary }}
            thumbColor={theme.textLight}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Provincies</Text>
        {defaultCategories.map((cat) => (
          <View key={cat.id}>
            <TouchableOpacity
              style={styles.categoryRow}
              onPress={() => toggleExpand(cat.id)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryLeft}>
                <Ionicons
                  name={expanded.has(cat.id) ? 'chevron-down' : 'chevron-forward'}
                  size={16}
                  color={theme.textMuted}
                />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
              <Switch
                value={isCategoryEnabled(cat.id)}
                onValueChange={() => { dispatch(toggleCategory(cat.id)); }}
                trackColor={{ false: theme.border, true: theme.secondary }}
                thumbColor={theme.textLight}
              />
            </TouchableOpacity>

            {expanded.has(cat.id) &&
              cat.feeds.map((feed) => (
                <View key={feed.id} style={styles.feedRow}>
                  <Text style={styles.feedName}>{feed.name}</Text>
                  <Switch
                    value={isFeedEnabled(feed.id)}
                    onValueChange={() => { dispatch(toggleFeed(feed.id)); }}
                    trackColor={{ false: theme.border, true: theme.secondary }}
                    thumbColor={theme.textLight}
                  />
                </View>
              ))}
          </View>
        ))}
      </View>
      {__DEV__ && (
        <View style={styles.devSection}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <TouchableOpacity
            style={styles.devRow}
            onPress={() => { dispatch(resetOnboarding()); }}
            activeOpacity={0.7}
          >
            <Text style={styles.devLabel}>Reset onboarding</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function makeStyles(c: typeof Colors.dark) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      paddingBottom: 40,
    },
    section: {
      marginTop: 24,
      marginHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.backgroundSecondary,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    rowLabel: {
      fontSize: 15,
      color: c.textPrimary,
    },
    categoryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.backgroundSecondary,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 4,
    },
    categoryLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    categoryName: {
      fontSize: 15,
      color: c.textPrimary,
      fontWeight: '500',
    },
    feedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.primary,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 10,
      marginBottom: 2,
      marginLeft: 16,
    },
    feedName: {
      fontSize: 14,
      color: c.textSecondary,
    },
    devSection: {
      marginTop: 24,
      marginHorizontal: 16,
    },
    devRow: {
      backgroundColor: c.backgroundSecondary,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    devLabel: {
      fontSize: 15,
      color: c.error,
    },
  });
}

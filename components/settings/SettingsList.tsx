import { View, Text, ScrollView, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '@/store';
import { toggleFeed, toggleCategory, toggleDarkMode } from '@/store/slices/settingsSlice';
import { defaultCategories } from '@/constants/defaultFeeds';
import Colors from '@/constants/Colors';

export function SettingsList() {
  const dispatch = useDispatch<AppDispatch>();
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
            onValueChange={() => dispatch(toggleDarkMode())}
            trackColor={{ false: Colors.border, true: Colors.secondary }}
            thumbColor="#FFFFFF"
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
                  color="rgba(255,255,255,0.5)"
                />
                <Text style={styles.categoryName}>{cat.name}</Text>
              </View>
              <Switch
                value={isCategoryEnabled(cat.id)}
                onValueChange={() => dispatch(toggleCategory(cat.id))}
                trackColor={{ false: Colors.border, true: Colors.secondary }}
                thumbColor="#FFFFFF"
              />
            </TouchableOpacity>

            {expanded.has(cat.id) &&
              cat.feeds.map((feed) => (
                <View key={feed.id} style={styles.feedRow}>
                  <Text style={styles.feedName}>{feed.name}</Text>
                  <Switch
                    value={isFeedEnabled(feed.id)}
                    onValueChange={() => dispatch(toggleFeed(feed.id))}
                    trackColor={{ false: Colors.border, true: Colors.secondary }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowLabel: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundSecondary,
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
    color: '#FFFFFF',
    fontWeight: '500',
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 2,
    marginLeft: 16,
  },
  feedName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});

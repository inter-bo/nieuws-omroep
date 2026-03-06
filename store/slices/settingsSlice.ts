import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { defaultCategories } from '@/constants/defaultFeeds';

interface SettingsState {
  enabledFeeds: { [key: string]: boolean };
  enabledCategories: { [key: string]: boolean };
  darkMode: boolean;
  hasSeenOnboarding: boolean;
}

const initialState: SettingsState = {
  enabledFeeds: {},
  enabledCategories: {},
  darkMode: true,
  hasSeenOnboarding: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleFeed: (state, action: PayloadAction<string>) => {
      const feedId = action.payload;
      state.enabledFeeds[feedId] = !state.enabledFeeds[feedId];
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const isEnabled = !state.enabledCategories[categoryId];
      state.enabledCategories[categoryId] = isEnabled;

      // Find the category and update all its feeds
      const category = defaultCategories.find(cat => cat.id === categoryId);
      if (category) {
        category.feeds.forEach(feed => {
          state.enabledFeeds[feed.id] = isEnabled;
        });
      }
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setHasSeenOnboarding: (state) => {
      state.hasSeenOnboarding = true;
    },
  },
});

export const { toggleFeed, toggleCategory, toggleDarkMode, setHasSeenOnboarding } = settingsSlice.actions;
export default settingsSlice.reducer; 
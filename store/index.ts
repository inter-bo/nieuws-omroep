import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import newsReducer from './slices/newsSlice';
import settingsReducer from './slices/settingsSlice';
import favoriteSourcesReducer from './slices/favoriteSourcesSlice';

const favoriteSourcesPersistConfig = {
  key: 'favoriteSources',
  storage: AsyncStorage,
};

const settingsPersistConfig = {
  key: 'settings',
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: {
    news: newsReducer,
    settings: persistReducer(settingsPersistConfig, settingsReducer),
    favoriteSources: persistReducer(favoriteSourcesPersistConfig, favoriteSourcesReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'news/setArticles'],
        ignoredActionPaths: ['payload.publishedAt'],
        ignoredPaths: ['news.articles'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

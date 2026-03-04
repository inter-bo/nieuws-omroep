import { configureStore } from '@reduxjs/toolkit';
import newsReducer from './slices/newsSlice';
import settingsReducer from './slices/settingsSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
    settings: settingsReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: {
        warnAfter: 128,
        // Ignore these action types
        ignoredActions: ['news/setArticles'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.publishedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['news.articles'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 
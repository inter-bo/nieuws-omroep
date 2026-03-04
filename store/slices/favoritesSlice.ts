import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsArticle } from '@/types/news';

interface FavoritesState {
  articles: { [key: string]: NewsArticle };
}

const initialState: FavoritesState = {
  articles: {},
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<NewsArticle>) => {
      const article = action.payload;
      if (state.articles[article.id]) {
        delete state.articles[article.id];
      } else {
        state.articles[article.id] = article;
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer; 
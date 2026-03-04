import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewsArticle, NewsCategory } from '@/types/news';
import { defaultCategories } from '@/constants/defaultFeeds';

interface NewsState {
  categories: NewsCategory[];
  articles: Record<string, NewsArticle[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  categories: defaultCategories,
  articles: {},
  isLoading: false,
  error: null,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setArticles(state, action: PayloadAction<{ categoryId: string; articles: NewsArticle[] }>) {
      const { categoryId, articles } = action.payload;
      state.articles[categoryId] = articles;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setArticles, setLoading, setError } = newsSlice.actions;
export default newsSlice.reducer; 
import reducer, { setArticles, setLoading, setError } from '@/store/slices/newsSlice';
import { defaultCategories } from '@/constants/defaultFeeds';
import { NewsArticle } from '@/types/news';

const initialState = {
  categories: defaultCategories,
  articles: {},
  isLoading: false,
  error: null,
};

const makeArticle = (id: string): NewsArticle => ({
  id,
  title: `Article ${id}`,
  description: 'Test description',
  url: `https://example.com/${id}`,
  category: 'Test',
  source: 'Test Source',
  publishedAt: '2024-01-01T00:00:00.000Z',
});

describe('newsSlice', () => {
  it('returns initial state with categories from defaultFeeds', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.categories).toEqual(defaultCategories);
    expect(state.articles).toEqual({});
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  describe('setArticles', () => {
    it('stores articles under the correct categoryId', () => {
      const articles = [makeArticle('1'), makeArticle('2')];
      const state = reducer(initialState, setArticles({ categoryId: 'drenthe', articles }));
      expect(state.articles['drenthe']).toEqual(articles);
    });

    it('does not overwrite articles in other categories', () => {
      const drentheArticles = [makeArticle('1')];
      const frieslandArticles = [makeArticle('2')];
      const s1 = reducer(initialState, setArticles({ categoryId: 'drenthe', articles: drentheArticles }));
      const s2 = reducer(s1, setArticles({ categoryId: 'friesland', articles: frieslandArticles }));
      expect(s2.articles['drenthe']).toEqual(drentheArticles);
      expect(s2.articles['friesland']).toEqual(frieslandArticles);
    });

    it('replaces existing articles for the same categoryId', () => {
      const first = [makeArticle('1')];
      const second = [makeArticle('2'), makeArticle('3')];
      const s1 = reducer(initialState, setArticles({ categoryId: 'drenthe', articles: first }));
      const s2 = reducer(s1, setArticles({ categoryId: 'drenthe', articles: second }));
      expect(s2.articles['drenthe']).toEqual(second);
    });
  });

  describe('setLoading', () => {
    it('sets isLoading to true', () => {
      const state = reducer(initialState, setLoading(true));
      expect(state.isLoading).toBe(true);
    });

    it('sets isLoading back to false', () => {
      const s1 = reducer(initialState, setLoading(true));
      const s2 = reducer(s1, setLoading(false));
      expect(s2.isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('stores an error string', () => {
      const state = reducer(initialState, setError('Something went wrong'));
      expect(state.error).toBe('Something went wrong');
    });

    it('clears the error when set to null', () => {
      const s1 = reducer(initialState, setError('Something went wrong'));
      const s2 = reducer(s1, setError(null));
      expect(s2.error).toBeNull();
    });
  });
});

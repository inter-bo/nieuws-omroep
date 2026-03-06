import reducer, {
  toggleFeed,
  toggleCategory,
  toggleDarkMode,
  setHasSeenOnboarding,
} from '@/store/slices/settingsSlice';
import { defaultCategories } from '@/constants/defaultFeeds';

const initialState = {
  enabledFeeds: {},
  enabledCategories: {},
  darkMode: true,
  hasSeenOnboarding: false,
};

describe('settingsSlice', () => {
  it('returns initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.darkMode).toBe(true);
    expect(state.hasSeenOnboarding).toBe(false);
    expect(state.enabledFeeds).toEqual({});
    expect(state.enabledCategories).toEqual({});
  });

  describe('toggleFeed', () => {
    it('enables a feed that is not yet in state', () => {
      const state = reducer(initialState, toggleFeed('rtvdrenthe'));
      expect(state.enabledFeeds['rtvdrenthe']).toBe(true);
    });

    it('flips an enabled feed to disabled', () => {
      const s1 = reducer(initialState, toggleFeed('rtvdrenthe'));
      const s2 = reducer(s1, toggleFeed('rtvdrenthe'));
      expect(s2.enabledFeeds['rtvdrenthe']).toBe(false);
    });

    it('toggling twice returns to original undefined→true→false', () => {
      const s1 = reducer(initialState, toggleFeed('rtvdrenthe'));
      const s2 = reducer(s1, toggleFeed('rtvdrenthe'));
      // undefined (falsy) → true → false
      expect(s1.enabledFeeds['rtvdrenthe']).toBe(true);
      expect(s2.enabledFeeds['rtvdrenthe']).toBe(false);
    });
  });

  describe('toggleCategory', () => {
    // 'friesland' has feeds: omropfryslan, frieschdagblad, lc
    const friesland = defaultCategories.find(c => c.id === 'friesland')!;
    const feedIds = friesland.feeds.map(f => f.id);

    it('enables the category and cascades to all its feeds', () => {
      const state = reducer(initialState, toggleCategory('friesland'));
      expect(state.enabledCategories['friesland']).toBe(true);
      feedIds.forEach(id => expect(state.enabledFeeds[id]).toBe(true));
    });

    it('disables the category and cascades when toggled twice', () => {
      const s1 = reducer(initialState, toggleCategory('friesland'));
      const s2 = reducer(s1, toggleCategory('friesland'));
      expect(s2.enabledCategories['friesland']).toBe(false);
      feedIds.forEach(id => expect(s2.enabledFeeds[id]).toBe(false));
    });
  });

  describe('toggleDarkMode', () => {
    it('flips darkMode from true to false', () => {
      const state = reducer(initialState, toggleDarkMode());
      expect(state.darkMode).toBe(false);
    });

    it('flips darkMode back to true when toggled twice', () => {
      const s1 = reducer(initialState, toggleDarkMode());
      const s2 = reducer(s1, toggleDarkMode());
      expect(s2.darkMode).toBe(true);
    });
  });

  describe('setHasSeenOnboarding', () => {
    it('sets hasSeenOnboarding to true', () => {
      const state = reducer(initialState, setHasSeenOnboarding());
      expect(state.hasSeenOnboarding).toBe(true);
    });
  });
});

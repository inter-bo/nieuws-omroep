import reducer, { toggleFavoriteSource } from '@/store/slices/favoriteSourcesSlice';

const initialState = { favoriteSourceIds: [] };

describe('favoriteSourcesSlice', () => {
  it('has empty favoriteSourceIds as initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.favoriteSourceIds).toEqual([]);
  });

  it('adds an id when not present', () => {
    const state = reducer(initialState, toggleFavoriteSource('at5'));
    expect(state.favoriteSourceIds).toContain('at5');
  });

  it('removes an id when already present', () => {
    const s1 = reducer(initialState, toggleFavoriteSource('at5'));
    const s2 = reducer(s1, toggleFavoriteSource('at5'));
    expect(s2.favoriteSourceIds).not.toContain('at5');
  });

  it('multiple different ids can coexist', () => {
    const s1 = reducer(initialState, toggleFavoriteSource('at5'));
    const s2 = reducer(s1, toggleFavoriteSource('rtvdrenthe'));
    const s3 = reducer(s2, toggleFavoriteSource('l1'));
    expect(s3.favoriteSourceIds).toEqual(['at5', 'rtvdrenthe', 'l1']);
  });

  it('removing one id does not affect others', () => {
    const s1 = reducer(initialState, toggleFavoriteSource('at5'));
    const s2 = reducer(s1, toggleFavoriteSource('rtvdrenthe'));
    const s3 = reducer(s2, toggleFavoriteSource('at5'));
    expect(s3.favoriteSourceIds).toContain('rtvdrenthe');
    expect(s3.favoriteSourceIds).not.toContain('at5');
  });
});

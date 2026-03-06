import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteSourcesState {
  favoriteSourceIds: string[];
}

const initialState: FavoriteSourcesState = {
  favoriteSourceIds: [],
};

const favoriteSourcesSlice = createSlice({
  name: 'favoriteSources',
  initialState,
  reducers: {
    toggleFavoriteSource: (state, action: PayloadAction<string>) => {
      const feedId = action.payload;
      const index = state.favoriteSourceIds.indexOf(feedId);
      if (index >= 0) {
        state.favoriteSourceIds.splice(index, 1);
      } else {
        state.favoriteSourceIds.push(feedId);
      }
    },
  },
});

export const { toggleFavoriteSource } = favoriteSourcesSlice.actions;
export default favoriteSourcesSlice.reducer;

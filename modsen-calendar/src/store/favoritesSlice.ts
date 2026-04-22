import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LS_FAVORITES_KEY } from '@/common/constants';

const getInitial = (): string[] => {
  const raw = localStorage.getItem(LS_FAVORITES_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: getInitial(),
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const exists = state.includes(action.payload);
      if (exists) {
        return state.filter((id) => id !== action.payload);
      }
      state.push(action.payload);
    }
  }
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

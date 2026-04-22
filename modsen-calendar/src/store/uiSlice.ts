import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  loading: boolean;
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { loading: false } as UiState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setLoading } = uiSlice.actions;
export default uiSlice.reducer;

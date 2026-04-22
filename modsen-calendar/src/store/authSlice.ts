import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '@/common/types';
import { LS_USER_KEY } from '@/common/constants';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

const readUser = (): UserProfile | null => {
  const raw = localStorage.getItem(LS_USER_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
};

const user = readUser();

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, isAuthenticated: Boolean(user) } as AuthState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  }
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

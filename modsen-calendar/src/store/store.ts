import { configureStore, Middleware } from '@reduxjs/toolkit';
import eventsReducer from '@/store/eventsSlice';
import calendarReducer from '@/store/calendarSlice';
import favoritesReducer from '@/store/favoritesSlice';
import authReducer from '@/store/authSlice';
import uiReducer from '@/store/uiSlice';
import { LS_EVENTS_KEY, LS_FAVORITES_KEY, LS_USER_KEY } from '@/common/constants';
import { CalendarEvent, UserProfile } from '@/common/types';

interface PersistedState {
  events: CalendarEvent[];
  favorites: string[];
  auth: { user: UserProfile | null };
}

const localStorageSyncMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const result = next(action);
  const state = storeApi.getState() as PersistedState;
  localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(state.events));
  localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(state.favorites));
  if (state.auth.user) {
    localStorage.setItem(LS_USER_KEY, JSON.stringify(state.auth.user));
  } else {
    localStorage.removeItem(LS_USER_KEY);
  }
  return result;
};

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    calendar: calendarReducer,
    favorites: favoritesReducer,
    auth: authReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageSyncMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

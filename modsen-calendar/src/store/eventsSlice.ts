import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent } from '@/common/types';
import { LS_EVENTS_KEY } from '@/common/constants';

const getInitial = (): CalendarEvent[] => {
  const raw = localStorage.getItem(LS_EVENTS_KEY);
  return raw ? (JSON.parse(raw) as CalendarEvent[]) : [];
};

const eventsSlice = createSlice({
  name: 'events',
  initialState: getInitial(),
  reducers: {
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.push(action.payload);
    },
    updateEventTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const item = state.find((event) => event.id === action.payload.id);
      if (item) {
        item.title = action.payload.title;
      }
    },
    moveEvent: (
      state,
      action: PayloadAction<{ id: string; date: string; duration: string; place: string }>
    ) => {
      const item = state.find((event) => event.id === action.payload.id);
      if (item) {
        item.date = action.payload.date;
        item.duration = action.payload.duration;
        item.place = action.payload.place;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) =>
      state.filter((event) => event.id !== action.payload),
    toggleFavoriteFlag: (state, action: PayloadAction<string>) => {
      const item = state.find((event) => event.id === action.payload);
      if (item) {
        item.isFavorite = !item.isFavorite;
      }
    }
  }
});

export const { addEvent, updateEventTitle, deleteEvent, moveEvent, toggleFavoriteFlag } =
  eventsSlice.actions;
export default eventsSlice.reducer;

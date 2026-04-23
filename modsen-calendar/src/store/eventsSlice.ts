import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarEvent } from '@/common/types';
import { LS_EVENTS_KEY } from '@/common/constants';

const getInitialEvents = (): CalendarEvent[] => {
  try {
    const raw = localStorage.getItem(LS_EVENTS_KEY);
    if (!raw) return [];
    
    const parsed = JSON.parse(raw) as CalendarEvent[];
    
    if (!Array.isArray(parsed)) {
      console.warn('Invalid events data in localStorage, resetting to empty array');
      return [];
    }
    
    return parsed.filter(event => 
      event && 
      typeof event.id === 'string' && 
      typeof event.title === 'string' &&
      typeof event.date === 'string'
    );
  } catch (error) {
    console.error('Failed to parse events from localStorage:', error);
    return [];
  }
};

const eventsSlice = createSlice({
  name: 'events',
  initialState: getInitialEvents(),
  reducers: {
    addEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.push(action.payload);
    },
    updateEventTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const item = state.find((event) => event.id === action.payload.id);
      if (item) {
        item.title = action.payload.title.trim();
      }
    },
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.findIndex((event) => event.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
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
      state.filter((event) => event.id !== action.payload)
  }
});

export const { 
  addEvent, 
  updateEventTitle, 
  updateEvent,
  deleteEvent, 
  moveEvent 
} = eventsSlice.actions;

export default eventsSlice.reducer;

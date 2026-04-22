import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CalendarView } from '@/common/types';

interface CalendarState {
  view: CalendarView;
  selectedDate: string;
}

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    view: 'week',
    selectedDate: new Date().toISOString()
  } as CalendarState,
  reducers: {
    setView: (state, action: PayloadAction<CalendarView>) => {
      state.view = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    }
  }
});

export const { setView, setSelectedDate } = calendarSlice.actions;
export default calendarSlice.reducer;

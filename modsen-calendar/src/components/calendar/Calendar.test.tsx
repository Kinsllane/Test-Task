import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from '@/store/eventsSlice';
import calendarReducer from '@/store/calendarSlice';
import favoritesReducer from '@/store/favoritesSlice';
import authReducer from '@/store/authSlice';
import uiReducer from '@/store/uiSlice';
import { Calendar } from '@/components/calendar/Calendar';

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

jest.mock('@/services/notification', () => ({
  notifyUpcomingEvent: jest.fn(),
}));

describe('calendar render module', () => {
  test('renders day/week controls', () => {
    const store = configureStore({
      reducer: {
        events: eventsReducer,
        calendar: calendarReducer,
        favorites: favoritesReducer,
        auth: authReducer,
        ui: uiReducer
      }
    });

    render(
      <Provider store={store}>
        <Calendar />
      </Provider>
    );
    expect(screen.getByText('Day')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
  });
});

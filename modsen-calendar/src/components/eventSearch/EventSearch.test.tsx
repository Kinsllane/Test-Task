import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { EventSearch } from '@/components/eventSearch/EventSearch';
import eventsReducer from '@/store/eventsSlice';
import calendarReducer from '@/store/calendarSlice';
import favoritesReducer from '@/store/favoritesSlice';
import authReducer from '@/store/authSlice';
import uiReducer from '@/store/uiSlice';

jest.mock('@/api/kudago', () => ({
  searchKudaGoEvents: jest.fn().mockResolvedValue([{ id: 1, title: 'Concert' }])
}));

describe('search title module', () => {
  test('updates input value', () => {
    const onSelect = jest.fn();
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
        <EventSearch value="" onSelect={onSelect} />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText('Search event title...'), {
      target: { value: 'Con' }
    });
    expect(onSelect).toHaveBeenCalledWith('Con');
  });
});

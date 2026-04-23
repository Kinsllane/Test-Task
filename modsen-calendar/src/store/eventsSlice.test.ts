import reducer, { addEvent } from '@/store/eventsSlice';

describe('event add module', () => {
  test('adds event', () => {
    const state = reducer(
      [],
      addEvent({
        id: '1',
        title: 'Meet',
        place: 'Office',
        date: '21.04.2026',
        duration: '10:00-11:00',
        description: 'Daily sync',
        color: '#0d6efd'
      })
    );

    expect(state).toHaveLength(1);
    expect(state[0].title).toBe('Meet');
  });
});

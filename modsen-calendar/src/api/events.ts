import { CalendarEvent } from '@/common/types';
import { LS_EVENTS_KEY } from '@/common/constants';

export const readEvents = (): CalendarEvent[] => {
  const raw = localStorage.getItem(LS_EVENTS_KEY);
  return raw ? (JSON.parse(raw) as CalendarEvent[]) : [];
};

export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem(LS_EVENTS_KEY, JSON.stringify(events));
};

export type CalendarView = 'day' | 'week';

export interface CalendarEvent {
  id: string;
  title: string;
  place: string;
  date: string;
  duration: string;
  description: string;
  color: string;
  isFavorite: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

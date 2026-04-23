export type CalendarView = 'day' | 'week';

export interface CalendarEvent {
  id: string;
  title: string;
  place: string;
  date: string;
  duration: string;
  description: string;
  color: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
}

export interface CreateEventData {
  title: string;
  place: string;
  date: string;
  duration: string;
  description?: string;
  color?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export interface CalendarState {
  view: CalendarView;
  selectedDate: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}

export interface UIState {
  loading: boolean;
  sidebarOpen: boolean;
}
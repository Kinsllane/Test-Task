import { Calendar } from '@/components/calendar/Calendar';
import { FavoritesList } from '@/components/favorites/FavoritesList';
import styles from '@/pages/CalendarPage.module.scss';

export const CalendarPage = () => (
  <div className={styles.layout}>
    <Calendar />
    <FavoritesList />
  </div>
);

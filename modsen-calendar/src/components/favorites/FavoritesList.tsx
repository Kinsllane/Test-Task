import { useAppSelector } from '@/common/reduxHooks';
import styles from '@/components/favorites/styles/favorites.module.scss';

export const FavoritesList = () => {
  const favorites = useAppSelector((s) => s.favorites);
  const events = useAppSelector((s) => s.events);
  const list = events.filter((event) => favorites.includes(event.id));

  return (
    <aside className={styles.wrap}>
      <h3 className={styles.title}>Favorites</h3>
      {list.length === 0 ? <div className={styles.empty}>No favorite events yet</div> : null}
      {list.map((event) => (
        <div key={event.id} className={styles.item} style={{ borderLeftColor: event.color }}>
          <div className={styles.itemTop}>
            <span className={styles.star}>★</span>
            <span>{event.title}</span>
          </div>
          <div className={styles.meta}>
            {event.date} • {event.duration}
          </div>
        </div>
      ))}
    </aside>
  );
};

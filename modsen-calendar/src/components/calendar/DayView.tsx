import { CalendarEvent } from '@/common/types';
import styles from '@/components/calendar/styles/calendar.module.scss';

interface Props {
  map: Record<string, CalendarEvent[]>;
  onCellClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDropEvent: (id: string, date: string, duration: string, place: string) => void;
  onFav: (id: string) => void;
}

export const DayView = ({ map, onCellClick, onEventClick, onDropEvent, onFav }: Props) => {
  const now = new Date();
  const key = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
  const events = map[key] ?? [];

  return (
    <div className={styles.grid}>
      <div className={styles.cell} onClick={() => onCellClick(key)}>
        <b>{key}</b>
        {events.map((item) => (
          <article
            key={item.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('eventId', item.id)}
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(item);
            }}
            style={{ borderLeft: `4px solid ${item.color}` }}
            className={styles.event}
          >
            {item.title}
            <button onClick={(e) => { e.stopPropagation(); onFav(item.id); }}>★</button>
          </article>
        ))}
      </div>
      <div
        className={styles.dropZone}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const eventId = e.dataTransfer.getData('eventId');
          onDropEvent(eventId, key, '10:00-11:00', 'Updated place');
        }}
      >
        Drop here
      </div>
    </div>
  );
};

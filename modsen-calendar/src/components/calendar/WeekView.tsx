import { CalendarEvent } from '@/common/types';
import { toUiDate } from '@/utils/formatters';
import styles from '@/components/calendar/styles/calendar.module.scss';

interface Props {
  map: Record<string, CalendarEvent[]>;
  onCellClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onDropEvent: (id: string, date: string, duration: string, place: string) => void;
  onFav: (id: string) => void;
}

export const WeekView = ({ map, onCellClick, onEventClick, onDropEvent, onFav }: Props) => {
  const start = new Date();
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toUiDate(d);
  });

  return (
    <div className={styles.grid}>
      {days.map((date) => (
        <div
          key={date}
          className={styles.cell}
          onClick={() => onCellClick(date)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const id = e.dataTransfer.getData('eventId');
            onDropEvent(id, date, '11:00-12:00', 'Updated place');
          }}
        >
          <b>{date}</b>
          {(map[date] ?? []).map((item) => (
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
      ))}
    </div>
  );
};

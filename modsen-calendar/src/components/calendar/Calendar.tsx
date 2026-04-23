import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/common/reduxHooks';
import { setView } from '@/store/calendarSlice';
import { addEvent, deleteEvent, moveEvent, updateEventTitle } from '@/store/eventsSlice';
import { toggleFavorite } from '@/store/favoritesSlice';
import { Modal } from '@/components/common/Modal';
import { EventForm } from '@/components/eventForm/EventForm';
import { Button } from '@/components/common/Button';
import { Segmented } from '@/components/common/Segmented';
import { CalendarEvent } from '@/common/types';
import { truncateText } from '@/utils/validators';
import { notifyUpcomingEvent } from '@/services/notification';
import { toUiDate } from '@/utils/formatters';
import styles from '@/components/calendar/styles/calendar-page.module.scss';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import { EVENT_COLOR_TOKENS } from '@/common/constants';

const getEventFill = (stroke: string) =>
  EVENT_COLOR_TOKENS.find((t) => t.stroke === stroke)?.fill ?? '#ff66330d';

const parseHour = (duration: string) => {
  const [from] = duration.split('-');
  const [h] = from.split(':');
  return h;
};

const parseDurationHours = (duration: string) => {
  const [from, to] = duration.split('-');
  if (!from || !to) return 1;
  const [fh, fm] = from.split(':');
  const [th, tm] = to.split(':');
  const start = Number(fh) * 60 + Number(fm);
  const end = Number(th) * 60 + Number(tm);
  const diff = Math.max(60, end - start);
  return Math.max(1, Math.ceil(diff / 60));
};

const shiftDuration = (duration: string, newHour: string) => {
  const [from, to] = duration.split('-');
  if (!from || !to) {
    const next = String(Number(newHour) + 1).padStart(2, '0');
    return `${newHour}:00-${next}:00`;
  }
  const [, fromM] = from.split(':');
  const [toH, toM] = to.split(':');
  const fromMinutes = Number(from.split(':')[0]) * 60 + Number(fromM);
  const toMinutes = Number(toH) * 60 + Number(toM);
  const length = Math.max(30, toMinutes - fromMinutes);
  const newStart = Number(newHour) * 60 + Number(fromM);
  const newEnd = newStart + length;
  const endH = String(Math.floor(newEnd / 60)).padStart(2, '0');
  const endM = String(newEnd % 60).padStart(2, '0');
  return `${newHour}:${fromM}-${endH}:${endM}`;
};

const DAY_ABBR = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const Calendar = () => {
  const dispatch = useAppDispatch();
  const { view } = useAppSelector((s) => s.calendar);
  const events = useAppSelector((s) => s.events);
  const favorites = useAppSelector((s) => s.favorites);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [weekShift, setWeekShift] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = containerWidth > 0 && containerWidth < 600;
  const hourHeight = isMobile ? 42 : 64;

  const getDayLabel = (dateStr: string) => {
    if (!isMobile) return dateStr;
    const [d, m, y] = dateStr.split('.');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const dow = (date.getDay() + 6) % 7;
    return DAY_ABBR[dow];
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const onDropEvent = useCallback((eventId: string, date: string, duration: string, place: string) => {
    dispatch(moveEvent({ id: eventId, date, duration, place }));
  }, [dispatch]);

  const byDate = useMemo(
    () =>
      events.reduce<Record<string, CalendarEvent[]>>((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
      }, {}),
    [events]
  );

  const hours = useMemo(() => Array.from({ length: 24 }).map((_, i) => String(i).padStart(2, '0')), []);

  const days = useMemo(() => {
    if (view === 'day') {
      const day = new Date();
      day.setDate(day.getDate() + weekShift);
      return [toUiDate(day)];
    }
    const start = new Date();
    start.setDate(start.getDate() + weekShift * 7);
    return Array.from({ length: 7 }).map((_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return toUiDate(day);
    });
  }, [view, weekShift]);

  const rangeLabel = useMemo(() => {
    if (days.length === 1) return days[0];
    return `${days[0]} - ${days[days.length - 1]}`;
  }, [days]);

  const movePrev = () => setWeekShift((prev) => prev - 1);
  const moveNext = () => setWeekShift((prev) => prev + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      events.forEach((item) => {
        const [from] = item.duration.split('-');
        const [h, m] = from.split(':');
        const [d, mo, y] = item.date.split('.');
        const start = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(m));
        const diff = Math.round((start.getTime() - now.getTime()) / 60000);
        if (diff === 15) {
          notifyUpcomingEvent(item.title);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [events]);

  const openCreate = useCallback((date: string, hour?: string) => {
    setSelectedDate(date);
    if (hour) {
      const nextHour = String((Number(hour) + 1) % 24).padStart(2, '0');
      setSelectedDuration(`${hour}:00-${nextHour}:00`);
    } else {
      setSelectedDuration('');
    }
    setEditing(null);
  }, []);

  const close = () => {
    setSelectedDate('');
    setSelectedDuration('');
    setEditing(null);
  };

  return (
    <div ref={containerRef}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Modsen Calendar</h1>
      </div>
      <div className={styles.toolbar}>
        <Button variant="ghost" onClick={() => setWeekShift(0)}>
          Today
        </Button>
        <Button
          variant="icon"
          aria-label="prev"
          onClick={movePrev}
          leftIcon={<img src={chevronLeft} alt="" width={6} height={10} />}
        />
        <div className={styles.rangeLabel}>{rangeLabel}</div>
        <Button
          variant="icon"
          aria-label="next"
          onClick={moveNext}
          leftIcon={<img src={chevronRight} alt="" width={6} height={10} />}
        />
        <div className={styles.spacer} />
        <Segmented
          value={view}
          options={[
            { value: 'week', label: 'Week' },
            { value: 'day', label: 'Day' }
          ]}
          onChange={(v) => dispatch(setView(v))}
        />
      </div>
      <div className={styles.calendarFrame}>
        <div className={styles.daysRow}>
          <div className={styles.timeSpacer} />
          <div
            className={styles.days}
            style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
          >
            {days.map((day) => (
              <div key={day} className={styles.dayTitle}>
                {getDayLabel(day)}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bodyRow}>
          <div className={styles.timeCol}>
            {hours.map((h) => (
              <div key={h} className={styles.timeLabel} style={{ height: hourHeight }}>
                {h}
              </div>
            ))}
          </div>

          <div className={styles.gridArea} style={{ height: `${hourHeight * hours.length + 2}px` }}>
            <div className={styles.hLines} style={{ gridTemplateRows: `repeat(${hours.length}, ${hourHeight}px)` }}>
              {hours.map((h) => (
                <div key={h} className={styles.hLine} />
              ))}
              <div className={styles.hLine} />
            </div>
            <div
              className={styles.vLines}
              style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
            >
              {Array.from({ length: days.length + 1 }).map((_, i) => (
                <div key={i} className={styles.vLine} />
              ))}
            </div>

            <div className={styles.cells} style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((day) => (
                <div key={day} className={styles.dayCol} style={{ gridTemplateRows: `repeat(${hours.length}, ${hourHeight}px)` }}>
                  {hours.map((h) => (
                    <div
                      key={`${day}-${h}`}
                      className={styles.cell}
                      onClick={() => openCreate(day, h)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        const eventId = e.dataTransfer.getData('eventId');
                        const dragged = events.find((it) => it.id === eventId);
                        const movedDuration = shiftDuration(dragged?.duration ?? '', h);
                        onDropEvent(eventId, day, movedDuration, dragged?.place ?? 'Updated place');
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className={styles.eventsLayer} style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}>
              {days.map((day) => {
                const dayEvents = byDate[day] ?? [];
                return (
                  <div key={day} className={styles.eventsCol} style={{ gridTemplateRows: `repeat(${hours.length}, ${hourHeight}px)` }}>
                    {dayEvents.map((item) => {
                      const h = parseHour(item.duration);
                      const rowIndex = Math.max(0, Number(h));
                      const [from] = item.duration.split('-');
                      const span = parseDurationHours(item.duration);
                      return (
                        <article
                          key={item.id}
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('eventId', item.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditing(item);
                          }}
                          className={styles.eventCard}
                          style={{
                            gridRowStart: rowIndex + 1,
                            gridRowEnd: rowIndex + 1 + span,
                            borderColor: item.color,
                            background: getEventFill(item.color)
                          }}
                        >
                          <div className={styles.badges}>
                            <span className={styles.badge}>{from}</span>
                          </div>
                          <div className={styles.eventTitle}>{truncateText(item.title)}</div>
                          <button
                            className={`${styles.favBtn} ${favorites.includes(item.id) ? styles.favBtnActive : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(toggleFavorite(item.id));
                            }}
                          >
                            ★
                          </button>
                        </article>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Modal open={Boolean(selectedDate || editing)} onClose={close}>
        <EventForm
          date={selectedDate}
          presetDuration={selectedDuration}
          initial={editing}
          onSave={(item) => {
            if (editing) {
              dispatch(updateEventTitle({ id: item.id, title: item.title }));
            } else {
              dispatch(addEvent(item));
            }
            close();
          }}
          onDelete={(id) => {
            dispatch(deleteEvent(id));
            close();
          }}
        />
      </Modal>
    </div>
  );
};

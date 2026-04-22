import { FormEvent, useMemo, useRef, useState } from 'react';
import { CalendarEvent } from '@/common/types';
import { Button } from '@/components/common/Button';
import { EventSearch } from '@/components/eventSearch/EventSearch';
import { EVENT_COLOR_TOKENS } from '@/common/constants';
import { dateRegExp, durationRegExp, validateEventPlace, validateEventTitle } from '@/utils/validators';
import styles from '@/components/eventForm/styles/event-form.module.scss';
import { useClickOutside } from '@/hooks/useClickOutside';
import placeIcon from '@/assets/icons/place.svg';
import dateIcon from '@/assets/icons/date.svg';
import notesIcon from '@/assets/icons/notes.svg';
import timeIcon from '@/assets/icons/time.svg';
import expandMoreIcon from '@/assets/icons/expand-more.svg';

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `evt-${Date.now()}-${Math.random().toString(16).slice(2)}`;

interface Props {
  initial?: CalendarEvent | null;
  date: string;
  presetDuration?: string;
  onSave: (value: CalendarEvent) => void;
  onDelete?: (id: string) => void;
}

export const EventForm = ({ initial, date, presetDuration, onSave, onDelete }: Props) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [place, setPlace] = useState(initial?.place ?? '');
  const [eventDate, setEventDate] = useState(initial?.date ?? date);
  const [duration, setDuration] = useState(initial?.duration ?? presetDuration ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [color, setColor] = useState(initial?.color ?? '#ffcb33');
  const [colorOpen, setColorOpen] = useState(false);

  const colorRef = useRef<HTMLDivElement>(null);
  useClickOutside(colorRef, () => setColorOpen(false));

  const maskDate = (value: string) =>
    value
      .replace(/[^\d]/g, '')
      .slice(0, 8)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2}\.\d{2})(\d)/, '$1.$2');

  const maskDuration = (value: string) => {
    const onlyDigits = value.replace(/[^\d]/g, '').slice(0, 8);
    const first = onlyDigits.slice(0, 4);
    const second = onlyDigits.slice(4, 8);
    const left = first.replace(/^(\d{2})(\d{1,2})$/, '$1:$2');
    const right = second ? second.replace(/^(\d{2})(\d{1,2})$/, '$1:$2') : '';
    return right ? `${left}-${right}` : left;
  };

  const isTitleOk = validateEventTitle(title);
  const isPlaceOk = validateEventPlace(place);
  const isDateOk = dateRegExp.test(eventDate);
  const isDurationOk = durationRegExp.test(duration);
  const canSave = isTitleOk && (initial ? true : isPlaceOk && isDateOk && isDurationOk);

  const titleError = useMemo(() => (isTitleOk ? '' : 'Title is required, max 20 symbols'), [isTitleOk]);
  const placeError = useMemo(() => (initial || isPlaceOk ? '' : 'Place is required, max 20 symbols'), [initial, isPlaceOk]);
  const dateError = useMemo(() => (initial || isDateOk ? '' : 'Date format: DD.MM.YYYY'), [initial, isDateOk]);
  const durationError = useMemo(
    () => (initial || isDurationOk ? '' : 'Duration format: HH:MM-HH:MM'),
    [initial, isDurationOk]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    onSave({
      id: initial?.id ?? makeId(),
      title: title.trim(),
      place: initial?.place ?? place.trim(),
      date: initial?.date ?? eventDate,
      duration: initial?.duration ?? duration,
      description,
      color,
      isFavorite: initial?.isFavorite ?? false
    });
  };

  const toggleColorPicker = () => {
    if (!initial) setColorOpen(o => !o);
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.header}>
        <div className={styles.titleSearch}>
          <EventSearch value={title} onSelect={setTitle} error={titleError} inline />
        </div>
        <div className={styles.headerActions}>
          <div className={styles.colorPickerWrap} ref={colorRef}>
            <div className={styles.colorGroupBtn}>
              <button
                type="button"
                className={styles.colorDotBtn}
                onClick={toggleColorPicker}
                disabled={Boolean(initial)}
                aria-label="Pick color"
                aria-expanded={colorOpen}
              >
                <span
                  className={styles.colorDot}
                  style={{ background: color }}
                />
              </button>
              <button
                type="button"
                className={styles.expandBtn}
                onClick={toggleColorPicker}
                disabled={Boolean(initial)}
                aria-label="Open color picker"
                aria-expanded={colorOpen}
              >
                <img src={expandMoreIcon} alt="" width={10} height={6} />
              </button>
            </div>

            {colorOpen && (
              <div className={styles.colorPopover} role="listbox" aria-label="Event colors">
                {EVENT_COLOR_TOKENS.map(({ stroke }) => (
                  <button
                    key={stroke}
                    type="button"
                    role="option"
                    aria-selected={color === stroke}
                    aria-label={stroke}
                    className={styles.colorSwatch}
                    style={{
                      background: stroke,
                      borderColor: color === stroke ? '#333' : 'transparent'
                    }}
                    onClick={() => { setColor(stroke); setColorOpen(false); }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.line} />

      <div className={styles.content}>
        <div className={styles.row}>
          <span className={styles.rowIcon}>
            <img src={placeIcon} alt="" width={14} height={19} />
          </span>
          <input
            className={styles.fieldInput}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Add Place"
            disabled={Boolean(initial)}
            maxLength={20}
            aria-label="Event place"
          />
        </div>
        {placeError && <div className={styles.fieldError}>{placeError}</div>}

        <div className={styles.line} />

        <div className={styles.rowDouble}>
          <div className={styles.rowHalf}>
            <span className={styles.rowIcon}>
              <img src={dateIcon} alt="" width={18} height={20} />
            </span>
            <input
              className={styles.fieldInput}
              value={eventDate}
              onChange={(e) => setEventDate(maskDate(e.target.value))}
              placeholder="Add Date"
              disabled={Boolean(initial)}
              aria-label="Event date"
            />
          </div>
          <div className={styles.lineVertical} />
          <div className={styles.rowHalf}>
            <span className={styles.rowIcon}>
              <img src={timeIcon} alt="" width={20} height={20} />
            </span>
            <input
              className={styles.fieldInput}
              value={duration}
              onChange={(e) => setDuration(maskDuration(e.target.value))}
              placeholder="Add Time"
              disabled={Boolean(initial)}
              aria-label="Event duration"
            />
          </div>
        </div>
        {(dateError || durationError) && (
          <div className={styles.fieldError}>{dateError || durationError}</div>
        )}

        <div className={styles.line} />

        <div className={styles.row}>
          <span className={styles.rowIcon}>
            <img src={notesIcon} alt="" width={18} height={18} />
          </span>
          <input
            className={styles.fieldInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add Notes"
            disabled={Boolean(initial)}
            aria-label="Event notes"
          />
        </div>

        <div className={styles.line} />
      </div>

      <div className={styles.actions}>
        <Button variant="pill" type="submit" disabled={!canSave}>
          Save
        </Button>
        {initial && onDelete ? (
          <Button
            variant="pill"
            type="button"
            style={{ color: '#ab7878' }}
            onClick={() => {
              if (window.confirm('Delete event?')) onDelete(initial.id);
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </form>
  );
};

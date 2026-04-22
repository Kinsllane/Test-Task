import { useEffect, useRef, useState } from 'react';
import { searchKudaGoEvents } from '@/api/kudago';
import { useDebounce } from '@/hooks/useDebounce';
import { useClickOutside } from '@/hooks/useClickOutside';
import { showToast } from '@/components/common/Toast';
import styles from '@/components/eventSearch/styles/event-search.module.scss';
import { useAppDispatch } from '@/common/reduxHooks';
import { setLoading } from '@/store/uiSlice';

interface Props {
  value: string;
  onSelect: (value: string) => void;
  error?: string;
  inline?: boolean;
}

export const EventSearch = ({ value, onSelect, error, inline = false }: Props) => {
  const dispatch = useAppDispatch();
  const [query, setQuery] = useState(value);
  const [items, setItems] = useState<Array<{ id: number; title: string }>>([]);
  const [open, setOpen] = useState(false);
  const [loading, setSearchLoading] = useState(false);
  const debounced = useDebounce(query, 400);
  const ref = useRef<HTMLDivElement>(null);
  const suppressNextSearchRef = useRef(false);

  useClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (suppressNextSearchRef.current) {
      suppressNextSearchRef.current = false;
      return;
    }
    const clean = debounced.trim();
    const hasMeaningfulChars = /[A-Za-zА-Яа-я0-9]/.test(clean);
    if (clean.length < 2 || !hasMeaningfulChars) {
      setItems([]);
      setOpen(false);
      return;
    }
    setSearchLoading(true);
    dispatch(setLoading(true));
    searchKudaGoEvents(clean)
      .then((res) => {
        setItems(res.slice(0, 5));
        setOpen(true);
      })
      .catch(() => {
        showToast('Failed to fetch KudaGo events');
        setItems([]);
        setOpen(false);
      })
      .finally(() => {
        setSearchLoading(false);
        dispatch(setLoading(false));
      });
  }, [debounced, dispatch]);

  return (
    <div ref={ref} className={`${styles.wrap} ${inline ? styles.wrapInline : ''}`}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSelect(e.target.value);
        }}
        placeholder="Search event title..."
      />
      {loading ? <div className={styles.loading}>Loading...</div> : null}
      {open && items.length > 0 ? (
        <ul className={styles.dropdown}>
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                onSelect(item.title);
                setQuery(item.title);
                setOpen(false);
                setItems([]);
                suppressNextSearchRef.current = true;
              }}
            >
              {item.title}
            </li>
          ))}
        </ul>
      ) : null}
      {open && !loading && items.length === 0 ? (
        <div className={styles.empty}>No results</div>
      ) : null}
      {error ? <small className={styles.error}>{error}</small> : null}
    </div>
  );
};

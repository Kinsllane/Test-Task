import { useEffect } from 'react';

export const useClickOutside = <T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onOutside: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      onOutside();
    };

    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, onOutside]);
};

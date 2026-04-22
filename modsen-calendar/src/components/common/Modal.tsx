import { ReactNode, useEffect, useRef } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import styles from '@/components/common/styles/common.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ open, onClose, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, onClose);

  useEffect(() => {
    if (!open) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div ref={ref} className={styles.modal}>
        {children}
      </div>
    </div>
  );
};

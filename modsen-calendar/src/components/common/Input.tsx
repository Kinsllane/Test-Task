import { InputHTMLAttributes, ReactNode } from 'react';
import styles from '@/components/common/styles/common.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightAddon?: ReactNode;
}

export const Input = ({ label, rightAddon, error, className = '', ...props }: Props) => (
  <div className={styles.inputWrap}>
    {label ? <div className={styles.fieldLabel}>{label}</div> : null}
    <div className={styles.inputRow}>
      <input className={`${styles.input} ${className}`} {...props} />
      {rightAddon ? <div className={styles.rightAddon}>{rightAddon}</div> : null}
    </div>
    {error ? <small className={styles.error}>{error}</small> : null}
  </div>
);

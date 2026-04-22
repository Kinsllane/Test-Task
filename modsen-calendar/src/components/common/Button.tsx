import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from '@/components/common/styles/button.module.scss';

type Variant = 'primary' | 'secondary' | 'ghost' | 'pill' | 'icon' | 'auth';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

export const Button = ({
  variant = 'ghost',
  leftIcon,
  rightIcon,
  className = '',
  children,
  ...props
}: Props) => (
  <button className={`${styles.button} ${styles[variant]} ${className}`} {...props}>
    {leftIcon ? <span style={{ display: 'inline-flex', marginRight: 8 }}>{leftIcon}</span> : null}
    {children}
    {rightIcon ? <span style={{ display: 'inline-flex', marginLeft: 8 }}>{rightIcon}</span> : null}
  </button>
);

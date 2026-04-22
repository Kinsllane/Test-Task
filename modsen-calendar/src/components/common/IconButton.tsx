import { ButtonHTMLAttributes, ReactNode } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const IconButton = ({ children, ...props }: Props) => (
  <button
    type="button"
    {...props}
    style={{
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    {children}
  </button>
);


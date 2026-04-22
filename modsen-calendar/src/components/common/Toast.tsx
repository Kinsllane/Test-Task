import { useEffect, useState } from 'react';
import styles from '@/components/common/styles/common.module.scss';

let pushToast: ((message: string) => void) | null = null;

export const showToast = (message: string) => {
  if (pushToast) pushToast(message);
};

export const ToastContainer = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    pushToast = (message: string) => {
      setMessages((prev) => [...prev, message]);
      setTimeout(() => {
        setMessages((prev) => prev.slice(1));
      }, 3000);
    };
    return () => {
      pushToast = null;
    };
  }, []);

  return (
    <div className={styles.toastWrap}>
      {messages.map((message) => (
        <div key={`${message}-${Math.random()}`} className={styles.toast}>
          {message}
        </div>
      ))}
    </div>
  );
};

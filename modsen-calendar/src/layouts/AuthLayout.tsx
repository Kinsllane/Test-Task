import { ReactNode } from 'react';
import styles from '@/layouts/AuthLayout.module.scss';

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className={styles.wrap}>
    <div className={styles.authContainer}>
      <div className={styles.imageSection}>
        <img src="/auth-image.png" alt="" className={styles.authImage} />
        <div className={styles.imageTop}>
        </div>
        <div className={styles.imageBottom}>
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.logo}>Modsen Calendar</div>
        <div className={styles.card}>{children}</div>
      </div>
    </div>
  </div>
);

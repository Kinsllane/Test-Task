import { ReactNode } from 'react';
import styles from '@/layouts/AuthLayout.module.scss';

export const AuthLayout = ({ children }: { children: ReactNode }) => (
  <div className={styles.wrap}>
    <div className={styles.authContainer}>
      <div className={styles.imageSection}>
        <img src="/auth-image.png" alt="" className={styles.authImage} />
        <div className={styles.imageTop}>
          <p className={styles.imageWelcome}>Welcome</p>
          <p className={styles.imageSubtitle}>your day is in your hands</p>
        </div>
        <div className={styles.imageDots}>
          <span className={styles.dotActive} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
        <div className={styles.imageBottom}>
          <p className={styles.imageTitle}>Modsen Calendar</p>
          <p className={styles.imageDesc}>Use a calendar to plan your work day and week.</p>
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.logo}>Modsen Calendar</div>
        <div className={styles.card}>{children}</div>
      </div>
    </div>
  </div>
);

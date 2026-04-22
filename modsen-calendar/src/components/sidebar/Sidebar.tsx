import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/common/reduxHooks';
import { clearUser } from '@/store/authSlice';
import { logoutUser } from '@/api/firebaseAuth';
import { SettingsModal } from './SettingsModal';
import styles from '@/components/sidebar/styles/Sidebar.module.scss';
import calendarIcon from '@/assets/icons/calendar.svg';
import twitterIcon from '@/assets/icons/twitter.svg';
import facebookIcon from '@/assets/icons/facebook.svg';
import instagramIcon from '@/assets/icons/instagram.svg';
import githubIcon from '@/assets/icons/github.svg';
import settingsPng from '@/assets/icons/settings-instance.png';

export const Sidebar = () => {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logoutUser();
      dispatch(clearUser());
    }
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.head}>
          <button
            className={styles.settingsBtn}
            type="button"
            aria-label="settings"
            onClick={() => setSettingsOpen(true)}
          >
            <img src={settingsPng} alt="" width={32} height={30} />
          </button>

          <div className={styles.avatarWrap}>
            <div className={styles.avatarCircle} />
          </div>

          <div className={styles.userName}>{user?.firstName ? `Hello ${user.firstName}` : 'Hello Rosalie'}</div>
          <div className={styles.userEmail}>{user?.email ?? 'rosalie.rice@gmail.com'}</div>
        </div>

        <div className={styles.cards}>
          <button type="button" className={styles.card}>
            <span className={styles.cardIcon}>
              <img src={calendarIcon} alt="" width={18} height={20} />
            </span>
            <span className={styles.cardTitle}>Calendars</span>
            <span className={styles.cardDot} />
          </button>
        </div>

        <div className={styles.socialBlock}>
          <div className={styles.brandTitle}>Calendar</div>
          <div className={styles.brandText}>
            Plan your week, track upcoming meetings, and keep important events in one place.
          </div>
          <div className={styles.socialRow}>
            <a className={styles.social} href="#" aria-label="twitter">
              <img src={twitterIcon} alt="" />
            </a>
            <a className={styles.social} href="#" aria-label="facebook">
              <img src={facebookIcon} alt="" />
            </a>
            <a className={styles.social} href="#" aria-label="instagram">
              <img src={instagramIcon} alt="" />
            </a>
            <a className={styles.social} href="#" aria-label="github">
              <img src={githubIcon} alt="" />
            </a>
          </div>

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onLogout={handleLogout}
        userName={user?.firstName}
        userEmail={user?.email}
      />
    </>
  );
};

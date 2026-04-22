import { ReactNode, useState } from 'react';
import { Sidebar } from '@/components/sidebar/Sidebar';
import styles from '@/layouts/MainLayout.module.scss';

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className={styles.root}>
      <header className={styles.desktopHeader}>
        <span className={styles.desktopTitle}>Modsen Calendar</span>
      </header>

      <header className={styles.mobileHeader}>
        <button
          className={styles.hamburger}
          type="button"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className={styles.mobileTitle}>Modsen Calendar</span>
      </header>

      <div
        className={`${styles.overlay} ${drawerOpen ? styles.overlayVisible : ''}`}
        aria-hidden="true"
        onClick={closeDrawer}
      />

      <div
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
        aria-modal="true"
        role="dialog"
      >
        <button
          className={styles.drawerClose}
          type="button"
          aria-label="Close menu"
          onClick={closeDrawer}
        >
          ✕
        </button>
        <Sidebar />
      </div>

      <div className={styles.body}>
        <aside className={styles.desktopSidebar}>
          <Sidebar />
        </aside>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};
